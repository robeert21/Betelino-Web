import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/db";
import { galleryItems } from "@/db/schema";

// Parses a single-range "bytes=start-end" Range header into an R2 range.
// Multi-range requests aren't something video/image players send in
// practice, so unsupported ranges just fall back to a full response.
function parseRange(header: string, fileSize: number): { offset: number; length: number } | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;
  const [, startStr, endStr] = match;
  if (!startStr && !endStr) return null;

  if (!startStr) {
    const suffix = Math.min(Number(endStr), fileSize);
    return { offset: fileSize - suffix, length: suffix };
  }
  const offset = Number(startStr);
  if (offset >= fileSize) return null;
  const end = endStr ? Math.min(Number(endStr), fileSize - 1) : fileSize - 1;
  return { offset, length: end - offset + 1 };
}

// The public /galerie page links straight to these URLs, so — unlike
// /api/materials — this route serves without a session; only mutating it
// (upload/delete, in the sibling routes) stays admin-gated.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await params;
  const db = await getDb();
  const [item] = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.id, itemId))
    .limit(1);
  if (!item) {
    return new Response("Not found", { status: 404 });
  }

  const { env } = await getCloudflareContext({ async: true });

  const { searchParams } = new URL(request.url);
  const forceDownload = searchParams.get("download") === "1";
  const wantsThumb = searchParams.get("thumb") === "1";

  // Grid tiles ask for the small pre-generated JPEG instead of the original
  // — falls back to the full file for items uploaded before thumbnails
  // existed, or when generation failed at upload time.
  if (wantsThumb && item.thumbKey) {
    const thumb = await env.MATERIALS.get(item.thumbKey);
    if (thumb) {
      return new Response(thumb.body, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  }

  // Video (and PDF) players probe with a Range request before they'll play
  // or seek; without honoring it here every scrub — or even just loading a
  // thumbnail's metadata — pulls the entire file through the Worker, which
  // is what was making the gallery feel slow. R2 serves the byte range
  // directly so only the requested slice is read and transferred.
  const rangeHeader = request.headers.get("range");
  const range = rangeHeader ? parseRange(rangeHeader, item.fileSize) : null;

  const object = await env.MATERIALS.get(item.fileKey, range ? { range } : undefined);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  // Two filename params, per RFC 6266: a quoted ASCII-only fallback for
  // parsers that only understand `filename=`, and `filename*` with the
  // real UTF-8 name for everything else. Samsung Internet's Android
  // DownloadManager parses this strictly and silently drops the whole
  // download when `filename=` holds raw percent-escapes or non-ASCII
  // bytes instead of a spec-shaped value — Safari/Chrome desktop are
  // lenient about that and masked the bug.
  const asciiFallbackName = item.fileName.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "'");
  const contentDisposition = `${forceDownload ? "attachment" : "inline"}; filename="${asciiFallbackName}"; filename*=UTF-8''${encodeURIComponent(item.fileName)}`;

  const headers: Record<string, string> = {
    "Content-Type": item.fileType,
    "Content-Disposition": contentDisposition,
    "Accept-Ranges": "bytes",
    // Each item's file is immutable (edits create a new row/key), and the
    // gallery is public, so browsers (and any CDN in front) can cache
    // aggressively instead of re-downloading on every visit.
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  if (range) {
    headers["Content-Range"] = `bytes ${range.offset}-${range.offset + range.length - 1}/${item.fileSize}`;
    headers["Content-Length"] = String(range.length);
    return new Response(object.body, { status: 206, headers });
  }

  headers["Content-Length"] = String(item.fileSize);
  return new Response(object.body, { headers });
}

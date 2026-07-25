import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/db";
import { galleryItems } from "@/db/schema";
import { getCurrentUser, isAdminRole } from "@/lib/auth";
import { makeGalleryThumbnail } from "@/lib/gallery-thumbnail";

const MAX_GALLERY_FILE_SIZE = 100 * 1024 * 1024; // 100MB, covers short video clips

// Reads the raw request body once (no FormData) so the route handler can
// hand it straight to R2 without extra copies — same approach as
// /api/materials/upload. Note: this can't stream request.body directly into
// R2.put — with the D1/R2 bindings marked `remote = true` in wrangler.toml,
// local dev proxies them over a workerd RPC tunnel that doesn't forward a
// live ReadableStream reliably (uploads failed silently); a fully-buffered
// ArrayBuffer serializes over that tunnel fine.
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !isAdminRole(user.role)) {
    return Response.json({ error: "Nu ai acces la această acțiune." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("fileName");
  const fileType = searchParams.get("fileType") || "application/octet-stream";
  const caption = searchParams.get("caption");
  if (!fileName) {
    return Response.json({ error: "Parametri lipsă." }, { status: 400 });
  }
  if (!fileType.startsWith("image/") && !fileType.startsWith("video/")) {
    return Response.json({ error: "Sunt acceptate doar poze sau video-uri." }, { status: 400 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (!contentLength) {
    return Response.json({ error: "Alege un fișier." }, { status: 400 });
  }
  if (contentLength > MAX_GALLERY_FILE_SIZE) {
    return Response.json({ error: "Fișierul este prea mare (max 100MB)." }, { status: 400 });
  }

  const fileKey = `gallery/${crypto.randomUUID()}-${fileName}`;
  const { env } = await getCloudflareContext({ async: true });

  const body = await request.arrayBuffer();
  await env.MATERIALS.put(fileKey, body, {
    httpMetadata: { contentType: fileType },
  });

  let thumbKey: string | null = null;
  if (fileType.startsWith("image/")) {
    try {
      const thumbBytes = makeGalleryThumbnail(body);
      thumbKey = `gallery-thumb/${crypto.randomUUID()}.jpg`;
      await env.MATERIALS.put(thumbKey, thumbBytes, {
        httpMetadata: { contentType: "image/jpeg" },
      });
    } catch {
      thumbKey = null;
    }
  }

  const db = await getDb();
  await db.insert(galleryItems).values({
    fileKey,
    thumbKey,
    fileName,
    fileType,
    fileSize: contentLength,
    caption: caption || null,
    uploadedById: user.id,
  });

  return Response.json({ success: true });
}

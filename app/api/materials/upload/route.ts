import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/db";
import { stationFolders, stationMaterials } from "@/db/schema";
import { getCurrentUser, isLeaderRole } from "@/lib/auth";

const MAX_MATERIAL_SIZE = 50 * 1024 * 1024; // 50MB

// Reads the raw request body once (a single buffer, unlike the old server
// action which parsed multipart FormData — extra copies of the file that
// blew past the ~128MB Worker memory limit on anything but small files).
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !isLeaderRole(user.role)) {
    return Response.json({ error: "Nu ai acces la această acțiune." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get("folderId");
  const fileName = searchParams.get("fileName");
  const fileType = searchParams.get("fileType") || "application/octet-stream";
  if (!folderId || !fileName) {
    return Response.json({ error: "Parametri lipsă." }, { status: 400 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (!contentLength) {
    return Response.json({ error: "Alege un fișier." }, { status: 400 });
  }
  if (contentLength > MAX_MATERIAL_SIZE) {
    return Response.json({ error: "Fișierul este prea mare (max 50MB)." }, { status: 400 });
  }

  const db = await getDb();
  const [folder] = await db
    .select({ id: stationFolders.id, stationId: stationFolders.stationId })
    .from(stationFolders)
    .where(eq(stationFolders.id, folderId))
    .limit(1);
  if (!folder) {
    return Response.json({ error: "Folderul nu a fost găsit." }, { status: 404 });
  }

  const fileKey = `stations/${folder.stationId}/${folderId}/${crypto.randomUUID()}-${fileName}`;
  const { env } = await getCloudflareContext({ async: true });

  const body = await request.arrayBuffer();
  await env.MATERIALS.put(fileKey, body, {
    httpMetadata: { contentType: fileType },
  });

  await db.insert(stationMaterials).values({
    stationId: folder.stationId,
    folderId,
    fileKey,
    fileName,
    fileType,
    fileSize: contentLength,
    uploadedById: user.id,
  });

  return Response.json({ success: true });
}

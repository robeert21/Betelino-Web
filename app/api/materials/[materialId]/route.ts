import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/db";
import { stationMaterials } from "@/db/schema";
import { getCurrentUser, isLeaderRole } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ materialId: string }> },
) {
  const user = await getCurrentUser();
  if (!user || !isLeaderRole(user.role)) {
    return new Response("Not found", { status: 404 });
  }

  const { materialId } = await params;
  const db = await getDb();
  const [material] = await db
    .select()
    .from(stationMaterials)
    .where(eq(stationMaterials.id, materialId))
    .limit(1);
  if (!material) {
    return new Response("Not found", { status: 404 });
  }

  const { env } = await getCloudflareContext({ async: true });
  const object = await env.MATERIALS.get(material.fileKey);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": material.fileType || "application/octet-stream",
      // "inline" lets the browser preview supported types (images, PDF, text,
      // video/audio) directly in a new tab instead of forcing a download;
      // the browser still falls back to downloading types it can't render.
      "Content-Disposition": `inline; filename="${encodeURIComponent(material.fileName)}"`,
      "Content-Length": String(material.fileSize),
    },
  });
}

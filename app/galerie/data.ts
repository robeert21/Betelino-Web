import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { galleryItems, users } from "@/db/schema";

export type GalleryItemEntry = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  caption: string | null;
  uploadedByName: string;
  createdAt: Date;
};

export async function getGalleryItems(): Promise<GalleryItemEntry[]> {
  const db = await getDb();
  const rows = await db
    .select({
      id: galleryItems.id,
      fileName: galleryItems.fileName,
      fileType: galleryItems.fileType,
      fileSize: galleryItems.fileSize,
      caption: galleryItems.caption,
      uploadedByName: users.name,
      createdAt: galleryItems.createdAt,
    })
    .from(galleryItems)
    .innerJoin(users, eq(galleryItems.uploadedById, users.id))
    .orderBy(desc(galleryItems.createdAt));

  return rows;
}

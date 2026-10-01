"use server";

import { connectMongo } from "@/lib/mongodb";
import { Media, IMedia } from "@/lib/models/Media";
import { requireAuth } from "@/lib/authorization";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { emitSocketEvent } from "@/lib/socketEmit";
import { SOCKET_EVENTS } from "@/lib/socketEvents";

export type SerializedMedia = Omit<IMedia, "_id" | "createdAt" | "uploadedBy"> & {
  _id: string;
  createdAt: string;
};

function serializeMedia(doc: any): SerializedMedia {
  return {
    _id: doc._id.toString(),
    fileName: doc.fileName,
    fileUrl: doc.fileUrl,
    publicId: doc.publicId,
    fileType: doc.fileType,
    sizeInBytes: doc.sizeInBytes,
    width: doc.width,
    height: doc.height,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
  };
}

export async function getMedia() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    const media = await Media.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: media.map(serializeMedia) };
  } catch (error: any) {
    console.error("Error fetching media:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMedia(id: string) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    const mediaDoc = await Media.findById(id).lean();
    if (!mediaDoc) throw new Error("Media not found");
    
    // Delete from Cloudinary if publicId exists
    if (mediaDoc.publicId) {
      const resourceType = mediaDoc.fileType === "video" ? "video" : "image";
      await cloudinary.uploader.destroy(mediaDoc.publicId, { resource_type: resourceType });
    }
    
    await Media.findByIdAndDelete(id);
    
    const session = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    import('@/lib/audit').then(({ createAuditLog }) => {
      createAuditLog({
        adminEmail: session.email,
        action: 'DELETE',
        resource: 'Media',
        resourceId: id,
        metadata: { fileName: mediaDoc.fileName }
      });
    });
    
    revalidatePath("/admin/media");

    // Emit realtime event AFTER successful DB write
    emitSocketEvent(SOCKET_EVENTS.MEDIA_DELETED, {
      id,
      type: 'media',
      timestamp: new Date().toISOString(),
      adminEmail: session.email,
      metadata: { fileName: mediaDoc.fileName },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting media:", error);
    return { success: false, error: error.message };
  }
}

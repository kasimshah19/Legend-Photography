"use server";

import { connectMongo } from "@/lib/mongodb";
import { Film, IFilm } from "@/lib/models/Film";
import { requireAuth } from "@/lib/authorization";
import { revalidatePath } from "next/cache";

export type SerializedFilm = Omit<IFilm, "_id" | "createdAt" | "updatedAt"> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

function serializeFilm(doc: any): SerializedFilm {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    youtubeUrl: doc.youtubeUrl,
    youtubeId: doc.youtubeId,
    thumbnail: doc.thumbnail,
    description: doc.description,
    category: doc.category,
    featured: doc.featured,
    published: doc.published,
    displayOrder: doc.displayOrder,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function extractYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export async function listFilms() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();
    
    const films = await Film.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
    return { success: true, data: films.map(serializeFilm) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getFilmById(id: string) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();
    
    const film = await Film.findById(id).lean();
    if (!film) return { success: false, error: "Film not found" };
    
    return { success: true, data: serializeFilm(film) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createFilm(data: Omit<IFilm, "_id" | "createdAt" | "updatedAt" | "youtubeId">) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();

    const youtubeId = extractYoutubeId(data.youtubeUrl);
    if (!youtubeId) throw new Error("Invalid YouTube URL");

    const film = await Film.create({
      ...data,
      youtubeId,
    });

    revalidatePath("/admin/films");
    revalidatePath("/portfolio");
    
    const session = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    import('@/lib/audit').then(({ createAuditLog }) => {
      createAuditLog({
        adminEmail: session.email,
        action: 'CREATE',
        resource: 'Film',
        resourceId: film._id.toString(),
        metadata: { title: film.title }
      });
    });
    
    return { success: true, data: serializeFilm(film.toObject()) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateFilm(id: string, data: Omit<IFilm, "_id" | "createdAt" | "updatedAt" | "youtubeId">) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();

    const youtubeId = extractYoutubeId(data.youtubeUrl);
    if (!youtubeId) throw new Error("Invalid YouTube URL");

    const film = await Film.findByIdAndUpdate(
      id,
      { $set: { ...data, youtubeId } },
      { new: true }
    ).lean();
    
    if (!film) throw new Error("Film not found");

    revalidatePath("/admin/films");
    revalidatePath(`/admin/films/${id}`);
    revalidatePath("/portfolio");
    
    const session = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    import('@/lib/audit').then(({ createAuditLog }) => {
      createAuditLog({
        adminEmail: session.email,
        action: 'UPDATE',
        resource: 'Film',
        resourceId: id,
        metadata: { title: film.title }
      });
    });
    
    return { success: true, data: serializeFilm(film) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFilm(id: string) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();
    
    const film = await Film.findByIdAndDelete(id);
    
    revalidatePath("/admin/films");
    revalidatePath("/portfolio");
    
    if (film) {
      const session = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
      import('@/lib/audit').then(({ createAuditLog }) => {
        createAuditLog({
          adminEmail: session.email,
          action: 'DELETE',
          resource: 'Film',
          resourceId: id,
          metadata: { title: film.title }
        });
      });
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleFilmPublish(id: string, published: boolean) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();
    
    const film = await Film.findByIdAndUpdate(id, { $set: { published } });
    
    revalidatePath("/admin/films");
    revalidatePath("/portfolio");
    
    if (film) {
      const session = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
      import('@/lib/audit').then(({ createAuditLog }) => {
        createAuditLog({
          adminEmail: session.email,
          action: published ? 'PUBLISH' : 'UNPUBLISH',
          resource: 'Film',
          resourceId: id,
          metadata: { title: film.title }
        });
      });
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reorderFilms(updates: { id: string; displayOrder: number }[]) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();

    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: { displayOrder: update.displayOrder } }
      }
    }));

    await Film.bulkWrite(bulkOps);

    revalidatePath("/admin/films");
    revalidatePath("/portfolio");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

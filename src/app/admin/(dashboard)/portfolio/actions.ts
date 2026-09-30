'use server';

import { requireAuth } from '@/lib/authorization';
import { connectMongo } from '@/lib/mongodb';
import { Portfolio, type IPortfolio } from '@/lib/models/Portfolio';
import { revalidatePath } from 'next/cache';

// ─── Helpers ────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  await connectMongo();
  let candidate = slug;
  let counter = 1;
  while (true) {
    const query: any = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Portfolio.findOne(query).lean();
    if (!existing) return candidate;
    candidate = `${slug}-${counter}`;
    counter++;
    if (counter > 100) throw new Error('Could not generate unique slug');
  }
}

type ActionResult = { success: boolean; error?: string; data?: any };

// ─── List Albums ────────────────────────────────────────────

export async function listAlbums(filters?: {
  search?: string;
  category?: string;
  published?: string;
}): Promise<ActionResult> {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();

    const query: any = {};

    if (filters?.search) {
      query.title = { $regex: filters.search, $options: 'i' };
    }
    if (filters?.category && filters.category !== 'all') {
      query.category = filters.category;
    }
    if (filters?.published === 'published') {
      query.published = true;
    } else if (filters?.published === 'draft') {
      query.published = false;
    }

    const albums = await Portfolio.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(albums)) };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to fetch albums' };
  }
}

// ─── Get Single Album ───────────────────────────────────────

export async function getAlbum(id: string): Promise<ActionResult> {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();
    const album = await Portfolio.findById(id).lean();
    if (!album) return { success: false, error: 'Album not found' };
    return { success: true, data: JSON.parse(JSON.stringify(album)) };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to fetch album' };
  }
}

// ─── Create Album ───────────────────────────────────────────

export async function createAlbum(formData: FormData): Promise<ActionResult> {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const coverImage = formData.get('coverImage') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const eventDate = formData.get('eventDate') as string;
    const isFeatured = formData.get('isFeatured') === 'true';
    const published = formData.get('published') === 'true';
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const galleryJson = formData.get('gallery') as string;

    // Validation
    if (!title?.trim()) return { success: false, error: 'Title is required' };
    if (!category) return { success: false, error: 'Category is required' };
    if (!coverImage?.trim()) return { success: false, error: 'Cover image is required' };

    const validCategories = ['wedding', 'pre-wedding', 'maternity', 'fashion', 'kids'];
    if (!validCategories.includes(category)) {
      return { success: false, error: 'Invalid category' };
    }

    let slugInput = (formData.get('slug') as string)?.trim();
    const baseSlug = slugInput || generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    let gallery: any[] = [];
    if (galleryJson) {
      try { gallery = JSON.parse(galleryJson); } catch { gallery = []; }
    }

    // Get max displayOrder
    const maxOrder = await Portfolio.findOne().sort({ displayOrder: -1 }).lean();
    const displayOrder = maxOrder ? ((maxOrder as any).displayOrder || 0) + 1 : 0;

    const album = await Portfolio.create({
      title: title.trim(),
      slug,
      category,
      coverImage: coverImage.trim(),
      gallery,
      description: description?.trim() || '',
      location: location?.trim() || '',
      eventDate: eventDate?.trim() || '',
      isFeatured,
      published,
      displayOrder,
      seoTitle: seoTitle?.trim() || '',
      seoDescription: seoDescription?.trim() || '',
    });

    const session = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    import('@/lib/audit').then(({ createAuditLog }) => {
      createAuditLog({
        adminEmail: session.email,
        action: 'CREATE',
        resource: 'Portfolio',
        resourceId: album._id.toString(),
        metadata: { title: album.title }
      });
    });

    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');
    revalidatePath('/');

    return { success: true, data: { id: album._id.toString(), slug: album.slug } };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to create album' };
  }
}

// ─── Update Album ───────────────────────────────────────────

export async function updateAlbum(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();

    const existing = await Portfolio.findById(id);
    if (!existing) return { success: false, error: 'Album not found' };

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const coverImage = formData.get('coverImage') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const eventDate = formData.get('eventDate') as string;
    const isFeatured = formData.get('isFeatured') === 'true';
    const published = formData.get('published') === 'true';
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const galleryJson = formData.get('gallery') as string;

    // Validation
    if (!title?.trim()) return { success: false, error: 'Title is required' };
    if (!category) return { success: false, error: 'Category is required' };
    if (!coverImage?.trim()) return { success: false, error: 'Cover image is required' };

    const validCategories = ['wedding', 'pre-wedding', 'maternity', 'fashion', 'kids'];
    if (!validCategories.includes(category)) {
      return { success: false, error: 'Invalid category' };
    }

    let slugInput = (formData.get('slug') as string)?.trim();
    const baseSlug = slugInput || generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug, id);

    let gallery: any[] = [];
    if (galleryJson) {
      try { gallery = JSON.parse(galleryJson); } catch { gallery = existing.gallery; }
    }

    existing.title = title.trim();
    existing.slug = slug;
    existing.category = category as any;
    existing.coverImage = coverImage.trim();
    existing.gallery = gallery;
    existing.description = description?.trim() || '';
    existing.location = location?.trim() || '';
    existing.eventDate = eventDate?.trim() || '';
    existing.isFeatured = isFeatured;
    existing.published = published;
    existing.seoTitle = seoTitle?.trim() || '';
    existing.seoDescription = seoDescription?.trim() || '';

    await existing.save();

    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${slug}`);
    revalidatePath('/admin/portfolio');
    revalidatePath('/');

    return { success: true, data: { id: existing._id.toString(), slug } };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to update album' };
  }
}

// ─── Delete Album ───────────────────────────────────────────

export async function deleteAlbum(id: string): Promise<ActionResult> {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();

    const album = await Portfolio.findByIdAndDelete(id);
    if (!album) return { success: false, error: 'Album not found' };

    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');
    revalidatePath('/');

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to delete album' };
  }
}

// ─── Toggle Publish ─────────────────────────────────────────

export async function togglePublish(id: string): Promise<ActionResult> {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();

    const album = await Portfolio.findById(id);
    if (!album) return { success: false, error: 'Album not found' };

    album.published = !album.published;
    await album.save();

    const session = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    import('@/lib/audit').then(({ createAuditLog }) => {
      createAuditLog({
        adminEmail: session.email,
        action: album.published ? 'PUBLISH' : 'UNPUBLISH',
        resource: 'Portfolio',
        resourceId: album._id.toString(),
        metadata: { title: album.title }
      });
    });

    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${album.slug}`);
    revalidatePath('/admin/portfolio');
    revalidatePath('/');

    return { success: true, data: { published: album.published } };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to toggle publish' };
  }
}

// ─── Duplicate Album ────────────────────────────────────────

export async function duplicateAlbum(id: string): Promise<ActionResult> {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();

    const original = await Portfolio.findById(id).lean() as any;
    if (!original) return { success: false, error: 'Album not found' };

    const newSlug = await ensureUniqueSlug(`${original.slug}-copy`);
    const maxOrder = await Portfolio.findOne().sort({ displayOrder: -1 }).lean() as any;
    const displayOrder = maxOrder ? (maxOrder.displayOrder || 0) + 1 : 0;

    const { _id, createdAt, updatedAt, __v, ...rest } = original;

    await Portfolio.create({
      ...rest,
      title: `${original.title} (Copy)`,
      slug: newSlug,
      published: false,
      displayOrder,
    });

    revalidatePath('/admin/portfolio');

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to duplicate album' };
  }
}

// ─── Reorder Albums ─────────────────────────────────────────

export async function reorderAlbums(orderedIds: string[]): Promise<ActionResult> {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder: index } },
      },
    }));

    await Portfolio.bulkWrite(bulkOps);

    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to reorder albums' };
  }
}

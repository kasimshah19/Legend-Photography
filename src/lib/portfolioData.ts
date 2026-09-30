import { connectMongo } from '@/lib/mongodb';
import { Portfolio, type IPortfolio } from '@/lib/models/Portfolio';
import { portfolioAlbums } from '@/data/albums';
import { portfolioItems } from '@/data/portfolio';

/**
 * Returns published albums from MongoDB.
 * Falls back to static data if DB is empty or unreachable.
 */
export async function getPublishedAlbums() {
  try {
    await connectMongo();
    const dbAlbums = await Portfolio.find({ published: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    if (dbAlbums.length > 0) {
      return JSON.parse(JSON.stringify(dbAlbums)) as (IPortfolio & { _id: string })[];
    }
  } catch {
    // Fall through to static data
  }

  // Fallback: convert static albums to the same shape
  return portfolioAlbums.map((a, i) => ({
    _id: a.slug,
    title: a.title,
    slug: a.slug,
    category: a.category as any,
    coverImage: a.coverImage,
    gallery: a.images.map((img, j) => ({
      url: img.src,
      alt: img.alt,
      displayOrder: j,
    })),
    description: a.description,
    location: a.location || '',
    eventDate: a.date || '',
    isFeatured: false,
    published: true,
    displayOrder: i,
    seoTitle: '',
    seoDescription: '',
    ogImage: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

/**
 * Returns a single published album by slug.
 * Falls back to static data if not found in DB.
 */
export async function getPublishedAlbumBySlug(slug: string) {
  try {
    await connectMongo();
    const dbAlbum = await Portfolio.findOne({ slug, published: true }).lean();

    if (dbAlbum) {
      return JSON.parse(JSON.stringify(dbAlbum)) as IPortfolio & { _id: string };
    }
  } catch {
    // Fall through to static data
  }

  // Fallback: check static albums
  const staticAlbum = portfolioAlbums.find((a) => a.slug === slug);
  if (!staticAlbum) return null;

  return {
    _id: staticAlbum.slug,
    title: staticAlbum.title,
    slug: staticAlbum.slug,
    category: staticAlbum.category as any,
    coverImage: staticAlbum.coverImage,
    gallery: staticAlbum.images.map((img, j) => ({
      url: img.src,
      alt: img.alt,
      displayOrder: j,
    })),
    description: staticAlbum.description,
    location: staticAlbum.location || '',
    eventDate: staticAlbum.date || '',
    isFeatured: false,
    published: true,
    displayOrder: 0,
    seoTitle: '',
    seoDescription: '',
    ogImage: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Returns all published album slugs for static generation.
 */
export async function getAllPublishedSlugs(): Promise<string[]> {
  const staticSlugs = portfolioAlbums.map((a) => a.slug);

  try {
    await connectMongo();
    const dbSlugs = await Portfolio.find({ published: true }).select('slug').lean();
    const dbSlugList = dbSlugs.map((a: any) => a.slug);
    // Merge static + DB slugs, removing duplicates
    return [...new Set([...staticSlugs, ...dbSlugList])];
  } catch {
    return staticSlugs;
  }
}

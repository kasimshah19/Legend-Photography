import { connectMongo } from "./mongodb";
import { Film as DBFilm } from "./models/Film";
import { films as staticFilms, Film as StaticFilm } from "@/data/films";

export type PublicFilm = {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
  category?: string;
  description?: string;
  featured?: boolean;
};

export async function getPublishedFilms(): Promise<PublicFilm[]> {
  try {
    await connectMongo();
    const dbFilms = await DBFilm.find({ published: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    if (dbFilms && dbFilms.length > 0) {
      return dbFilms.map((doc: any) => ({
        id: doc._id.toString(),
        title: doc.title,
        youtubeId: doc.youtubeId,
        thumbnail: doc.thumbnail,
        category: doc.category,
        description: doc.description,
        featured: doc.featured,
      }));
    }
  } catch (error) {
    console.warn("Failed to fetch films from MongoDB, falling back to static data", error);
  }

  // Fallback to static data
  return staticFilms.map(f => ({
    ...f,
    category: f.category || "wedding",
  }));
}

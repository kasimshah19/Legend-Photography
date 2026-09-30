import { Schema, models, model } from "mongoose";

export interface IFilm {
  _id?: string;
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnail: string;
  description?: string;
  category: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const FilmSchema = new Schema<IFilm>(
  {
    title: { type: String, required: true, trim: true },
    youtubeUrl: { type: String, required: true, trim: true },
    youtubeId: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true, trim: true },
    description: { type: String },
    category: {
      type: String,
      required: true,
      enum: ["wedding", "pre-wedding", "maternity", "fashion", "kids", "event", "other"],
      default: "wedding",
    },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

FilmSchema.index({ published: 1, displayOrder: 1 });
FilmSchema.index({ featured: 1, published: 1 });

export const Film = models.Film ?? model<IFilm>("Film", FilmSchema);

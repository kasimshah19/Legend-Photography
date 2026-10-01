import { Schema, models, model } from "mongoose";

export type PortfolioCategoryType =
  | "wedding"
  | "pre-wedding"
  | "engagement"
  | "maternity"
  | "portrait"
  | "fashion"
  | "event"
  | "kids"
  | "other";

export interface IGalleryImage {
  url: string;
  alt: string;
  displayOrder: number;
}

export interface IPortfolio {
  title: string;
  slug: string;
  category: PortfolioCategoryType;
  coverImage: string;
  gallery: IGalleryImage[];
  location?: string;
  eventDate?: string;
  description?: string;
  isFeatured: boolean;
  published: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: true },
);

const PortfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: {
      type: String,
      required: true,
      enum: ["wedding", "pre-wedding", "engagement", "maternity", "portrait", "fashion", "event", "kids", "other"],
    },
    coverImage: { type: String, required: true },
    gallery: { type: [GalleryImageSchema], default: [] },
    location: { type: String, trim: true },
    eventDate: { type: String, trim: true },
    description: { type: String },
    isFeatured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    seoTitle: { type: String },
    seoDescription: { type: String },
    ogImage: { type: String },
  },
  { timestamps: true },
);

// Index for public queries
PortfolioSchema.index({ published: 1, displayOrder: 1 });

export const Portfolio =
  models.Portfolio ?? model<IPortfolio>("Portfolio", PortfolioSchema);

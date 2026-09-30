import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  features: string[];
  ctaLabel?: string;
  ctaHref?: string;
  portfolioFilter?: string;
  published: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    imageAlt: { type: String, required: true },
    features: [{ type: String }],
    ctaLabel: { type: String },
    ctaHref: { type: String },
    portfolioFilter: { type: String },
    published: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ServiceSchema.index({ published: 1, displayOrder: 1 });

export const Service = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

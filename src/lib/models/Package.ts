import mongoose, { Schema, Document } from "mongoose";

export interface IPackage extends Document {
  packageId: string;
  name: string;
  positioning: string;
  badge: string | null;
  priceLabel: string;
  hours: string;
  photos: string;
  album: string | null;
  video: string | null;
  features: string[];
  cta: string;
  displayOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema(
  {
    packageId: { type: String, required: true, unique: true }, // 'basic', 'standard', 'premium'
    name: { type: String, required: true },
    positioning: { type: String, required: true },
    badge: { type: String, default: null },
    priceLabel: { type: String, required: true },
    hours: { type: String, required: true },
    photos: { type: String, required: true },
    album: { type: String, default: null },
    video: { type: String, default: null },
    features: [{ type: String }],
    cta: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PackageSchema.index({ published: 1, displayOrder: 1 });

export const Package = mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);

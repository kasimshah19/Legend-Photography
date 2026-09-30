import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  youtubeUrl: string;
  googleMapsUrl: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema(
  {
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    googleMapsUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

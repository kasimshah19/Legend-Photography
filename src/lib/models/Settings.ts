import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  youtubeUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  pinterestUrl: string;
  linkedinUrl: string;
  otherSocialLinks: { platform: string; url: string }[];
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
    instagramUrl: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    twitterUrl: { type: String, default: "" },
    pinterestUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    otherSocialLinks: {
      type: [
        {
          platform: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      default: [],
    },
    googleMapsUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

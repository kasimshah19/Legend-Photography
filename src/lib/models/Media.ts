import { Schema, models, model } from "mongoose";

export interface IMedia {
  _id?: string;
  fileName: string;
  fileUrl: string; // URL of the uploaded file
  publicId?: string; // Cloudinary public ID
  fileType: "image" | "video";
  sizeInBytes: number;
  width?: number;
  height?: number;
  uploadedBy?: Schema.Types.ObjectId; // Reference to AdminUser
  createdAt?: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String }, // Cloudinary public_id
    fileType: { type: String, enum: ["image", "video"], required: true },
    sizeInBytes: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Media = models.Media ?? model<IMedia>("Media", MediaSchema);

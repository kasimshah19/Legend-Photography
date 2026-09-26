import { Schema, models, model } from "mongoose";

export type InquiryStatus =
  | "new"
  | "contacted"
  | "in-progress"
  | "converted"
  | "closed";

export interface IInquiry {
  name: string;
  phone: string;
  email?: string;
  service: string;
  eventDate?: string;
  location?: string;
  numberOfEvents?: string;
  message?: string;
  status: InquiryStatus;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    service: { type: String, required: true },
    eventDate: { type: String },
    location: { type: String },
    numberOfEvents: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "converted", "closed"],
      default: "new",
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export const Inquiry =
  models.Inquiry ?? model<IInquiry>("Inquiry", InquirySchema);

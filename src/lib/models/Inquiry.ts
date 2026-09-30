import { Schema, models, model } from "mongoose";

export type InquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "FOLLOW-UP"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "CLOSED";

export interface IInquiry {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  eventDate?: string;
  location?: string;
  numberOfEvents?: string;
  message?: string;
  status: InquiryStatus;
  adminNotes?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
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
      enum: ["NEW", "CONTACTED", "FOLLOW-UP", "CONFIRMED", "COMPLETED", "CANCELLED", "CLOSED"],
      default: "NEW",
    },
    adminNotes: { type: String },
    assignedTo: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export const Inquiry =
  models.Inquiry ?? model<IInquiry>("Inquiry", InquirySchema);

import mongoose from 'mongoose';

export interface INotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  resourceId?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    resourceId: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

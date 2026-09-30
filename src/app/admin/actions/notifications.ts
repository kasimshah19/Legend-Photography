
"use server";

import { connectMongo } from "@/lib/mongodb";
import { Notification } from "@/lib/models/Notification";
import { requireAuth } from "@/lib/authorization";
import { revalidatePath } from "next/cache";

export async function getUnreadNotifications() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();
    const notifications = await Notification.find({ isRead: false })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    
    return {
      success: true,
      notifications: JSON.parse(JSON.stringify(notifications))
    };
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}

export async function markAsRead(notificationId: string) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function markAllAsRead() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();
    await Notification.updateMany({ isRead: false }, { isRead: true });
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all as read:", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}

export async function getAllNotifications(page = 1, limit = 50) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    await connectMongo();
    
    const skip = (page - 1) * limit;
    
    const [notifications, total] = await Promise.all([
      Notification.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({})
    ]);
    
    return {
      success: true,
      notifications: JSON.parse(JSON.stringify(notifications)),
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Failed to fetch all notifications:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await requireAuth(['SUPER_ADMIN']); // Only Super Admin can delete notifications
    await connectMongo();
    await Notification.findByIdAndDelete(notificationId);
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}

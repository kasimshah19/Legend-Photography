"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Bell, Check, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { markAsRead, markAllAsRead, deleteNotification } from "@/app/admin/actions/notifications";

type Notification = {
  _id: string;
  type: string;
  title: string;
  message: string;
  resourceId?: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationsClientProps = {
  initialNotifications: Notification[];
  userRole: string;
};

export function NotificationsClient({ initialNotifications, userRole }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const res = await markAsRead(id);
    if (res.success) {
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    const res = await markAllAsRead();
    if (res.success) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
    setIsMarkingAll(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this notification?")) return;
    
    setDeletingId(id);
    const res = await deleteNotification(id);
    if (res.success) {
      setNotifications(prev => prev.filter(n => n._id !== id));
    } else {
      alert("Failed to delete notification.");
    }
    setDeletingId(null);
  };

  const getLinkForNotification = (n: Notification) => {
    if (n.type === 'NEW_INQUIRY') {
      return n.resourceId ? `/admin/inquiries/${n.resourceId}` : '/admin/inquiries';
    }
    return '#';
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-24">
        <Bell className="mb-4 h-12 w-12 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
        <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Bell size={18} />
          {unreadCount} Unread
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="text-sm font-medium text-black hover:underline disabled:opacity-50"
          >
            {isMarkingAll ? "Marking..." : "Mark all as read"}
          </button>
        )}
      </div>

      <ul className="divide-y divide-gray-100">
        {notifications.map(notification => (
          <li 
            key={notification._id} 
            className={`transition-colors hover:bg-gray-50 ${notification.isRead ? 'opacity-75' : 'bg-blue-50/20'}`}
          >
            <Link 
              href={getLinkForNotification(notification)}
              className="flex items-start gap-4 p-6 group"
            >
              <div className={`mt-1 flex h-2 w-2 shrink-0 rounded-full ${notification.isRead ? 'bg-transparent' : 'bg-blue-600'}`} />
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${notification.isRead ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
                    {notification.title}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {notification.message}
                </p>
                {notification.resourceId && (
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800">
                    View Details <ExternalLink size={12} />
                  </span>
                )}
              </div>

              <div className="ml-4 flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.isRead && (
                  <button
                    onClick={(e) => handleMarkAsRead(notification._id, e)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
                {userRole === 'SUPER_ADMIN' && (
                  <button
                    onClick={(e) => handleDelete(notification._id, e)}
                    disabled={deletingId === notification._id}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { getUnreadNotifications, markAsRead, markAllAsRead } from '@/app/admin/actions/notifications';
import Link from 'next/link';

type Notification = {
  _id: string;
  type: string;
  title: string;
  message: string;
  resourceId?: string;
  isRead: boolean;
  createdAt: string;
};

export function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const res = await getUnreadNotifications();
    if (res.success && res.notifications) {
      setNotifications(res.notifications);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Only call inside interval or inside a defined inner function to avoid direct render trigger warnings.
    let isMounted = true;
    
    const initFetch = async () => {
      await fetchNotifications();
    };
    
    initFetch();

    // Poll every 1 minute
    const interval = setInterval(() => {
      if (isMounted) fetchNotifications();
    }, 60000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await markAsRead(id);
    if (res.success) {
      setNotifications(prev => prev.filter(n => n._id !== id));
    }
  };

  const handleMarkAllAsRead = async () => {
    const res = await markAllAsRead();
    if (res.success) {
      setNotifications([]);
      setIsOpen(false);
    }
  };

  const getLinkForNotification = (n: Notification) => {
    if (n.type === 'NEW_INQUIRY') {
      return n.resourceId ? `/admin/inquiries/${n.resourceId}` : '/admin/inquiries';
    }
    return '#';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-900 focus:outline-none"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {notifications.length > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-4 text-sm text-gray-500 text-center">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-4 text-sm text-gray-500 text-center">No new notifications</div>
              ) : (
                notifications.map(notification => (
                  <Link 
                    href={getLinkForNotification(notification)}
                    key={notification._id}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => handleMarkAsRead(notification._id, e)}
                        className="text-gray-300 hover:text-green-600 p-1 rounded-full hover:bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div className="border-t border-gray-100 p-2">
              <Link
                href="/admin/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center text-xs font-medium text-gray-500 hover:text-black transition-colors py-1"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

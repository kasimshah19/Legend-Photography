'use client';

import { useRouter } from 'next/navigation';
import { useSocketEvent } from './SocketProvider';
import { useToast } from './ToastProvider';
import { SOCKET_EVENTS } from '@/lib/socketEvents';

/**
 * RealtimeEventHandler: a renderless component that listens to all Socket.IO events
 * and triggers toasts + route revalidation. Placed once in the admin layout.
 * 
 * Does NOT produce any DOM output itself.
 */
export function RealtimeEventHandler() {
  const { toast } = useToast();
  const router = useRouter();

  // ── Inquiry Events ──
  useSocketEvent(SOCKET_EVENTS.INQUIRY_CREATED, (data) => {
    toast('info', `New inquiry received: ${data.metadata?.service || 'Unknown'}`);
    router.refresh();
  });

  useSocketEvent(SOCKET_EVENTS.INQUIRY_STATUS_CHANGED, (data) => {
    if (data.adminEmail) {
      toast('info', `Inquiry status changed to ${data.metadata?.status || 'updated'} by ${data.adminEmail}`);
    }
    router.refresh();
  });

  // ── Album Events ──
  useSocketEvent(SOCKET_EVENTS.ALBUM_CREATED, (data) => {
    toast('success', `Album "${data.metadata?.title || ''}" created by ${data.adminEmail || 'admin'}`);
    router.refresh();
  });

  useSocketEvent(SOCKET_EVENTS.ALBUM_PUBLISHED, (data) => {
    toast('success', `Album "${data.metadata?.title || ''}" published`);
    router.refresh();
  });

  useSocketEvent(SOCKET_EVENTS.ALBUM_UNPUBLISHED, (data) => {
    toast('warning', `Album "${data.metadata?.title || ''}" unpublished`);
    router.refresh();
  });

  useSocketEvent(SOCKET_EVENTS.ALBUM_DELETED, (data) => {
    toast('warning', `Album "${data.metadata?.title || ''}" deleted`);
    router.refresh();
  });

  useSocketEvent(SOCKET_EVENTS.ALBUM_UPDATED, (data) => {
    router.refresh(); // Silently refresh, no toast for updates (to avoid spam)
  });

  // ── Media Events ──
  useSocketEvent(SOCKET_EVENTS.MEDIA_UPLOADED, (data) => {
    toast('success', `Media "${data.metadata?.fileName || ''}" uploaded`);
    router.refresh();
  });

  useSocketEvent(SOCKET_EVENTS.MEDIA_DELETED, (data) => {
    router.refresh();
  });

  // ── Film Events ──
  useSocketEvent(SOCKET_EVENTS.FILM_CREATED, (data) => {
    toast('success', `Film "${data.metadata?.title || ''}" created`);
    router.refresh();
  });

  useSocketEvent(SOCKET_EVENTS.FILM_PUBLISHED, (data) => {
    toast('success', `Film "${data.metadata?.title || ''}" published`);
    router.refresh();
  });

  useSocketEvent(SOCKET_EVENTS.FILM_DELETED, (data) => {
    router.refresh();
  });

  useSocketEvent(SOCKET_EVENTS.FILM_UPDATED, (data) => {
    router.refresh();
  });

  // ── Settings Events ──
  useSocketEvent(SOCKET_EVENTS.SETTINGS_UPDATED, (data) => {
    if (data.adminEmail) {
      toast('info', `Settings updated by ${data.adminEmail}`);
    }
    // Don't auto-refresh to protect unsaved changes
  });

  // ── Notification Events ──
  useSocketEvent(SOCKET_EVENTS.NOTIFICATION_CREATED, (data) => {
    // The NotificationsMenu component will handle badge refresh
    router.refresh();
  });

  // ── Service Events ──
  useSocketEvent(SOCKET_EVENTS.SERVICE_UPDATED, (data) => {
    router.refresh();
  });

  return null; // Renderless component
}

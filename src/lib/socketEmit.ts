import { SOCKET_EVENTS, type SocketEventPayload } from './socketEvents';

/**
 * Emit a Socket.IO event from a Server Action or API route.
 * 
 * This calls the internal HTTP endpoint on the custom server (server.js)
 * which then broadcasts to connected admin clients.
 * 
 * Database must be updated BEFORE calling this function.
 * This is fire-and-forget — failures are logged but don't break the operation.
 */
export async function emitSocketEvent(
  event: string,
  payload: SocketEventPayload,
  room?: string
): Promise<void> {
  try {
    const port = process.env.PORT || '3000';
    const res = await fetch(`http://127.0.0.1:${port}/_internal/socket-emit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, room, payload }),
    });

    if (!res.ok) {
      console.error(`[Socket emit failed] ${res.status}: ${await res.text()}`);
    }
  } catch (error: any) {
    // Non-blocking: Socket.IO is a nice-to-have, not critical path
    console.error('[Socket emit error]', error.message);
  }
}

// Convenience helpers for common events
export async function emitInquiryCreated(id: string, service: string) {
  await emitSocketEvent(
    SOCKET_EVENTS.INQUIRY_CREATED,
    {
      id,
      type: 'inquiry',
      timestamp: new Date().toISOString(),
      metadata: { service },
    },
    'admin:inquiries'
  );
}

export async function emitAlbumEvent(
  event: typeof SOCKET_EVENTS.ALBUM_CREATED | typeof SOCKET_EVENTS.ALBUM_UPDATED | typeof SOCKET_EVENTS.ALBUM_PUBLISHED | typeof SOCKET_EVENTS.ALBUM_UNPUBLISHED | typeof SOCKET_EVENTS.ALBUM_DELETED,
  id: string,
  adminEmail: string,
  title?: string
) {
  await emitSocketEvent(event, {
    id,
    type: 'album',
    timestamp: new Date().toISOString(),
    adminEmail,
    metadata: title ? { title } : undefined,
  });
}

export async function emitSettingsUpdated(adminEmail: string) {
  await emitSocketEvent(SOCKET_EVENTS.SETTINGS_UPDATED, {
    id: 'global',
    type: 'settings',
    timestamp: new Date().toISOString(),
    adminEmail,
  });
}

export async function emitNotificationCreated(id: string, type: string, title: string) {
  await emitSocketEvent(
    SOCKET_EVENTS.NOTIFICATION_CREATED,
    {
      id,
      type,
      timestamp: new Date().toISOString(),
      metadata: { title },
    },
    'admin:notifications'
  );
}

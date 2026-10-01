// Centralized Socket.IO event name definitions
// Used by both server and client to prevent typos and ensure consistency

export const SOCKET_EVENTS = {
  // Inquiry events
  INQUIRY_CREATED: 'inquiry:created',
  INQUIRY_UPDATED: 'inquiry:updated',
  INQUIRY_STATUS_CHANGED: 'inquiry:statusChanged',

  // Album/Portfolio events
  ALBUM_CREATED: 'album:created',
  ALBUM_UPDATED: 'album:updated',
  ALBUM_PUBLISHED: 'album:published',
  ALBUM_UNPUBLISHED: 'album:unpublished',
  ALBUM_DELETED: 'album:deleted',

  // Media events
  MEDIA_UPLOADED: 'media:uploaded',
  MEDIA_DELETED: 'media:deleted',

  // Film events
  FILM_CREATED: 'film:created',
  FILM_UPDATED: 'film:updated',
  FILM_PUBLISHED: 'film:published',
  FILM_DELETED: 'film:deleted',

  // Service events
  SERVICE_UPDATED: 'service:updated',

  // Settings events
  SETTINGS_UPDATED: 'settings:updated',

  // Notification events
  NOTIFICATION_CREATED: 'notification:created',
  NOTIFICATION_READ: 'notification:read',

  // Admin presence
  ADMIN_PRESENCE_CHANGED: 'admin:presenceChanged',

  // System events
  SYSTEM_MAINTENANCE: 'system:maintenance',
} as const;

// Socket rooms
export const SOCKET_ROOMS = {
  ADMIN_ALL: 'admin:all',
  ADMIN_SUPERADMIN: 'admin:superadmin',
  ADMIN_INQUIRIES: 'admin:inquiries',
  ADMIN_PORTFOLIO: 'admin:portfolio',
  ADMIN_NOTIFICATIONS: 'admin:notifications',
} as const;

// Event payload types (minimal, no sensitive data)
export interface SocketEventPayload {
  id: string;
  type: string;
  timestamp: string;
  adminEmail?: string; // who performed the action
  metadata?: Record<string, string | number | boolean>;
}

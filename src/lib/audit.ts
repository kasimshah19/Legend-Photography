import { AuditLog } from "@/lib/models/AuditLog";

type CreateAuditLogParams = {
  adminEmail: string;
  action: string; // e.g., 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'UNPUBLISH'
  resource: string; // e.g., 'Portfolio', 'Film', 'Inquiry', 'Media', 'Service', 'Settings', 'AdminUser'
  resourceId?: string;
  metadata?: any;
};

import { connectMongo } from "@/lib/mongodb";

export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    await connectMongo();
    await AuditLog.create(params);
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Non-blocking: we don't want to break the main action if audit logging fails
  }
}

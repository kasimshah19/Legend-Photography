"use server";

import { connectMongo } from "@/lib/mongodb";
import { AuditLog } from "@/lib/models/AuditLog";
import { requireAuth } from "@/lib/authorization";

export async function getAuditLogs(filters: { search?: string; resource?: string; action?: string; limit?: number; offset?: number } = {}) {
  try {
    await requireAuth(['SUPER_ADMIN']);
    await connectMongo();

    const query: any = {};
    if (filters.search) {
      query.$or = [
        { adminEmail: { $regex: filters.search, $options: "i" } },
        { resourceId: { $regex: filters.search, $options: "i" } },
      ];
    }
    if (filters.resource && filters.resource !== "ALL") {
      query.resource = filters.resource;
    }
    if (filters.action && filters.action !== "ALL") {
      query.action = filters.action;
    }

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    return { 
      success: true, 
      data: {
        logs: JSON.parse(JSON.stringify(logs)),
        total,
        limit,
        offset
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

"use server";

import { connectMongo } from "@/lib/mongodb";
import { Inquiry, IInquiry, InquiryStatus } from "@/lib/models/Inquiry";
import { requireAuth } from "@/lib/authorization";
import { revalidatePath } from "next/cache";
import { emitSocketEvent } from "@/lib/socketEmit";
import { SOCKET_EVENTS } from "@/lib/socketEvents";

export type SerializedInquiry = Omit<IInquiry, "_id" | "createdAt" | "updatedAt"> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

function serializeInquiry(doc: any): SerializedInquiry {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    phone: doc.phone,
    email: doc.email,
    service: doc.service,
    eventDate: doc.eventDate,
    location: doc.location,
    numberOfEvents: doc.numberOfEvents,
    message: doc.message,
    status: doc.status,
    adminNotes: doc.adminNotes,
    assignedTo: doc.assignedTo,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function getInquiries() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: inquiries.map(serializeInquiry) };
  } catch (error: any) {
    console.error("Error fetching inquiries:", error);
    return { success: false, error: error.message };
  }
}

export async function getInquiryById(id: string) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    const inquiry = await Inquiry.findById(id).lean();
    if (!inquiry) return { success: false, error: "Inquiry not found" };
    
    return { success: true, data: serializeInquiry(inquiry) };
  } catch (error: any) {
    console.error("Error fetching inquiry:", error);
    return { success: false, error: error.message };
  }
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    const validStatuses = ["NEW", "CONTACTED", "FOLLOW-UP", "CONFIRMED", "COMPLETED", "CANCELLED", "CLOSED"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).lean();
    
    if (!inquiry) throw new Error("Inquiry not found");
    
    const session = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    import('@/lib/audit').then(({ createAuditLog }) => {
      createAuditLog({
        adminEmail: session.email,
        action: 'STATUS_CHANGED',
        resource: 'Inquiry',
        resourceId: id,
        metadata: { newStatus: status, customer: inquiry.name }
      });
    });
    
    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${id}`);

    // Emit realtime event AFTER successful DB write
    emitSocketEvent(
      SOCKET_EVENTS.INQUIRY_STATUS_CHANGED,
      {
        id,
        type: 'inquiry',
        timestamp: new Date().toISOString(),
        adminEmail: session.email,
        metadata: { status },
      },
      'admin:inquiries'
    );

    return { success: true, data: serializeInquiry(inquiry) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateInquiryNotes(id: string, adminNotes: string) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { $set: { adminNotes } },
      { new: true }
    ).lean();
    
    if (!inquiry) throw new Error("Inquiry not found");
    
    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${id}`);
    
    return { success: true, data: serializeInquiry(inquiry) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) throw new Error("Inquiry not found");
    
    revalidatePath("/admin/inquiries");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

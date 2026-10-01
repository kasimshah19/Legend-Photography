"use server";

import { connectMongo } from "@/lib/mongodb";
import { Service, IService } from "@/lib/models/Service";
import { requireAuth } from "@/lib/authorization";
import { revalidatePath } from "next/cache";
import { emitSocketEvent } from "@/lib/socketEmit";
import { SOCKET_EVENTS } from "@/lib/socketEvents";

export type SerializedService = {
  _id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  features: string[];
  ctaLabel?: string;
  ctaHref?: string;
  portfolioFilter?: string;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

function serializeService(doc: any): SerializedService {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    image: doc.image,
    imageAlt: doc.imageAlt,
    features: doc.features,
    ctaLabel: doc.ctaLabel,
    ctaHref: doc.ctaHref,
    portfolioFilter: doc.portfolioFilter,
    published: doc.published,
    displayOrder: doc.displayOrder,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function listServices() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    const services = await Service.find().sort({ displayOrder: 1, createdAt: 1 }).lean();
    return { success: true, data: services.map(serializeService) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getServiceById(id: string) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    const service = await Service.findById(id).lean();
    if (!service) return { success: false, error: "Service not found" };
    
    return { success: true, data: serializeService(service) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createService(data: Partial<IService>) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();

    const service = await Service.create(data);

    revalidatePath("/admin/services");
    revalidatePath("/services");
    
    return { success: true, data: serializeService(service.toObject()) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateService(id: string, data: Partial<IService>) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).lean();
    
    if (!service) throw new Error("Service not found");

    revalidatePath("/admin/services");
    revalidatePath("/services");
    
    const session = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    import('@/lib/audit').then(({ createAuditLog }) => {
      createAuditLog({
        adminEmail: session.email,
        action: 'UPDATE',
        resource: 'Service',
        resourceId: id,
        metadata: { title: service.title }
      });
    });
    
    // Emit realtime event AFTER successful DB write
    emitSocketEvent(SOCKET_EVENTS.SERVICE_UPDATED, {
      id,
      type: 'service',
      timestamp: new Date().toISOString(),
      adminEmail: session.email,
      metadata: { title: service.title },
    });

    return { success: true, data: serializeService(service) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteService(id: string) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    await Service.findByIdAndDelete(id);
    
    revalidatePath("/admin/services");
    revalidatePath("/services");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleServicePublish(id: string, published: boolean) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    await Service.findByIdAndUpdate(id, { $set: { published } });
    
    revalidatePath("/admin/services");
    revalidatePath("/services");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reorderServices(updates: { id: string; displayOrder: number }[]) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();

    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: { displayOrder: update.displayOrder } }
      }
    }));

    await Service.bulkWrite(bulkOps);

    revalidatePath("/admin/services");
    revalidatePath("/services");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

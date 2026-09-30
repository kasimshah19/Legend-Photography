"use server";

import { connectMongo } from "@/lib/mongodb";
import { Package, IPackage } from "@/lib/models/Package";
import { requireAuth } from "@/lib/authorization";
import { revalidatePath } from "next/cache";

export type SerializedPackage = {
  _id: string;
  packageId: string;
  name: string;
  positioning: string;
  badge: string | null;
  priceLabel: string;
  hours: string;
  photos: string;
  album: string | null;
  video: string | null;
  features: string[];
  cta: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

function serializePackage(doc: any): SerializedPackage {
  return {
    _id: doc._id.toString(),
    packageId: doc.packageId,
    name: doc.name,
    positioning: doc.positioning,
    badge: doc.badge,
    priceLabel: doc.priceLabel,
    hours: doc.hours,
    photos: doc.photos,
    album: doc.album,
    video: doc.video,
    features: doc.features,
    cta: doc.cta,
    published: doc.published,
    displayOrder: doc.displayOrder,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function listPackages() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    const packages = await Package.find().sort({ displayOrder: 1 }).lean();
    return { success: true, data: packages.map(serializePackage) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPackageById(id: string) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();
    
    const pkg = await Package.findById(id).lean();
    if (!pkg) return { success: false, error: "Package not found" };
    
    return { success: true, data: serializePackage(pkg) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePackage(id: string, data: Partial<IPackage>) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();

    const pkg = await Package.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).lean();
    
    if (!pkg) throw new Error("Package not found");

    revalidatePath("/admin/packages");
    revalidatePath("/services");
    
    return { success: true, data: serializePackage(pkg) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Ensure the 3 basic packages exist
export async function initializePackages() {
  try {
    await connectMongo();
    const count = await Package.countDocuments();
    if (count === 0) {
      const { packages } = await import("@/data/services");
      await Package.insertMany(packages.map((p, i) => ({
        ...p,
        packageId: p.id,
        displayOrder: i,
        published: true
      })));
    }
  } catch (error) {
    console.error("Failed to initialize packages", error);
  }
}

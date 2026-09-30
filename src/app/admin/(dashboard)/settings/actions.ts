"use server";

import { connectMongo } from "@/lib/mongodb";
import { Settings, ISettings } from "@/lib/models/Settings";
import { requireAuth } from "@/lib/authorization";
import { revalidatePath } from "next/cache";

export type SerializedSettings = {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  youtubeUrl: string;
  googleMapsUrl: string;
};

export async function getSettings(): Promise<{ success: boolean; data?: SerializedSettings; error?: string }> {
  try {
    await connectMongo();
    
    // Attempt to find existing settings
    let settings = await Settings.findOne().lean();
    
    // Return empty defaults if not found
    if (!settings) {
      return { 
        success: true, 
        data: {
          address: "",
          phone: "",
          email: "",
          whatsapp: "",
          youtubeUrl: "",
          googleMapsUrl: "",
        } 
      };
    }
    
    return { 
      success: true, 
      data: {
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
        whatsapp: settings.whatsapp || "",
        youtubeUrl: settings.youtubeUrl || "",
        googleMapsUrl: settings.googleMapsUrl || "",
      } 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSettings(data: SerializedSettings) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    await connectMongo();

    const existing = await Settings.findOne();

    if (existing) {
      await Settings.findByIdAndUpdate(existing._id, { $set: data });
    } else {
      await Settings.create(data);
    }

    // Revalidate paths that use settings
    revalidatePath("/", "layout"); // Since navbar and footer might use it
    
    const session = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    import('@/lib/audit').then(({ createAuditLog }) => {
      createAuditLog({
        adminEmail: session.email,
        action: 'UPDATE',
        resource: 'Settings',
        resourceId: existing ? existing._id.toString() : 'global',
        metadata: { updated: true }
      });
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

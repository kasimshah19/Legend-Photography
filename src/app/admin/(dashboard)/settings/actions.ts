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
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  pinterestUrl: string;
  linkedinUrl: string;
  otherSocialLinks: { platform: string; url: string }[];
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
          instagramUrl: "",
          facebookUrl: "",
          twitterUrl: "",
          pinterestUrl: "",
          linkedinUrl: "",
          otherSocialLinks: [],
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
        instagramUrl: settings.instagramUrl || "",
        facebookUrl: settings.facebookUrl || "",
        twitterUrl: settings.twitterUrl || "",
        pinterestUrl: settings.pinterestUrl || "",
        linkedinUrl: settings.linkedinUrl || "",
        otherSocialLinks: settings.otherSocialLinks || [],
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

    // Emit realtime event AFTER successful DB write
    import('@/lib/socketEmit').then(({ emitSettingsUpdated }) => {
      emitSettingsUpdated(session.email);
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

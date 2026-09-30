import { siteConfig, normalizeYoutubeUrl } from "@/data/siteConfig";

export async function getSiteSettings() {
  try {
    const { connectMongo } = await import('@/lib/mongodb');
    const { Settings } = await import('@/lib/models/Settings');
    
    await connectMongo();
    const dbSettings = await Settings.findOne().lean();

    if (dbSettings) {
      return {
        ...siteConfig,
        phone: dbSettings.phone || siteConfig.phone,
        whatsapp: dbSettings.whatsapp || siteConfig.whatsapp,
        email: dbSettings.email || siteConfig.email,
        youtube: {
          url: dbSettings.youtubeUrl ? normalizeYoutubeUrl(dbSettings.youtubeUrl) : siteConfig.youtube.url
        },
        location: {
          ...siteConfig.location,
          address: dbSettings.address || siteConfig.location.address,
          googleMapsUrl: dbSettings.googleMapsUrl || siteConfig.location.googleMapsUrl
        }
      };
    }
  } catch (error) {
    console.warn("Failed to fetch settings from DB, falling back to static config", error);
  }
  
  return siteConfig;
}

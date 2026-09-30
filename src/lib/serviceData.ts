import { connectMongo } from "./mongodb";
import { Service as DBService } from "./models/Service";
import { Package as DBPackage } from "./models/Package";
import { services as staticServices, packages as staticPackages, ServiceItem } from "@/data/services";

export async function getPublishedServices(): Promise<ServiceItem[]> {
  try {
    await connectMongo();
    const dbServices = await DBService.find({ published: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    if (dbServices && dbServices.length > 0) {
      return dbServices.map((doc: any) => ({
        id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        image: doc.image,
        imageAlt: doc.imageAlt,
        features: doc.features,
        cta: doc.ctaLabel ? { label: doc.ctaLabel, href: doc.ctaHref || "" } : undefined,
        portfolioFilter: doc.portfolioFilter,
      }));
    }
  } catch (error) {
    console.warn("Failed to fetch services from MongoDB, falling back to static data", error);
  }

  return staticServices;
}

export async function getPublishedPackages(): Promise<typeof staticPackages> {
  try {
    await connectMongo();
    const dbPackages = await DBPackage.find({ published: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    if (dbPackages && dbPackages.length > 0) {
      return dbPackages.map((doc: any) => ({
        id: doc.packageId,
        name: doc.name,
        positioning: doc.positioning,
        badge: doc.badge,
        price: null,
        priceLabel: doc.priceLabel,
        hours: doc.hours,
        photos: doc.photos,
        album: doc.album,
        video: doc.video,
        features: doc.features,
        cta: doc.cta,
      }));
    }
  } catch (error) {
    console.warn("Failed to fetch packages from MongoDB, falling back to static data", error);
  }

  return staticPackages;
}

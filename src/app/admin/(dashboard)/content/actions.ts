"use server";

import { requireAuth } from "@/lib/authorization";
import { connectMongo } from "@/lib/mongodb";
import { Homepage } from "@/lib/models/Homepage";
import { Portfolio } from "@/lib/models/Portfolio";
import { Film } from "@/lib/models/Film";
import { revalidatePath } from "next/cache";

export async function getHomepageSettings() {
  await requireAuth(['SUPER_ADMIN', 'EDITOR']);
  await connectMongo();
  let settings = await Homepage.findOne().lean();
  if (!settings) {
    settings = await Homepage.create({});
  }
  return JSON.parse(JSON.stringify(settings));
}

export async function getSelectableContent() {
  await requireAuth(['SUPER_ADMIN', 'EDITOR']);
  await connectMongo();
  const films = await Film.find({ published: true }).select("_id title").lean();
  const albums = await Portfolio.find({ published: true }).select("_id title").lean();
  
  return {
    films: JSON.parse(JSON.stringify(films)),
    albums: JSON.parse(JSON.stringify(albums))
  };
}

export async function updateHomepageSettings(data: any) {
  await requireAuth(['SUPER_ADMIN', 'EDITOR']);
  await connectMongo();
  
  let settings = await Homepage.findOne();
  if (!settings) {
    settings = new Homepage(data);
  } else {
    settings.set(data);
  }
  
  await settings.save();
  
  const session = await requireAuth(['SUPER_ADMIN', 'EDITOR']);
  import('@/lib/audit').then(({ createAuditLog }) => {
    createAuditLog({
      adminEmail: session.email,
      action: 'UPDATE',
      resource: 'Homepage',
      resourceId: settings._id.toString(),
      metadata: { updated: true }
    });
  });

  revalidatePath("/");
  return JSON.parse(JSON.stringify(settings));
}

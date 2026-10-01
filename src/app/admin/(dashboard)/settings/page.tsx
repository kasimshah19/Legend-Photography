import { getSettings } from "./actions";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const result = await getSettings();
  
  const initialSettings = result.success && result.data ? result.data : {
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
  };

  return <SettingsClient initialSettings={initialSettings} />;
}

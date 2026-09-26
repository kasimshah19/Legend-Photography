import { siteConfig } from "./siteConfig";

export const contactData = {
  photographer: {
    name: "Mukesh Patil",
    role: "Photographer / Founder",
    image: "/images/self/mukesh.png",
    story: "Photography, for me, is about preserving the feeling behind a moment—not simply documenting what happened.\n\nOver the years, I have had the privilege of witnessing some of the most profound and intimate moments in people's lives. My approach is deeply rooted in cinematic storytelling. I believe in capturing the raw, unfiltered emotions that make your story uniquely yours—whether it's the quiet anticipation before walking down the aisle, or the chaotic joy of a grand celebration.\n\nWhen you work with Legend Photography, you are not just hiring a team with cameras. You are inviting us to be quiet observers of your most cherished memories. We promise to frame these fleeting instances into timeless art with the utmost care and dedication.",
  },
  studio: {
    name: siteConfig.name,
    address: "Legend Photography, Dondaicha",
    city: "Dhule",
    state: "Maharashtra - 425408",
    country: "India",
    googleMapsUrl: "https://maps.google.com/maps?q=Dondaicha,+Maharashtra+425408",
    latitude: null,
    longitude: null,
  },
  phone: siteConfig.phone || "[Phone Number]",
  whatsapp: siteConfig.whatsapp || "[WhatsApp Number]",
  email: siteConfig.email || "[Email Address]",
  social: {
    instagram: siteConfig.instagram.url || "",
    facebook: "",
    youtube: siteConfig.youtube.url || "",
  }
};

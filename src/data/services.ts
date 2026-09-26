export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  features?: string[];
  cta?: { label: string; href: string };
  portfolioFilter?: string;
};

export const services: ServiceItem[] = [
  {
    id: "wedding",
    title: "Wedding Photography",
    description:
      "Your wedding is a collection of moments, emotions and people that deserve to be remembered.",
    image: "/images/portfolio/wedding-01.jpg",
    imageAlt: "Wedding photography by Legend Photography",
    features: [
      "Candid moments",
      "Couple portraits",
      "Family moments",
      "Ceremonies",
      "Details",
      "Special moments",
    ],
    cta: { label: "Explore Wedding Work", href: "/portfolio?category=wedding" },
    portfolioFilter: "wedding",
  },
  {
    id: "pre-wedding",
    title: "Pre-Wedding Photography",
    description: "A cinematic experience focused on your story, chemistry and connection.",
    image: "/images/portfolio/prewedding-01.jpg",
    imageAlt: "Pre-wedding photography by Legend Photography",
    features: [
      "Couple portraits",
      "Location-based shoot",
      "Cinematic frames",
      "Creative concepts",
      "Edited photographs",
    ],
    cta: { label: "View Work", href: "/portfolio?category=pre-wedding" },
    portfolioFilter: "pre-wedding",
  },
  {
    id: "maternity",
    title: "Maternity Photography",
    description:
      "Elegant portraits celebrating one of life's most beautiful journeys.",
    image: "/images/portfolio/maternity-01.jpg",
    imageAlt: "Maternity photography by Legend Photography",
  },
  {
    id: "portrait-fashion",
    title: "Portrait & Fashion",
    description:
      "Professional portraits, creative fashion and personal branding.",
    image: "/images/portfolio/fashion-01.jpg",
    imageAlt: "Portrait and fashion photography by Legend Photography",
  },
  {
    id: "events",
    title: "Events & Celebrations",
    description: "Complete photography coverage for your special occasions.",
    image: "/images/portfolio/events-01.jpg",
    imageAlt: "Event photography by Legend Photography",
  },
];

export const packages = [
  {
    id: "basic",
    name: "Intimate",
    positioning: "Essential coverage designed for intimate celebrations and small gatherings.",
    badge: null,
    price: null,
    priceLabel: "₹ 45,000",
    hours: "Up to 6 Hours Coverage",
    photos: "300+ Edited High-Res Photos",
    album: null,
    video: null,
    features: ["1 Lead Photographer", "Candid & Traditional Coverage", "Online Digital Gallery"],
    cta: "Book This Package",
  },
  {
    id: "standard",
    name: "Classic",
    positioning: "A perfectly balanced photography experience for couples wanting meaningful coverage.",
    badge: "MOST POPULAR",
    price: null,
    priceLabel: "₹ 1,20,000",
    hours: "Up to 12 Hours Coverage",
    photos: "600+ Edited High-Res Photos",
    album: "Premium 40-Page Layflat Album",
    video: "3-5 Minute Cinematic Highlights",
    features: ["2 Lead Photographers", "1 Traditional Videographer", "Complimentary Pre-Wedding Session"],
    cta: "Book This Package",
  },
  {
    id: "premium",
    name: "Legendary",
    positioning: "The most comprehensive storytelling experience for grand celebrations and multi-day events.",
    badge: null,
    price: null,
    priceLabel: "₹ 2,50,000",
    hours: "Full Event / Multi-Day Coverage",
    photos: "1200+ Edited High-Res Photos",
    album: "Two Premium Layflat Albums",
    video: "Full Cinematic Film + 1 Min Teaser",
    features: ["Full Creative Team (Photo + Video)", "Aerial Drone Coverage", "Same-Day Edit (Reels)", "Hard Drive Delivery"],
    cta: "Book This Package",
  }
];

export const processSteps = [
  { 
    step: "01", 
    title: "INQUIRY", 
    description: "Reach out and tell us about your event, your vision, and preferred dates." 
  },
  { 
    step: "02", 
    title: "CONSULTATION", 
    description: "We discuss availability, align on package details, and lock your dates with a formal booking." 
  },
  { 
    step: "03", 
    title: "THE SHOOT", 
    description: "Our dedicated team discreetly captures the magic and authentic emotions of your day." 
  },
  { 
    step: "04", 
    title: "POST-PRODUCTION", 
    description: "Every photograph and frame of video undergoes our signature cinematic grading process." 
  },
  { 
    step: "05", 
    title: "DELIVERY", 
    description: "You receive your final digital gallery, cinematic films, and handcrafted premium albums." 
  },
];

export const faqs = [
  {
    id: "advance",
    question: "How do we lock our dates and what is the payment schedule?",
    answer: "We require a 50% retainer fee to secure your dates. The next 40% is due one week before the event, and the final 10% is payable upon delivery of the digital gallery.",
  },
  {
    id: "delivery",
    question: "How long does it take to receive our photos and videos?",
    answer: "You will receive a sneak peek of 20-30 images within 48 hours. The complete edited digital gallery is delivered within 3-4 weeks. Cinematic films and physical albums take about 6-8 weeks, ensuring the highest quality of editing and design.",
  },
  {
    id: "outstation",
    question: "Do you travel for destination weddings?",
    answer: "Absolutely! We love traveling to capture love stories. For outstation shoots, travel, accommodation, and local transport for our team are to be arranged or reimbursed by the client.",
  },
  {
    id: "editing",
    question: "Do you provide raw, unedited photos?",
    answer: "Our signature style relies heavily on our post-production grading. Therefore, we do not provide raw photos or video files, as they do not represent the final finished quality of Legend Photography.",
  },
];

export type PortfolioCategory =
  | "wedding"
  | "pre-wedding"
  | "candid"
  | "maternity"
  | "portrait"
  | "fashion"
  | "events";

export type PortfolioItem = {
  id: string;
  src: string;
  alt: string;
  category: PortfolioCategory;
  title: string;
  albumSlug?: string;
  /** masonry layout hint */
  layout?: "tall" | "wide" | "standard" | "detail";
};

export const portfolioCategories: { id: PortfolioCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "wedding", label: "Wedding" },
  { id: "pre-wedding", label: "Pre-Wedding" },
  { id: "candid", label: "Candid" },
  { id: "maternity", label: "Maternity" },
  { id: "portrait", label: "Portrait" },
  { id: "fashion", label: "Fashion" },
  { id: "events", label: "Events" },
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: "w1",
    src: "/images/portfolio/wedding-01.jpg",
    alt: "Indian wedding couple portrait by Legend Photography",
    category: "wedding",
    title: "Wedding ceremony portrait",
    albumSlug: "rahul-priya-wedding",
    layout: "tall",
  },
  {
    id: "w2",
    src: "/images/portfolio/wedding-02.jpg",
    alt: "Pre-wedding couple photography in natural light",
    category: "pre-wedding",
    title: "Pre-wedding session",
    albumSlug: "amit-neha-pre-wedding",
    layout: "wide",
  },
  {
    id: "c1",
    src: "/images/portfolio/candid-01.jpg",
    alt: "Candid wedding celebration photography",
    category: "candid",
    title: "Candid celebration",
    layout: "standard",
  },
  {
    id: "m1",
    src: "/images/portfolio/maternity-01.jpg",
    alt: "Elegant maternity portrait photography",
    category: "maternity",
    title: "Maternity portrait",
    albumSlug: "riya-maternity",
    layout: "detail",
  },
  {
    id: "p1",
    src: "/images/portfolio/portrait-01.jpg",
    alt: "Professional portrait photography session",
    category: "portrait",
    title: "Portrait session",
    layout: "tall",
  },
  {
    id: "f1",
    src: "/images/portfolio/fashion-01.jpg",
    alt: "Fashion photography with editorial styling",
    category: "fashion",
    title: "Fashion editorial",
    albumSlug: "fashion-editorial-spring",
    layout: "wide",
  },
  {
    id: "e1",
    src: "/images/portfolio/events-01.jpg",
    alt: "Event celebration photography coverage",
    category: "events",
    title: "Special event",
    layout: "standard",
  },
  {
    id: "pw1",
    src: "/images/portfolio/prewedding-01.jpg",
    alt: "Pre-wedding couple photography outdoors",
    category: "pre-wedding",
    title: "Outdoor pre-wedding",
    albumSlug: "amit-neha-pre-wedding",
    layout: "tall",
  },
  {
    id: "w3",
    src: "/images/portfolio/wedding-03.jpg",
    alt: "Traditional Indian wedding ceremony photography",
    category: "wedding",
    title: "Wedding rituals",
    layout: "detail",
  },
  {
    id: "c2",
    src: "/images/portfolio/candid-02.jpg",
    alt: "Candid emotional moment at wedding",
    category: "candid",
    title: "Emotional candid",
    layout: "wide",
  },
  {
    id: "w4",
    src: "/images/portfolio/wedding-04.jpg",
    alt: "Wedding reception photography",
    category: "wedding",
    title: "Reception celebration",
    layout: "standard",
  },
];

export const featuredWorkIds = [
  "w1",
  "c2",
  "w3",
  "pw1",
  "f1",
  "m1",
  "c1",
  "w4",
];

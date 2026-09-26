import type { PortfolioCategory, PortfolioItem } from "./portfolio";
import { portfolioItems } from "./portfolio";

export type Album = {
  slug: string;
  title: string;
  category: PortfolioCategory;
  coverImage: string;
  description: string;
  location?: string;
  date?: string;
  images: PortfolioItem[];
};

export const portfolioAlbums: Album[] = [
  {
    slug: "rahul-priya-wedding",
    title: "Rahul & Priya Wedding",
    category: "wedding",
    coverImage: "/images/portfolio/wedding-03.jpg",
    description: "A collection of candid moments, emotional portraits and intimate details from their beautiful wedding celebration.",
    location: "Udaipur, Rajasthan",
    date: "October 2025",
    images: portfolioItems.filter((i) => i.category === "wedding" || i.category === "candid"),
  },
  {
    slug: "amit-neha-pre-wedding",
    title: "Amit & Neha Pre-Wedding",
    category: "pre-wedding",
    coverImage: "/images/portfolio/prewedding-01.jpg",
    description: "A scenic outdoor pre-wedding session capturing the natural chemistry and love between Amit and Neha.",
    location: "Goa, India",
    images: portfolioItems.filter((i) => i.category === "pre-wedding"),
  },
  {
    slug: "riya-maternity",
    title: "Riya Maternity Session",
    category: "maternity",
    coverImage: "/images/portfolio/maternity-01.jpg",
    description: "Elegant and serene maternity portraits celebrating the journey to motherhood.",
    images: portfolioItems.filter((i) => i.category === "maternity"),
  },
  {
    slug: "fashion-editorial-spring",
    title: "Spring Fashion Editorial",
    category: "fashion",
    coverImage: "/images/portfolio/fashion-01.jpg",
    description: "High-end fashion editorial shoot highlighting vibrant spring collections.",
    images: portfolioItems.filter((i) => i.category === "fashion"),
  },
];

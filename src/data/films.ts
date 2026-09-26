import { type PortfolioCategory } from "./portfolio";

export type Film = {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
  category?: PortfolioCategory;
};

export const films: Film[] = [
  {
    id: "film-001",
    title: "Rahul & Priya Wedding Film",
    youtubeId: "wRxX1h4_I7k", 
    thumbnail: "/images/portfolio/film-001-thumb.jpg",
    category: "wedding",
  },
  {
    id: "film-002",
    title: "Amit & Neha Pre-Wedding Story",
    youtubeId: "kbivZMnZD14",
    thumbnail: "/images/portfolio/film-002-thumb.jpg",
    category: "pre-wedding",
  },
  {
    id: "film-003",
    title: "Cinematic Wedding Highlights",
    youtubeId: "f7Ny4v_ttLQ",
    thumbnail: "/images/portfolio/film-003-thumb.jpg",
    category: "wedding",
  },
  {
    id: "film-004",
    title: "Beautiful Pre-Wedding Journey",
    youtubeId: "uUEAClusOs0",
    thumbnail: "/images/portfolio/film-004-thumb.jpg",
    category: "pre-wedding",
  },
];

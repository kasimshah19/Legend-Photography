import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
});

const homepageSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "Premium Wedding &\nPortrait Photography.",
    },
    heroSubtitle: {
      type: String,
      default: "Stories that deserve to be remembered, captured with elegance and authenticity.",
    },
    heroMedia: {
      type: [String],
      default: [
        "/videos/hero-bg-unique.mp4",
        "/videos/hero-bg-2-unique.mp4",
        "/videos/couple-3.mp4",
        "/videos/couple-4.mp4",
        "/videos/couple-5.mp4",
        "/videos/couple-6.mp4",
        "/videos/couple-7.mp4",
      ],
    },
    featuredAlbums: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Portfolio",
      default: [],
    },
    featuredFilm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Film",
      default: null,
    },
    ctaTitle: {
      type: String,
      default: "Book Your Date\nNow.",
    },
    ctaSubtitle: {
      type: String,
      default: "Your story deserves the perfect frames. Let's create something beautiful together before our calendar fills up.",
    },
    sections: {
      stats: { type: sectionSchema, default: { enabled: true } },
      intro: { type: sectionSchema, default: { enabled: true } },
      specialities: { type: sectionSchema, default: { enabled: true } },
      featuredWork: { type: sectionSchema, default: { enabled: true } },
      why: { type: sectionSchema, default: { enabled: true } },
      testimonials: { type: sectionSchema, default: { enabled: true } },
      instagram: { type: sectionSchema, default: { enabled: true } },
      cta: { type: sectionSchema, default: { enabled: true } },
    },
  },
  { timestamps: true }
);

export const Homepage = mongoose.models.Homepage || mongoose.model("Homepage", homepageSchema);

/**
 * Optional Express API — run with: node server/index.js
 * Set MONGODB_URI and PORT (default 4000).
 * Next.js can proxy to this service in production if preferred.
 */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    service: { type: String, required: true },
    eventDate: String,
    location: String,
    numberOfEvents: String,
    message: String,
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "converted", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/api/inquiries", async (req, res) => {
  try {
    const { name, phone, service } = req.body;
    if (!name || !phone || !service) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    if (!MONGODB_URI) {
      console.info("[Inquiry]", req.body);
      return res.json({ ok: true, stored: false });
    }
    const doc = await Inquiry.create({ ...req.body, status: "new" });
    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

async function start() {
  if (MONGODB_URI) {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } else {
    console.warn("MONGODB_URI not set — inquiries will be logged only.");
  }
  app.listen(PORT, () => console.log(`Express API on http://localhost:${PORT}`));
}

start();

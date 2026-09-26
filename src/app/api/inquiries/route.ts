import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Inquiry } from "@/lib/models/Inquiry";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = body.email ? String(body.email).trim() : undefined;
    const service = String(body.service ?? "").trim();
    const eventDate = body.eventDate ? String(body.eventDate) : undefined;
    const location = body.location ? String(body.location).trim() : undefined;
    const numberOfEvents = body.numberOfEvents
      ? String(body.numberOfEvents).trim()
      : undefined;
    const message = body.message ? String(body.message).trim() : undefined;

    if (!name || !phone || !service) {
      return NextResponse.json(
        { error: "Name, phone and service are required." },
        { status: 400 },
      );
    }

    const conn = await connectMongo();
    if (conn) {
      await Inquiry.create({
        name,
        phone,
        email,
        service,
        eventDate,
        location,
        numberOfEvents,
        message,
        status: "new",
      });
    } else {
      console.info("[Inquiry — no MongoDB]", {
        name,
        phone,
        service,
        eventDate,
        location,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to submit inquiry. Please try again." },
      { status: 500 },
    );
  }
}

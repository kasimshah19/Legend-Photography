import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Inquiry } from "@/lib/models/Inquiry";

const rateLimit = new Map<string, number>();

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const lastRequest = rateLimit.get(ip) || 0;
    
    // Limit to 1 inquiry per 2 minutes per IP
    if (now - lastRequest < 2 * 60 * 1000) {
      return NextResponse.json(
        { error: "Please wait before submitting another inquiry." },
        { status: 429 }
      );
    }
    rateLimit.set(ip, now);

    const body = await request.json();

    const name = String(body.name ?? "").trim().slice(0, 100);
    const phone = String(body.phone ?? "").trim().slice(0, 20);
    const email = body.email ? String(body.email).trim().slice(0, 100) : undefined;
    const service = String(body.service ?? "").trim().slice(0, 100);
    const eventDate = body.eventDate ? String(body.eventDate).slice(0, 50) : undefined;
    const location = body.location ? String(body.location).trim().slice(0, 100) : undefined;
    const numberOfEvents = body.numberOfEvents
      ? String(body.numberOfEvents).trim().slice(0, 50)
      : undefined;
    const message = body.message ? String(body.message).trim().slice(0, 1000) : undefined;

    if (!name || !phone || !service) {
      return NextResponse.json(
        { error: "Name, phone and service are required." },
        { status: 400 },
      );
    }

    const conn = await connectMongo();
    if (conn) {
      const inquiry = await Inquiry.create({
        name,
        phone,
        email,
        service,
        eventDate,
        location,
        numberOfEvents,
        message,
        status: "NEW",
      });

      // Non-blocking notification creation
      import('@/lib/models/Notification').then(({ Notification }) => {
        Notification.create({
          type: 'NEW_INQUIRY',
          title: 'New Inquiry Received',
          message: `${name} is interested in ${service}.`,
          resourceId: inquiry._id.toString(),
        }).then(() => {
          // Emit realtime event AFTER DB success
          import('@/lib/socketEmit').then(({ emitInquiryCreated, emitNotificationCreated }) => {
            emitInquiryCreated(inquiry._id.toString(), service);
            emitNotificationCreated(inquiry._id.toString(), 'NEW_INQUIRY', 'New Inquiry Received');
          }).catch(err => console.error('Socket emit error:', err));
        }).catch(err => console.error('Notification error:', err));
      }).catch(err => console.error('Notification import error:', err));
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

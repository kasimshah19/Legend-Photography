import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectMongo } from "@/lib/mongodb";
import { Media } from "@/lib/models/Media";
import { requireAuth } from "@/lib/authorization";
import { Readable } from "stream";

export const maxDuration = 60; // Allow 60 seconds for upload
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const session = await requireAuth();

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validate file size (e.g. max 10MB)
    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_SIZE_MB}MB limit.` },
        { status: 400 }
      );
    }

    // 4. Validate file type (image or video)
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload an image or video." },
        { status: 400 }
      );
    }

    // 5. Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 6. Upload to Cloudinary using upload_stream
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      const resourceType = file.type.startsWith("video/") ? "video" : "image";
      
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "legend_photography",
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Create a readable stream from the buffer and pipe it to cloudinary
      const stream = Readable.from(buffer);
      stream.pipe(uploadStream);
    });

    // 7. Save metadata to MongoDB
    await connectMongo();
    
    const mediaDoc = await Media.create({
      fileName: file.name,
      fileUrl: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      fileType: file.type.startsWith("video/") ? "video" : "image",
      sizeInBytes: uploadResponse.bytes,
      width: uploadResponse.width,
      height: uploadResponse.height,
      uploadedBy: session.userId, 
    });

    // Non-blocking: audit log + realtime event AFTER successful DB write
    import('@/lib/audit').then(({ createAuditLog }) => {
      createAuditLog({
        adminEmail: session.email,
        action: 'UPLOAD',
        resource: 'Media',
        resourceId: mediaDoc._id.toString(),
        metadata: { fileName: file.name }
      });
    });
    import('@/lib/socketEmit').then(({ emitSocketEvent }) => {
      import('@/lib/socketEvents').then(({ SOCKET_EVENTS }) => {
        emitSocketEvent(SOCKET_EVENTS.MEDIA_UPLOADED, {
          id: mediaDoc._id.toString(),
          type: 'media',
          timestamp: new Date().toISOString(),
          adminEmail: session.email,
          metadata: { fileName: file.name },
        });
      });
    });

    return NextResponse.json({ success: true, data: mediaDoc });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file. Please try again." },
      { status: 500 }
    );
  }
}

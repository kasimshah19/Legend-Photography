import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import AdminUser from '@/lib/models/AdminUser';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectMongo();

    const adminHash = await bcrypt.hash('AdminPassword123!', 10);
    const editorHash = await bcrypt.hash('EditorPassword123!', 10);

    const existingAdmin = await AdminUser.findOne({ email: 'test_admin@legend.com' });
    if (!existingAdmin) {
      await AdminUser.create({
        name: 'Test Admin',
        email: 'test_admin@legend.com',
        passwordHash: adminHash,
        role: 'ADMIN',
        isActive: true,
      });
    }

    const existingEditor = await AdminUser.findOne({ email: 'test_editor@legend.com' });
    if (!existingEditor) {
      await AdminUser.create({
        name: 'Test Editor',
        email: 'test_editor@legend.com',
        passwordHash: editorHash,
        role: 'EDITOR',
        isActive: true,
      });
    }

    return NextResponse.json({ success: true, message: 'Users seeded successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

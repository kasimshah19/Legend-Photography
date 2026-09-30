"use server";

import { connectMongo } from "@/lib/mongodb";
import AdminUser from "@/lib/models/AdminUser";
import { requireAuth } from "@/lib/authorization";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// Only SUPER_ADMIN and ADMIN can access users page
// Wait, spec says: SUPER_ADMIN: full access, ADMIN: ... settings according to permissions
// But Admin Users is for both?
// Actually, earlier we checked AdminShell and put "SUPER_ADMIN", "ADMIN" for the users page link.
// Let's restrict actions to SUPER_ADMIN, and maybe ADMIN if they have permission, but for safety, only SUPER_ADMIN or ADMIN.

export async function getUsers() {
  await requireAuth(['SUPER_ADMIN', 'ADMIN']);
  await connectMongo();
  
  const users = await AdminUser.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(users));
}

export async function createUser(data: any) {
  const session = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
  await connectMongo();

  // Validate
  if (!data.email || !data.password || !data.name || !data.role) {
    return { success: false, error: "Missing required fields" };
  }

  // Prevent ADMIN from creating SUPER_ADMIN
  if (session.role === "ADMIN" && data.role === "SUPER_ADMIN") {
    return { success: false, error: "Only SUPER_ADMIN can create another SUPER_ADMIN" };
  }

  const existing = await AdminUser.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    return { success: false, error: "Email already exists" };
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  await AdminUser.create({
    name: data.name,
    email: data.email.toLowerCase(),
    role: data.role,
    passwordHash,
    isActive: true,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserRole(id: string, newRole: string) {
  const session = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
  await connectMongo();

  const targetUser = await AdminUser.findById(id);
  if (!targetUser) return { success: false, error: "User not found" };

  if (session.role === "ADMIN" && (targetUser.role === "SUPER_ADMIN" || newRole === "SUPER_ADMIN")) {
    return { success: false, error: "ADMIN cannot modify or grant SUPER_ADMIN roles" };
  }

  // Prevent last SUPER_ADMIN from changing their own role
  if (targetUser.role === "SUPER_ADMIN" && newRole !== "SUPER_ADMIN") {
    const superAdminCount = await AdminUser.countDocuments({ role: "SUPER_ADMIN", isActive: true });
    if (superAdminCount <= 1) {
      return { success: false, error: "Cannot change the role of the final active SUPER_ADMIN" };
    }
  }

  targetUser.role = newRole;
  await targetUser.save();
  
  import('@/lib/audit').then(({ createAuditLog }) => {
    createAuditLog({
      adminEmail: session.email,
      action: 'UPDATE_ROLE',
      resource: 'AdminUser',
      resourceId: id,
      metadata: { newRole, targetEmail: targetUser.email }
    });
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserStatus(id: string, isActive: boolean) {
  const session = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
  await connectMongo();

  const targetUser = await AdminUser.findById(id);
  if (!targetUser) return { success: false, error: "User not found" };

  if (session.role === "ADMIN" && targetUser.role === "SUPER_ADMIN") {
    return { success: false, error: "ADMIN cannot modify SUPER_ADMIN" };
  }

  if (targetUser.role === "SUPER_ADMIN" && !isActive) {
    const superAdminCount = await AdminUser.countDocuments({ role: "SUPER_ADMIN", isActive: true });
    if (superAdminCount <= 1) {
      return { success: false, error: "Cannot deactivate the final active SUPER_ADMIN" };
    }
  }

  targetUser.isActive = isActive;
  await targetUser.save();
  
  import('@/lib/audit').then(({ createAuditLog }) => {
    createAuditLog({
      adminEmail: session.email,
      action: isActive ? 'ACTIVATE' : 'DEACTIVATE',
      resource: 'AdminUser',
      resourceId: id,
      metadata: { targetEmail: targetUser.email }
    });
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function resetPassword(id: string, newPassword: string) {
  const session = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
  await connectMongo();

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  const targetUser = await AdminUser.findById(id);
  if (!targetUser) return { success: false, error: "User not found" };

  if (session.role === "ADMIN" && targetUser.role === "SUPER_ADMIN") {
    return { success: false, error: "ADMIN cannot reset SUPER_ADMIN password" };
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);
  targetUser.passwordHash = passwordHash;
  await targetUser.save();
  
  return { success: true };
}

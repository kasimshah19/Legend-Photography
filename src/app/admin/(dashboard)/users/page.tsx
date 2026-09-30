import { getUsers } from "./actions";
import UsersClient from "./UsersClient";
import { requireAuth } from "@/lib/authorization";

export const metadata = {
  title: "Admin Users | Legend Admin",
};

export default async function UsersPage() {
  const session = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
  const users = await getUsers();

  return (
    <div className="max-w-6xl mx-auto">
      <UsersClient users={users} currentUserRole={session.role} />
    </div>
  );
}

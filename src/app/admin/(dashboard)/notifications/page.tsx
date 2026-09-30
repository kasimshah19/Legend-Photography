import { Metadata } from "next";
import { getAllNotifications } from "@/app/admin/actions/notifications";
import { NotificationsClient } from "./NotificationsClient";
import { requireAuth } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Notifications | Admin | Legend Photography",
};

export default async function NotificationsPage() {
  const auth = await requireAuth(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  const res = await getAllNotifications(1, 50);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900">Notifications</h1>
          <p className="mt-2 text-sm text-gray-500">
            View all your system alerts and inquiry notifications.
          </p>
        </div>
      </div>
      
      <NotificationsClient 
        initialNotifications={res.notifications || []} 
        userRole={auth.role} 
      />
    </div>
  );
}

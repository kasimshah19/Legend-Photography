import { getInquiries } from "./actions";
import { InquiriesClient } from "./InquiriesClient";

export const dynamic = "force-dynamic";

export default async function InquiriesAdminPage() {
  const result = await getInquiries();
  const inquiries = result.success ? result.data : [];

  return <InquiriesClient initialInquiries={inquiries || []} />;
}

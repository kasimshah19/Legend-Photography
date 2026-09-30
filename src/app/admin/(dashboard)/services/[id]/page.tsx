import { getServiceById } from "../actions";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getServiceById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <ServiceEditor initialData={result.data} />;
}

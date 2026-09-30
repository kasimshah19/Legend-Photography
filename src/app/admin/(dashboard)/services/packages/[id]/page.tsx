import { getPackageById } from "../../packageActions";
import { PackageEditor } from "@/components/admin/PackageEditor";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPackageById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <PackageEditor initialData={result.data} />;
}

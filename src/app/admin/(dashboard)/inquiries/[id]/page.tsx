import { getInquiryById } from "../actions";
import { InquiryDetailClient } from "./InquiryDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getInquiryById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <InquiryDetailClient initialData={result.data} />;
}

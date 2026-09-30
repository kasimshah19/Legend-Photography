import { getFilmById } from "../actions";
import { FilmEditor } from "@/components/admin/FilmEditor";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditFilmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getFilmById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <FilmEditor initialData={result.data} />;
}

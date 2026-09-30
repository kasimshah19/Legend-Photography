import { notFound } from 'next/navigation';
import { AlbumEditor } from '@/components/admin/AlbumEditor';
import { getAlbum, updateAlbum } from '../actions';

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditAlbumPage({ params }: Props) {
  const { id } = await params;
  const result = await getAlbum(id);

  if (!result.success || !result.data) {
    notFound();
  }

  async function saveAction(_id: string | null, formData: FormData) {
    'use server';
    return updateAlbum(id, formData);
  }

  return <AlbumEditor album={result.data} saveAction={saveAction} />;
}

import { AlbumEditor } from '@/components/admin/AlbumEditor';
import { createAlbum } from '../actions';

export const dynamic = "force-dynamic";

async function saveAction(id: string | null, formData: FormData) {
  'use server';
  return createAlbum(formData);
}

export default function NewAlbumPage() {
  return <AlbumEditor saveAction={saveAction} />;
}

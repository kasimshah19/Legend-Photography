import { listFilms } from './actions';
import { FilmsAdminClient } from './FilmsAdminClient';

export const dynamic = "force-dynamic";

export default async function FilmsAdminPage() {
  const result = await listFilms();
  const films = result.success ? result.data : [];

  return <FilmsAdminClient initialFilms={films || []} />;
}

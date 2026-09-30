import { listAlbums } from './actions';
import { PortfolioAdminClient } from './PortfolioAdminClient';

export const dynamic = "force-dynamic";

export default async function PortfolioAdminPage() {
  const result = await listAlbums();
  const albums = result.success ? result.data : [];

  return <PortfolioAdminClient initialAlbums={albums} />;
}

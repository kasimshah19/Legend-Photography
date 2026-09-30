import { getMedia } from "./actions";
import { MediaLibraryClient } from "./MediaLibraryClientWrapper";

export const dynamic = "force-dynamic";

export default async function MediaAdminPage() {
  const result = await getMedia();
  const media = result.success ? result.data : [];

  return <MediaLibraryClient initialMedia={media || []} />;
}

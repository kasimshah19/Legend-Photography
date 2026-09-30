import { getHomepageSettings, getSelectableContent } from "./actions";
import { HomepageClient } from "./HomepageClientWrapper";

export const metadata = {
  title: "Homepage Content | Admin",
};

export default async function ContentPage() {
  const [settings, content] = await Promise.all([
    getHomepageSettings(),
    getSelectableContent()
  ]);

  return <HomepageClient initialData={settings} films={content.films} albums={content.albums} />;
}

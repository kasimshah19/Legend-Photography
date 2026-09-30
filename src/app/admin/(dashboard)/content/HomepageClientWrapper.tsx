"use client";

import { useState } from "react";
import { updateHomepageSettings } from "./actions";

type SelectableItem = {
  _id: string;
  title: string;
};

type HomepageClientProps = {
  initialData: any;
  films: SelectableItem[];
  albums: SelectableItem[];
};

export function HomepageClient({ initialData, films, albums }: HomepageClientProps) {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await updateHomepageSettings(formData);
      setMessage("Settings saved successfully.");
    } catch (err: any) {
      setMessage(err.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  
  const handleSectionToggle = (sectionName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionName]: { enabled: checked }
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif">Homepage Content</h1>
        <p className="text-muted-foreground mt-2">Manage the content and visibility of homepage sections.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* HERO SECTION */}
        <div className="bg-card p-6 rounded-lg border border-border space-y-4">
          <h2 className="text-xl font-medium mb-4">Hero Section</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Hero Title</label>
            <textarea
              name="heroTitle"
              value={formData.heroTitle || ""}
              onChange={handleChange}
              rows={2}
              className="w-full bg-background border border-border rounded-md p-3 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hero Subtitle</label>
            <textarea
              name="heroSubtitle"
              value={formData.heroSubtitle || ""}
              onChange={handleChange}
              rows={3}
              className="w-full bg-background border border-border rounded-md p-3 text-sm"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Hero Media (Video URLs, one per line)</label>
            <textarea
              value={(formData.heroMedia || []).join("\n")}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, heroMedia: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) }))}
              rows={4}
              className="w-full bg-background border border-border rounded-md p-3 text-sm font-mono"
            />
            <p className="text-xs text-muted-foreground">Enter relative paths (e.g., /videos/hero.mp4) or full Cloudinary URLs. Each media item will be played or shown in sequence.</p>
          </div>
        </div>

        {/* FEATURED WORK */}
        <div className="bg-card p-6 rounded-lg border border-border space-y-4">
          <h2 className="text-xl font-medium mb-4">Featured Work</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Featured Albums</label>
            <p className="text-xs text-muted-foreground mb-2">Select albums to feature on the homepage.</p>
            <div className="grid grid-cols-2 gap-2">
              {albums.map((album) => (
                <label key={album._id} className="flex items-center gap-2 text-sm p-2 bg-background border border-border rounded cursor-pointer hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={(formData.featuredAlbums || []).includes(album._id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData((prev: any) => ({
                        ...prev,
                        featuredAlbums: checked 
                          ? [...(prev.featuredAlbums || []), album._id]
                          : (prev.featuredAlbums || []).filter((id: string) => id !== album._id)
                      }));
                    }}
                  />
                  {album.title}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURED FILM */}
        <div className="bg-card p-6 rounded-lg border border-border space-y-4">
          <h2 className="text-xl font-medium mb-4">Featured Film</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Select a Film</label>
            <select
              name="featuredFilm"
              value={formData.featuredFilm || ""}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-md p-3 text-sm"
            >
              <option value="">None</option>
              {films.map((film) => (
                <option key={film._id} value={film._id}>{film.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="bg-card p-6 rounded-lg border border-border space-y-4">
          <h2 className="text-xl font-medium mb-4">Call to Action (CTA) Section</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">CTA Title</label>
            <textarea
              name="ctaTitle"
              value={formData.ctaTitle || ""}
              onChange={handleChange}
              rows={2}
              className="w-full bg-background border border-border rounded-md p-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">CTA Subtitle</label>
            <textarea
              name="ctaSubtitle"
              value={formData.ctaSubtitle || ""}
              onChange={handleChange}
              rows={3}
              className="w-full bg-background border border-border rounded-md p-3 text-sm"
            />
          </div>
        </div>

        {/* SECTIONS TOGGLE */}
        <div className="bg-card p-6 rounded-lg border border-border space-y-4">
          <h2 className="text-xl font-medium mb-4">Homepage Sections Visibility</h2>
          <p className="text-sm text-muted-foreground mb-4">Toggle which sections are displayed on the homepage.</p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { id: 'stats', label: 'Stats Section' },
              { id: 'intro', label: 'Intro / About Section' },
              { id: 'specialities', label: 'Specialities Section' },
              { id: 'featuredWork', label: 'Featured Work (Albums)' },
              { id: 'why', label: 'Why Choose Us Section' },
              { id: 'testimonials', label: 'Testimonials Section' },
              { id: 'instagram', label: 'Instagram Feed Section' },
              { id: 'cta', label: 'Call to Action Section' },
            ].map((section) => (
              <label key={section.id} className="flex items-center justify-between p-4 border border-border rounded-md bg-background cursor-pointer hover:bg-muted/50">
                <span className="text-sm font-medium">{section.label}</span>
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={formData.sections?.[section.id]?.enabled ?? true}
                  onChange={(e) => handleSectionToggle(section.id, e)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          {message && (
            <p className={`text-sm ${message.includes("error") ? "text-red-500" : "text-green-500"}`}>
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

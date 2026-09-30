"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Save, Video, ImageIcon } from "lucide-react";
import Link from "next/link";
import { createFilm, updateFilm, SerializedFilm } from "@/app/admin/(dashboard)/films/actions";

const CATEGORIES = ["wedding", "pre-wedding", "maternity", "fashion", "kids", "event", "other"];

export function FilmEditor({ initialData }: { initialData?: SerializedFilm }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [title, setTitle] = useState(initialData?.title || "");
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || (initialData ? `https://youtube.com/watch?v=${initialData.youtubeId}` : ""));
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "wedding");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [published, setPublished] = useState(initialData?.published || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeUrl || !thumbnail) {
      setError("Title, YouTube URL, and Thumbnail are required.");
      return;
    }
    
    setIsSaving(true);
    setError("");
    
    const data = {
      title,
      youtubeUrl,
      thumbnail,
      description,
      category,
      featured,
      published,
      displayOrder: initialData?.displayOrder || 0,
    };

    try {
      let res;
      if (initialData) {
        res = await updateFilm(initialData._id, data);
      } else {
        res = await createFilm(data);
      }
      
      if (res.success) {
        router.push("/admin/films");
        router.refresh();
      } else {
        setError(res.error || "Failed to save film");
        setIsSaving(false);
      }
    } catch (e: any) {
      setError(e.message || "An error occurred");
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin/films"
            className="text-xs uppercase tracking-wider text-muted hover:text-black mb-4 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Films
          </Link>
          <h1 className="text-3xl font-serif">{initialData ? "Edit Film" : "New Film"}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer border p-2 bg-white">
            <input 
              type="checkbox" 
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="accent-black w-4 h-4"
            />
            Published
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Film"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-border/50 p-6 md:p-8 space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted block mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
            placeholder="e.g. Rahul & Priya Wedding Highlight"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2 flex items-center gap-2">
              <Video className="h-4 w-4" /> YouTube URL *
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            <p className="text-xs text-muted mt-2">Enter the full YouTube link. We&apos;ll extract the ID automatically.</p>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors bg-transparent"
              required
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-muted block mb-2 flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> Thumbnail Image Path *
          </label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
            placeholder="/images/portfolio/film-001-thumb.jpg"
            required
          />
          <p className="text-xs text-muted mt-2">Path to the thumbnail image (relative to public directory).</p>
        </div>

        {thumbnail && (
          <div>
             <label className="text-xs uppercase tracking-widest text-muted block mb-2">Thumbnail Preview</label>
             <div className="relative aspect-video w-64 bg-gray-100 border border-border/50">
               <Image src={thumbnail} alt="Thumbnail preview" fill className="object-cover" />
             </div>
          </div>
        )}

        <div>
          <label className="text-xs uppercase tracking-widest text-muted block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm border border-border/50 p-3 h-32 outline-none focus:border-black transition-colors resize-none bg-transparent"
            placeholder="Optional description of the film..."
          />
        </div>

        <div>
           <label className="flex items-center gap-2 text-sm cursor-pointer w-max">
            <input 
              type="checkbox" 
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="accent-black w-4 h-4"
            />
            Featured Film (Show on homepage/top of lists)
          </label>
        </div>
      </div>
    </form>
  );
}

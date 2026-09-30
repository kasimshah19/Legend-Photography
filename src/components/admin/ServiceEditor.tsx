"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, ImageIcon, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { createService, updateService, SerializedService } from "@/app/admin/(dashboard)/services/actions";

export function ServiceEditor({ initialData }: { initialData?: SerializedService }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || "");
  const [features, setFeatures] = useState<string[]>(initialData?.features || [""]);
  const [ctaLabel, setCtaLabel] = useState(initialData?.ctaLabel || "");
  const [ctaHref, setCtaHref] = useState(initialData?.ctaHref || "");
  const [portfolioFilter, setPortfolioFilter] = useState(initialData?.portfolioFilter || "");
  const [published, setPublished] = useState(initialData?.published ?? true);

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !image || !imageAlt) {
      setError("Title, description, image, and image alt are required.");
      return;
    }
    
    setIsSaving(true);
    setError("");
    
    const filteredFeatures = features.filter(f => f.trim() !== "");
    
    const data = {
      title,
      description,
      image,
      imageAlt,
      features: filteredFeatures,
      ctaLabel,
      ctaHref,
      portfolioFilter,
      published,
      displayOrder: initialData?.displayOrder || 0,
    };

    try {
      let res;
      if (initialData) {
        res = await updateService(initialData._id, data);
      } else {
        res = await createService(data);
      }
      
      if (res.success) {
        router.push("/admin/services");
        router.refresh();
      } else {
        setError(res.error || "Failed to save service");
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
            href="/admin/services"
            className="text-xs uppercase tracking-wider text-muted hover:text-black mb-4 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>
          <h1 className="text-3xl font-serif">{initialData ? "Edit Service" : "New Service"}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer border p-2 bg-white">
            <input 
              type="checkbox" 
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="accent-black w-4 h-4"
            />
            Enabled
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Service"}
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
            placeholder="e.g. Wedding Photography"
            required
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-muted block mb-2">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm border border-border/50 p-3 h-24 outline-none focus:border-black transition-colors resize-none bg-transparent"
            placeholder="A short description of the service..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Image Path *
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="/images/portfolio/wedding-01.jpg"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">Image Alt Text *</label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="e.g. Wedding photography by Legend Photography"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-muted block mb-4 flex justify-between items-center">
            <span>Features</span>
            <button type="button" onClick={addFeature} className="text-black flex items-center gap-1 hover:underline">
              <Plus size={14} /> Add Feature
            </button>
          </label>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 text-sm border border-border/50 py-2 px-3 outline-none focus:border-black transition-colors bg-transparent"
                  placeholder="e.g. Candid moments"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-border/50 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">CTA Label</label>
            <input
              type="text"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="e.g. Explore Wedding Work"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">CTA Href</label>
            <input
              type="text"
              value={ctaHref}
              onChange={(e) => setCtaHref(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="e.g. /portfolio?category=wedding"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">Portfolio Filter</label>
            <input
              type="text"
              value={portfolioFilter}
              onChange={(e) => setPortfolioFilter(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="e.g. wedding"
            />
            <p className="text-[10px] text-muted mt-1">Used to filter portfolio items (optional)</p>
          </div>
        </div>
      </div>
    </form>
  );
}

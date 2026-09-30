"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { updatePackage, SerializedPackage } from "@/app/admin/(dashboard)/services/packageActions";

export function PackageEditor({ initialData }: { initialData: SerializedPackage }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [name, setName] = useState(initialData.name);
  const [positioning, setPositioning] = useState(initialData.positioning);
  const [badge, setBadge] = useState(initialData.badge || "");
  const [priceLabel, setPriceLabel] = useState(initialData.priceLabel);
  const [hours, setHours] = useState(initialData.hours);
  const [photos, setPhotos] = useState(initialData.photos);
  const [album, setAlbum] = useState(initialData.album || "");
  const [video, setVideo] = useState(initialData.video || "");
  const [features, setFeatures] = useState<string[]>(initialData.features || [""]);
  const [cta, setCta] = useState(initialData.cta);

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !positioning || !priceLabel || !hours || !photos || !cta) {
      setError("Please fill out all required fields.");
      return;
    }
    
    setIsSaving(true);
    setError("");
    
    const filteredFeatures = features.filter(f => f.trim() !== "");
    
    const data = {
      name,
      positioning,
      badge: badge || null,
      priceLabel,
      hours,
      photos,
      album: album || null,
      video: video || null,
      features: filteredFeatures,
      cta,
    };

    try {
      const res = await updatePackage(initialData._id, data);
      if (res.success) {
        router.push("/admin/services");
        router.refresh();
      } else {
        setError(res.error || "Failed to save package");
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
          <h1 className="text-3xl font-serif">Edit Package: {initialData.packageId.toUpperCase()}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Package"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-border/50 p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">Package Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-lg border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="e.g. Intimate"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">Badge (Optional)</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full text-lg border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="e.g. MOST POPULAR"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-muted block mb-2">Positioning Statement *</label>
          <textarea
            value={positioning}
            onChange={(e) => setPositioning(e.target.value)}
            className="w-full text-sm border border-border/50 p-3 h-20 outline-none focus:border-black transition-colors resize-none bg-transparent"
            placeholder="A short descriptive positioning for this package..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">Price Label *</label>
            <input
              type="text"
              value={priceLabel}
              onChange={(e) => setPriceLabel(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors font-semibold"
              placeholder="e.g. ₹ 45,000"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">CTA Text *</label>
            <input
              type="text"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="e.g. Book This Package"
              required
            />
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">Hours Included *</label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="e.g. Up to 6 Hours Coverage"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">Photos Included *</label>
            <input
              type="text"
              value={photos}
              onChange={(e) => setPhotos(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="e.g. 300+ Edited High-Res Photos"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">Album Included (Optional)</label>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="e.g. Premium 40-Page Layflat Album"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted block mb-2">Video Included (Optional)</label>
            <input
              type="text"
              value={video}
              onChange={(e) => setVideo(e.target.value)}
              className="w-full text-sm border-b border-border/50 py-2 outline-none focus:border-black transition-colors"
              placeholder="e.g. 3-5 Minute Cinematic Highlights"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-border/50">
          <label className="text-xs uppercase tracking-widest text-muted block mb-4 flex justify-between items-center">
            <span>Additional Features</span>
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
                  placeholder="e.g. 1 Lead Photographer"
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
      </div>
    </form>
  );
}

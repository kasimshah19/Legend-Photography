'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, X, GripVertical, Star } from 'lucide-react';

type GalleryImage = {
  url: string;
  alt: string;
  displayOrder: number;
};

type AlbumData = {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  gallery: GalleryImage[];
  description: string;
  location: string;
  eventDate: string;
  isFeatured: boolean;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
};

const CATEGORIES = [
  { id: 'wedding', label: 'Wedding' },
  { id: 'pre-wedding', label: 'Pre-Wedding' },
  { id: 'maternity', label: 'Maternity' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'kids', label: 'Kids' },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

type Props = {
  album?: AlbumData;
  saveAction: (id: string | null, formData: FormData) => Promise<{ success: boolean; error?: string; data?: any }>;
};

export function AlbumEditor({ album, saveAction }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const [title, setTitle] = useState(album?.title || '');
  const [slug, setSlug] = useState(album?.slug || '');
  const [slugEdited, setSlugEdited] = useState(false);
  const [category, setCategory] = useState(album?.category || 'wedding');
  const [coverImage, setCoverImage] = useState(album?.coverImage || '');
  const [description, setDescription] = useState(album?.description || '');
  const [location, setLocation] = useState(album?.location || '');
  const [eventDate, setEventDate] = useState(album?.eventDate || '');
  const [isFeatured, setIsFeatured] = useState(album?.isFeatured || false);
  const [published, setPublished] = useState(album?.published || false);
  const [seoTitle, setSeoTitle] = useState(album?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(album?.seoDescription || '');
  const [gallery, setGallery] = useState<GalleryImage[]>(album?.gallery || []);

  // New image URL input
  const [newImageUrl, setNewImageUrl] = useState('');

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugEdited) {
      setSlug(generateSlug(val));
    }
  }

  function addImage() {
    if (!newImageUrl.trim()) return;
    setGallery((prev) => [
      ...prev,
      { url: newImageUrl.trim(), alt: '', displayOrder: prev.length },
    ]);
    setNewImageUrl('');
  }

  function removeImage(index: number) {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  }

  function updateImageAlt(index: number, alt: string) {
    setGallery((prev) =>
      prev.map((img, i) => (i === index ? { ...img, alt } : img))
    );
  }

  function setCoverFromGallery(url: string) {
    setCoverImage(url);
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= gallery.length) return;
    setGallery((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr.map((img, i) => ({ ...img, displayOrder: i }));
    });
  }

  function handleSubmit() {
    setError('');
    if (!title.trim()) { setError('Title is required'); return; }
    if (!coverImage.trim()) { setError('Cover image URL is required'); return; }

    startTransition(async () => {
      const formData = new FormData();
      formData.set('title', title);
      formData.set('slug', slug);
      formData.set('category', category);
      formData.set('coverImage', coverImage);
      formData.set('description', description);
      formData.set('location', location);
      formData.set('eventDate', eventDate);
      formData.set('isFeatured', String(isFeatured));
      formData.set('published', String(published));
      formData.set('seoTitle', seoTitle);
      formData.set('seoDescription', seoDescription);
      formData.set('gallery', JSON.stringify(gallery));

      const result = await saveAction(album?._id || null, formData);
      if (result.success) {
        router.push('/admin/portfolio');
        router.refresh();
      } else {
        setError(result.error || 'Something went wrong');
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/portfolio')}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            aria-label="Back to portfolio"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            {album ? 'Edit Album' : 'New Album'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 accent-black"
            />
            Published
          </label>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Save size={16} className="mr-2" />
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Album title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="slug">Slug</label>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-1">/portfolio/</span>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="auto-generated-slug"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-y"
                placeholder="Album description..."
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="coverImage">Cover Image *</label>
            <input
              id="coverImage"
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              placeholder="/images/portfolio/example.jpg or https://..."
            />
            {coverImage && (
              <div className="mt-2 w-full max-w-xs">
                <img src={coverImage} alt="Cover preview" className="w-full h-40 object-cover rounded-md border" />
              </div>
            )}
          </div>

          {/* Gallery */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Gallery Images</h3>
            
            {/* Add Image */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Image URL..."
              />
              <button
                type="button"
                onClick={addImage}
                className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Image List */}
            <div className="space-y-2">
              {gallery.map((img, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-100">
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-xs"
                      aria-label="Move up"
                    >▲</button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      disabled={index === gallery.length - 1}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-xs"
                      aria-label="Move down"
                    >▼</button>
                  </div>
                  <div className="w-16 h-16 shrink-0 rounded overflow-hidden bg-gray-200">
                    <img src={img.url} alt={img.alt || 'Gallery image'} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs text-gray-500 truncate">{img.url}</p>
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => updateImageAlt(index, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-black/10"
                      placeholder="Alt text..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCoverFromGallery(img.url)}
                    className={`p-1.5 rounded transition-colors ${
                      coverImage === img.url ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                    }`}
                    title="Set as cover"
                    aria-label="Set as cover image"
                  >
                    <Star size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {gallery.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No gallery images added yet.</p>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-700">SEO (Optional)</h3>
            <div>
              <label className="block text-xs text-gray-500 mb-1" htmlFor="seoTitle">SEO Title</label>
              <input
                id="seoTitle"
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Custom page title for search engines"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1" htmlFor="seoDescription">SEO Description</label>
              <textarea
                id="seoDescription"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-y"
                placeholder="Custom meta description"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">Category *</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="e.g. Udaipur, Rajasthan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="eventDate">Event Date</label>
              <input
                id="eventDate"
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="e.g. October 2025"
              />
            </div>
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                Featured Album
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                Published
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

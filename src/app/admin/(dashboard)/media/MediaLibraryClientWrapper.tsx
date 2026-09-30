"use client";

import { useState, useRef } from "react";
import { Upload, Trash2, Search, Filter, X, Image as ImageIcon, Video, Copy, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import { SerializedMedia, deleteMedia } from "./actions";
import { useRouter } from "next/navigation";

export function MediaLibraryClient({ initialMedia }: { initialMedia: SerializedMedia[] }) {
  const router = useRouter();
  const [media, setMedia] = useState<SerializedMedia[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [selectedItem, setSelectedItem] = useState<SerializedMedia | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || "Upload failed");
      
      // Prepend new media
      setMedia([result.data, ...media]);
      router.refresh();
    } catch (err: any) {
      setUploadError(err.message || "An error occurred during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file? This cannot be undone.")) return;
    
    try {
      const res = await deleteMedia(id);
      if (res.success) {
        setMedia(media.filter(m => m._id !== id));
        if (selectedItem?._id === id) setSelectedItem(null);
        router.refresh();
      } else {
        alert(res.error || "Failed to delete");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("URL copied to clipboard");
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = media.filter(m => {
    const matchesSearch = m.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || m.fileType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-serif">Media Library</h1>
        
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*,video/*" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {isUploading ? "Uploading..." : "Upload Media"}
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-50 text-red-700 p-4 border border-red-200 text-sm">
          {uploadError}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 border border-border/50 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border/50 text-sm outline-none focus:border-black transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-border/50 py-2 px-3 text-sm outline-none focus:border-black transition-colors"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted border border-dashed border-border/50">
              No media found.
            </div>
          ) : (
            filteredMedia.map(item => (
              <div 
                key={item._id} 
                onClick={() => setSelectedItem(item)}
                className={`relative group aspect-square border cursor-pointer overflow-hidden bg-gray-50 transition-all ${selectedItem?._id === item._id ? 'border-black ring-1 ring-black' : 'border-border/50 hover:border-black/50'}`}
              >
                {item.fileType === "image" ? (
                  <Image
                    src={item.fileUrl}
                    alt={item.fileName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-2">
                    <Video className="h-8 w-8" />
                    <span className="text-xs truncate w-full text-center px-2">{item.fileName}</span>
                  </div>
                )}
                
                <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.fileType === "image" ? <ImageIcon size={14} /> : <Video size={14} />}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Preview */}
        {selectedItem && (
          <div className="hidden lg:block w-80 bg-white border border-border/50 p-6 sticky top-8 self-start shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-serif text-xl truncate pr-4">{selectedItem.fileName}</h3>
              <button onClick={() => setSelectedItem(null)} className="text-muted hover:text-black">
                <X size={20} />
              </button>
            </div>
            
            <div className="aspect-square relative bg-gray-100 mb-6 border border-border/20 flex items-center justify-center">
              {selectedItem.fileType === "image" ? (
                <Image
                  src={selectedItem.fileUrl}
                  alt={selectedItem.fileName}
                  fill
                  className="object-contain"
                  sizes="320px"
                />
              ) : (
                <video src={selectedItem.fileUrl} controls className="max-w-full max-h-full" />
              )}
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-xs uppercase tracking-wider text-muted mb-1">File URL</span>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={selectedItem.fileUrl} 
                    className="w-full border border-border/50 px-2 py-1 bg-gray-50 text-xs truncate"
                  />
                  <button 
                    onClick={() => copyToClipboard(selectedItem.fileUrl)}
                    className="p-1.5 border border-border/50 hover:bg-gray-50 flex-shrink-0"
                    title="Copy URL"
                  >
                    <Copy size={14} />
                  </button>
                  <a 
                    href={selectedItem.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 border border-border/50 hover:bg-gray-50 flex-shrink-0"
                    title="Open in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-muted mb-1">Uploaded</span>
                  <span className="font-medium">{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-muted mb-1">Size</span>
                  <span className="font-medium">{formatBytes(selectedItem.sizeInBytes)}</span>
                </div>
                {selectedItem.width && selectedItem.height && (
                  <div className="col-span-2">
                    <span className="block text-xs uppercase tracking-wider text-muted mb-1">Dimensions</span>
                    <span className="font-medium">{selectedItem.width} × {selectedItem.height} px</span>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-border/20">
                <button
                  onClick={() => handleDelete(selectedItem._id)}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 py-2 text-sm transition-colors"
                >
                  <Trash2 size={16} /> Delete Media
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Preview Modal */}
      {selectedItem && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedItem(null)} 
              className="absolute top-4 right-4 text-muted hover:text-black"
            >
              <X size={20} />
            </button>
            <h3 className="font-serif text-xl truncate pr-8 mb-4">{selectedItem.fileName}</h3>
            
            <div className="aspect-square relative bg-gray-100 mb-6 flex items-center justify-center">
              {selectedItem.fileType === "image" ? (
                <Image
                  src={selectedItem.fileUrl}
                  alt={selectedItem.fileName}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              ) : (
                <video src={selectedItem.fileUrl} controls className="max-w-full max-h-full" />
              )}
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-xs uppercase tracking-wider text-muted mb-1">File URL</span>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={selectedItem.fileUrl} 
                    className="w-full border border-border/50 px-2 py-1 bg-gray-50 text-xs truncate"
                  />
                  <button onClick={() => copyToClipboard(selectedItem.fileUrl)} className="p-1.5 border border-border/50 hover:bg-gray-50 flex-shrink-0">
                    <Copy size={14} />
                  </button>
                  <a href={selectedItem.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 border border-border/50 hover:bg-gray-50 flex-shrink-0">
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-muted mb-1">Size</span>
                  <span className="font-medium">{formatBytes(selectedItem.sizeInBytes)}</span>
                </div>
                {selectedItem.width && selectedItem.height && (
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-muted mb-1">Dimensions</span>
                    <span className="font-medium">{selectedItem.width} × {selectedItem.height} px</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-border/20">
                <button
                  onClick={() => handleDelete(selectedItem._id)}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 py-2 text-sm transition-colors"
                >
                  <Trash2 size={16} /> Delete Media
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

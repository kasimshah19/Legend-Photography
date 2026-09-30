"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SerializedFilm, deleteFilm, toggleFilmPublish, reorderFilms } from "./actions";
import { Edit3, Trash2, GripVertical, CheckCircle, XCircle, Search, Star } from "lucide-react";
import { format } from "date-fns";

export function FilmsAdminClient({ initialFilms }: { initialFilms: SerializedFilm[] }) {
  const [films, setFilms] = useState<SerializedFilm[]>(initialFilms);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);

  const filteredFilms = films.filter(f => 
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this film?")) return;
    setIsDeleting(id);
    const res = await deleteFilm(id);
    if (res.success) {
      setFilms(films.filter(f => f._id !== id));
    } else {
      alert(res.error || "Failed to delete");
    }
    setIsDeleting(null);
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setIsPublishing(id);
    const res = await toggleFilmPublish(id, !currentStatus);
    if (res.success) {
      setFilms(films.map(f => f._id === id ? { ...f, published: !currentStatus } : f));
    } else {
      alert(res.error || "Failed to update status");
    }
    setIsPublishing(null);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === films.length - 1) return;

    const newFilms = [...films];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newFilms[index];
    newFilms[index] = newFilms[targetIndex];
    newFilms[targetIndex] = temp;

    // Update display orders
    const updates = newFilms.map((f, i) => ({ id: f._id, displayOrder: i }));
    
    setFilms(newFilms);
    await reorderFilms(updates);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-serif">Films & Reels</h1>
        <Link href="/admin/films/new" className="btn-primary">
          Add New Film
        </Link>
      </div>

      <div className="bg-white p-4 border border-border/50 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search films by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border-b border-border/50 bg-transparent focus:border-black outline-none transition-colors"
          />
        </div>
      </div>

      <div className="bg-white border border-border/50 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/5 border-b border-border/50 text-muted uppercase tracking-wider text-xs">
            <tr>
              <th className="px-4 py-4 w-12 text-center">Order</th>
              <th className="px-4 py-4">Film Details</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredFilms.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted">
                  No films found.
                </td>
              </tr>
            ) : (
              filteredFilms.map((film, index) => (
                <tr key={film._id} className="hover:bg-muted/5 transition-colors group">
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0 || search !== ""}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === films.length - 1 || search !== ""}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-32 h-20 bg-gray-100 border border-border/50 shrink-0">
                        {film.thumbnail && (
                          <Image src={film.thumbnail} alt={film.title} fill className="object-cover" />
                        )}
                        {film.featured && (
                          <div className="absolute top-1 right-1 bg-yellow-400 text-black p-1 rounded-full shadow-sm" title="Featured">
                            <Star size={12} fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-foreground truncate">{film.title}</span>
                        <span className="text-xs text-muted mt-1 uppercase">{film.category}</span>
                        <span className="text-xs text-muted mt-1 truncate">ID: {film.youtubeId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <button
                      onClick={() => handleTogglePublish(film._id, film.published)}
                      disabled={isPublishing === film._id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        film.published 
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                      }`}
                    >
                      {isPublishing === film._id ? (
                        "Saving..."
                      ) : film.published ? (
                        <><CheckCircle size={14} /> Published</>
                      ) : (
                        <><XCircle size={14} /> Draft</>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/films/${film._id}`}
                        className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(film._id)}
                        disabled={isDeleting === film._id}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

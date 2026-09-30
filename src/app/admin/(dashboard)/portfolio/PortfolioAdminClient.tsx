'use client';

import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Eye, EyeOff, Pencil, Trash2, Copy, ExternalLink, Filter,
} from 'lucide-react';
import { deleteAlbum, togglePublish, duplicateAlbum } from './actions';

type Album = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  published: boolean;
  isFeatured: boolean;
  displayOrder: number;
  gallery: any[];
  createdAt: string;
};

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'pre-wedding', label: 'Pre-Wedding' },
  { id: 'maternity', label: 'Maternity' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'kids', label: 'Kids' },
];

export function PortfolioAdminClient({ initialAlbums }: { initialAlbums: Album[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = initialAlbums;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.title.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') {
      result = result.filter((a) => a.category === categoryFilter);
    }
    if (statusFilter === 'published') {
      result = result.filter((a) => a.published);
    } else if (statusFilter === 'draft') {
      result = result.filter((a) => !a.published);
    }
    return result;
  }, [initialAlbums, search, categoryFilter, statusFilter]);

  function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteAlbum(id);
      router.refresh();
    });
  }

  function handleTogglePublish(id: string) {
    startTransition(async () => {
      await togglePublish(id);
      router.refresh();
    });
  }

  function handleDuplicate(id: string) {
    startTransition(async () => {
      await duplicateAlbum(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Portfolio Albums</h1>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          New Album
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search albums..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Albums Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-500">
              {initialAlbums.length === 0
                ? 'No albums yet. Create your first album!'
                : 'No albums match your filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Album</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Images</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((album) => (
                  <tr key={album._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0">
                          {album.coverImage ? (
                            <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{album.title}</p>
                          <p className="text-xs text-gray-500 truncate">/{album.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="capitalize text-gray-700">{album.category.replace('-', ' ')}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                      {album.gallery?.length || 0}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        album.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {album.published ? 'Published' : 'Draft'}
                      </span>
                      {album.isFeatured && (
                        <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleTogglePublish(album._id)}
                          disabled={isPending}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                          title={album.published ? 'Unpublish' : 'Publish'}
                          aria-label={album.published ? 'Unpublish' : 'Publish'}
                        >
                          {album.published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <Link
                          href={`/admin/portfolio/${album._id}`}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                          aria-label="Edit album"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(album._id)}
                          disabled={isPending}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                          title="Duplicate"
                          aria-label="Duplicate album"
                        >
                          <Copy size={16} />
                        </button>
                        {album.published && (
                          <a
                            href={`/portfolio/${album.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                            title="View live"
                            aria-label="View album on public site"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(album._id, album.title)}
                          disabled={isPending}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                          aria-label="Delete album"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

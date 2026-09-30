"use client";

import { useState } from "react";
import Link from "next/link";
import { SerializedService, toggleServicePublish, reorderServices, deleteService } from "./actions";
import { SerializedPackage } from "./packageActions";
import { Edit3, CheckCircle, XCircle, Trash2 } from "lucide-react";

export function ServicesAdminClient({ 
  initialServices, 
  initialPackages 
}: { 
  initialServices: SerializedService[],
  initialPackages: SerializedPackage[]
}) {
  const [activeTab, setActiveTab] = useState<"services" | "packages">("services");
  const [services, setServices] = useState(initialServices);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setIsPublishing(id);
    const res = await toggleServicePublish(id, !currentStatus);
    if (res.success) {
      setServices(services.map(s => s._id === id ? { ...s, published: !currentStatus } : s));
    } else {
      alert(res.error || "Failed to update status");
    }
    setIsPublishing(null);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === services.length - 1) return;

    const newServices = [...services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newServices[index];
    newServices[index] = newServices[targetIndex];
    newServices[targetIndex] = temp;

    const updates = newServices.map((s, i) => ({ id: s._id, displayOrder: i }));
    setServices(newServices);
    await reorderServices(updates);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    setIsDeleting(id);
    const res = await deleteService(id);
    if (res.success) {
      setServices(services.filter(s => s._id !== id));
    } else {
      alert(res.error || "Failed to delete");
    }
    setIsDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-serif">Services & Packages</h1>
        {activeTab === "services" && (
          <Link href="/admin/services/new" className="btn-primary">
            Add New Service
          </Link>
        )}
      </div>

      <div className="flex gap-4 border-b border-border/50">
        <button
          onClick={() => setActiveTab("services")}
          className={`pb-2 text-sm font-medium uppercase tracking-wider transition-colors ${
            activeTab === "services" ? "border-b-2 border-black text-black" : "text-muted hover:text-black"
          }`}
        >
          Services ({services.length})
        </button>
        <button
          onClick={() => setActiveTab("packages")}
          className={`pb-2 text-sm font-medium uppercase tracking-wider transition-colors ${
            activeTab === "packages" ? "border-b-2 border-black text-black" : "text-muted hover:text-black"
          }`}
        >
          Packages ({initialPackages.length})
        </button>
      </div>

      {activeTab === "services" && (
        <div className="bg-white border border-border/50 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/5 border-b border-border/50 text-muted uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-4 w-12 text-center">Order</th>
                <th className="px-4 py-4">Service Name</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-muted">No services found.</td>
                </tr>
              ) : (
                services.map((service, index) => (
                  <tr key={service._id} className="hover:bg-muted/5 transition-colors group">
                    <td className="px-4 py-4 align-middle">
                      <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          ▲
                        </button>
                        <button 
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === services.length - 1}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-foreground">{service.title}</div>
                      <div className="text-xs text-muted mt-1 truncate max-w-sm">{service.description}</div>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <button
                        onClick={() => handleTogglePublish(service._id, service.published)}
                        disabled={isPublishing === service._id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          service.published 
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                        }`}
                      >
                        {isPublishing === service._id ? "Saving..." : service.published ? <><CheckCircle size={14} /> Active</> : <><XCircle size={14} /> Disabled</>}
                      </button>
                    </td>
                    <td className="px-4 py-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/services/${service._id}`} className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors" title="Edit">
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(service._id)}
                          disabled={isDeleting === service._id}
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
      )}

      {activeTab === "packages" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialPackages.map((pkg) => (
            <div key={pkg._id} className="bg-white border border-border/50 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-serif text-2xl">{pkg.name}</h3>
                  <span className="text-xs uppercase tracking-widest text-muted">{pkg.packageId}</span>
                </div>
                <Link href={`/admin/services/packages/${pkg._id}`} className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors rounded-full border border-border/50">
                  <Edit3 size={16} />
                </Link>
              </div>
              <div className="text-3xl mb-6">{pkg.priceLabel}</div>
              <ul className="text-sm space-y-3 mb-6 flex-1 text-muted">
                <li>• {pkg.hours}</li>
                <li>• {pkg.photos}</li>
                {pkg.album && <li>• {pkg.album}</li>}
                {pkg.video && <li>• {pkg.video}</li>}
              </ul>
              <div className="text-xs font-semibold text-center py-2 bg-muted/10 text-muted uppercase tracking-wider">
                Managed Package
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

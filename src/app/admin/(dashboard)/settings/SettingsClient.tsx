"use client";

import { useState } from "react";
import { updateSettings, SerializedSettings } from "./actions";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";

export function SettingsClient({ initialSettings }: { initialSettings: SerializedSettings }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState<SerializedSettings>(initialSettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await updateSettings(formData);
      if (res.success) {
        setSuccess("Settings updated successfully");
        router.refresh();
      } else {
        setError(res.error || "Failed to update settings");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-gray-900">Site Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage business details and contact information used across the site.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 7030378806"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+91 7030378806"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="legend_photography@gmail.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Business Location</h3>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="Jayhind Colony Rd..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-y"
              />
            </div>

            <div>
              <label htmlFor="googleMapsUrl" className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
              <input
                type="url"
                id="googleMapsUrl"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Social & Media</h3>
            
            <div>
              <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1">YouTube Channel URL</label>
              <input
                type="url"
                id="youtubeUrl"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                placeholder="https://m.youtube.com/@..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

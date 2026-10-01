"use client";

import { useState } from "react";
import { updateSettings, SerializedSettings } from "./actions";
import { Save, Plus, Trash2 } from "lucide-react";
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

  const handleAddOtherLink = () => {
    setFormData(prev => ({
      ...prev,
      otherSocialLinks: [...(prev.otherSocialLinks || []), { platform: '', url: '' }]
    }));
  };

  const handleRemoveOtherLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      otherSocialLinks: prev.otherSocialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleOtherLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    setFormData(prev => {
      const newLinks = [...prev.otherSocialLinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, otherSocialLinks: newLinks };
    });
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  id="instagramUrl"
                  name="instagramUrl"
                  value={formData.instagramUrl || ''}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  id="facebookUrl"
                  name="facebookUrl"
                  value={formData.facebookUrl || ''}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                <input
                  type="url"
                  id="twitterUrl"
                  name="twitterUrl"
                  value={formData.twitterUrl || ''}
                  onChange={handleChange}
                  placeholder="https://twitter.com/..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1">YouTube Channel URL</label>
                <input
                  type="url"
                  id="youtubeUrl"
                  name="youtubeUrl"
                  value={formData.youtubeUrl || ''}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="pinterestUrl" className="block text-sm font-medium text-gray-700 mb-1">Pinterest URL</label>
                <input
                  type="url"
                  id="pinterestUrl"
                  name="pinterestUrl"
                  value={formData.pinterestUrl || ''}
                  onChange={handleChange}
                  placeholder="https://pinterest.com/..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={formData.linkedinUrl || ''}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-800">Other Social Links</h4>
                <button
                  type="button"
                  onClick={handleAddOtherLink}
                  className="text-sm flex items-center gap-1 text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
                >
                  <Plus size={16} />
                  Add Link
                </button>
              </div>
              
              {(!formData.otherSocialLinks || formData.otherSocialLinks.length === 0) ? (
                <p className="text-sm text-gray-500 italic">No additional links added.</p>
              ) : (
                <div className="space-y-4">
                  {formData.otherSocialLinks.map((link, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-end p-4 border border-gray-200 rounded-md bg-gray-50/50">
                      <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                        <input
                          type="text"
                          value={link.platform}
                          onChange={(e) => handleOtherLinkChange(index, 'platform', e.target.value)}
                          placeholder="e.g. TikTok, Behance"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                          required
                        />
                      </div>
                      <div className="flex-[2] w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => handleOtherLinkChange(index, 'url', e.target.value)}
                          placeholder="https://..."
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveOtherLink(index)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors border border-transparent hover:border-red-200 self-end mb-[2px]"
                        title="Remove link"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

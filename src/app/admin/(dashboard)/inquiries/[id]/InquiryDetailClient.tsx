"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  ArrowLeft, Phone, Mail, Calendar, MapPin, 
  Clock, Hash, Save, Trash2, Edit3 
} from "lucide-react";

import { 
  SerializedInquiry, 
  updateInquiryStatus, 
  updateInquiryNotes, 
  deleteInquiry 
} from "../actions";
import { InquiryStatus } from "@/lib/models/Inquiry";

const STATUS_COLORS: Record<InquiryStatus, string> = {
  "NEW": "bg-blue-100 text-blue-800 border-blue-200",
  "CONTACTED": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "FOLLOW-UP": "bg-orange-100 text-orange-800 border-orange-200",
  "CONFIRMED": "bg-green-100 text-green-800 border-green-200",
  "COMPLETED": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "CANCELLED": "bg-red-100 text-red-800 border-red-200",
  "CLOSED": "bg-gray-100 text-gray-800 border-gray-200"
};

const VALID_STATUSES: InquiryStatus[] = [
  "NEW", "CONTACTED", "FOLLOW-UP", "CONFIRMED", "COMPLETED", "CANCELLED", "CLOSED"
];

export function InquiryDetailClient({ initialData }: { initialData: SerializedInquiry }) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState<SerializedInquiry>(initialData);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const [notes, setNotes] = useState(inquiry.adminNotes || "");
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);
  
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as InquiryStatus;
    setIsUpdatingStatus(true);
    try {
      const res = await updateInquiryStatus(inquiry._id, newStatus);
      if (res.success && res.data) {
        setInquiry(res.data);
      } else {
        alert(res.error || "Failed to update status");
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsUpdatingNotes(true);
    try {
      const res = await updateInquiryNotes(inquiry._id, notes);
      if (res.success && res.data) {
        setInquiry(res.data);
      } else {
        alert(res.error || "Failed to save notes");
      }
    } finally {
      setIsUpdatingNotes(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this inquiry? This cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteInquiry(inquiry._id);
      if (res.success) {
        router.push("/admin/inquiries");
        router.refresh();
      } else {
        alert(res.error || "Failed to delete inquiry");
        setIsDeleting(false);
      }
    } catch (e) {
      setIsDeleting(false);
    }
  };

  const wpLink = `https://wa.me/${inquiry.phone.replace(/\D/g, "")}`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Link
            href="/admin/inquiries"
            className="text-xs uppercase tracking-wider text-muted hover:text-black mb-4 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Inquiries
          </Link>
          <h1 className="text-3xl font-serif">{inquiry.name}</h1>
          <p className="text-sm text-muted mt-2">
            Submitted on {format(new Date(inquiry.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={inquiry.status}
            onChange={handleStatusChange}
            disabled={isUpdatingStatus}
            className={`px-4 py-2 text-sm font-medium border outline-none disabled:opacity-50 transition-colors ${STATUS_COLORS[inquiry.status]}`}
          >
            {VALID_STATUSES.map(s => (
              <option key={s} value={s} className="bg-white text-black">{s}</option>
            ))}
          </select>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Details */}
          <div className="bg-white border border-border/50 p-6 md:p-8">
            <h2 className="text-sm uppercase tracking-widest text-muted mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs text-muted block mb-1">Phone</span>
                <div className="flex items-center gap-3">
                  <a href={`tel:${inquiry.phone}`} className="font-medium hover:text-accent transition-colors flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted" /> {inquiry.phone}
                  </a>
                  <a href={wpLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-green-50 text-green-700 px-2 py-1 border border-green-200 hover:bg-green-100 transition-colors">
                    WhatsApp
                  </a>
                </div>
              </div>
              
              {inquiry.email && (
                <div>
                  <span className="text-xs text-muted block mb-1">Email</span>
                  <a href={`mailto:${inquiry.email}`} className="font-medium hover:text-accent transition-colors flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted" /> {inquiry.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white border border-border/50 p-6 md:p-8">
            <h2 className="text-sm uppercase tracking-widest text-muted mb-6">Event Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div>
                <span className="text-xs text-muted block mb-1 flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Service
                </span>
                <div className="font-medium">{inquiry.service}</div>
              </div>
              
              <div>
                <span className="text-xs text-muted block mb-1 flex items-center gap-2">
                  <Clock className="h-3 w-3" /> Event Date
                </span>
                <div className="font-medium">{inquiry.eventDate || "Not specified"}</div>
              </div>

              <div>
                <span className="text-xs text-muted block mb-1 flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Location
                </span>
                <div className="font-medium">{inquiry.location || "Not specified"}</div>
              </div>

              <div>
                <span className="text-xs text-muted block mb-1 flex items-center gap-2">
                  <Hash className="h-3 w-3" /> No. of Events
                </span>
                <div className="font-medium">{inquiry.numberOfEvents || "Not specified"}</div>
              </div>
            </div>

            {inquiry.message && (
              <div>
                <span className="text-xs text-muted block mb-3 flex items-center gap-2">
                  <Edit3 className="h-3 w-3" /> Message
                </span>
                <div className="bg-muted/5 p-4 border border-border/50 text-sm whitespace-pre-wrap leading-relaxed">
                  {inquiry.message}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Notes */}
        <div className="space-y-8">
          <div className="bg-white border border-border/50 p-6">
            <h2 className="text-sm uppercase tracking-widest text-muted mb-6">Internal Notes</h2>
            <p className="text-xs text-muted mb-4">
              These notes are only visible to administrators. Use this to keep track of conversations and quotes.
            </p>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-48 p-3 text-sm border border-border/50 bg-transparent outline-none focus:border-black mb-4 transition-colors resize-none"
              placeholder="Add your notes here..."
            />
            
            <button
              onClick={handleSaveNotes}
              disabled={isUpdatingNotes || notes === inquiry.adminNotes}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isUpdatingNotes ? "Saving..." : "Save Notes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

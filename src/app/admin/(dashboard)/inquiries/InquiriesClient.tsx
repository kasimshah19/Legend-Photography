"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { SerializedInquiry } from "./actions";
import { InquiryStatus } from "@/lib/models/Inquiry";
import { Search, Filter, Phone, Mail } from "lucide-react";

const STATUS_COLORS: Record<InquiryStatus, string> = {
  "NEW": "bg-blue-100 text-blue-800 border-blue-200",
  "CONTACTED": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "FOLLOW-UP": "bg-orange-100 text-orange-800 border-orange-200",
  "CONFIRMED": "bg-green-100 text-green-800 border-green-200",
  "COMPLETED": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "CANCELLED": "bg-red-100 text-red-800 border-red-200",
  "CLOSED": "bg-gray-100 text-gray-800 border-gray-200"
};

export function InquiriesClient({ initialInquiries }: { initialInquiries: SerializedInquiry[] }) {
  const [inquiries] = useState<SerializedInquiry[]>(initialInquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "ALL">("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const services = Array.from(new Set(inquiries.map((i) => i.service).filter(Boolean)));

  const filteredInquiries = inquiries
    .filter((inquiry) => {
      const matchesSearch =
        inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.phone.includes(searchQuery);

      const matchesStatus = statusFilter === "ALL" || inquiry.status === statusFilter;
      const matchesService = serviceFilter === "ALL" || inquiry.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-serif">Inquiries</h1>
      </div>

      <div className="bg-white p-4 border border-border/50 shadow-sm flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border-b border-border/50 bg-transparent focus:border-black outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as InquiryStatus | "ALL")}
              className="text-sm border-b border-border/50 py-2 pr-6 outline-none focus:border-black"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="FOLLOW-UP">Follow Up</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="text-sm border-b border-border/50 py-2 pr-6 outline-none focus:border-black"
            >
              <option value="ALL">All Services</option>
              {services.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
              className="text-sm border-b border-border/50 py-2 pr-6 outline-none focus:border-black"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border/50 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-muted/5 border-b border-border/50 text-muted uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Name & Contact</th>
              <th className="px-6 py-4 font-medium">Service</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted">
                  No inquiries found matching your filters.
                </td>
              </tr>
            ) : (
              filteredInquiries.map((inquiry) => (
                <tr key={inquiry._id} className="hover:bg-muted/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{inquiry.name}</div>
                    <div className="text-xs text-muted mt-1 flex items-center gap-3">
                      <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1 hover:text-black transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Phone className="h-3 w-3" /> {inquiry.phone}
                      </a>
                      {inquiry.email && (
                        <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 hover:text-black transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Mail className="h-3 w-3" /> {inquiry.email}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-xs border border-gray-200">
                      {inquiry.service}
                    </span>
                    {inquiry.eventDate && (
                      <div className="text-xs text-muted mt-1">
                        {inquiry.eventDate}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted">
                    {format(new Date(inquiry.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs border ${STATUS_COLORS[inquiry.status]}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/inquiries/${inquiry._id}`}
                      className="text-xs font-medium uppercase tracking-wider hover:text-accent transition-colors"
                    >
                      View Details
                    </Link>
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

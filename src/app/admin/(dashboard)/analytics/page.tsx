import React from "react";
import { Metadata } from "next";
import { requireAuth } from "@/lib/authorization";
import { AnalyticsClient } from "./AnalyticsClient";

export const metadata: Metadata = {
  title: "Analytics | Legend Photography Admin",
  description: "View analytics and statistics for Legend Photography",
};

export default async function AnalyticsPage() {
  await requireAuth(['SUPER_ADMIN', 'ADMIN']);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 font-serif">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            View website traffic and business performance metrics.
          </p>
        </div>
      </div>
      
      <AnalyticsClient />
    </div>
  );
}

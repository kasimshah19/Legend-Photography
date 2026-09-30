"use client";

import React, { useState, useEffect } from "react";
import { getAuditLogs } from "./actions";
import { Search, Filter, Loader2 } from "lucide-react";
import { format } from "date-fns";

type AuditLog = {
  _id: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  metadata?: any;
  createdAt: string;
};

export default function AuditLogsClient() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [resource, setResource] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  
  const resources = ["ALL", "Portfolio", "Inquiry", "Media", "Service", "AdminUser", "Settings", "Homepage", "Film"];
  const actionsList = ["ALL", "CREATE", "UPDATE", "DELETE", "PUBLISH", "UNPUBLISH", "STATUS_CHANGED", "UPDATE_ROLE", "ACTIVATE", "DEACTIVATE", "LOGIN", "FAILED_LOGIN"];

  useEffect(() => {
    fetchLogs();
  }, [search, resource, actionFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    const result = await getAuditLogs({ search, resource, action: actionFilter, limit: 100 });
    if (result.success && result.data) {
      setLogs(result.data.logs);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-serif text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500">Track administrative actions across the system</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
            placeholder="Search by admin email or resource ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-48 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
          <select
            className="block w-full pl-9 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
            value={resource}
            onChange={(e) => setResource(e.target.value)}
          >
            {resources.map(r => <option key={r} value={r}>{r === "ALL" ? "All Resources" : r}</option>)}
          </select>
        </div>

        <div className="w-full md:w-48 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
          <select
            className="block w-full pl-9 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            {actionsList.map(a => <option key={a} value={a}>{a === "ALL" ? "All Actions" : a}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No audit logs found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.adminEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-medium">{log.resource}</span>
                      <br />
                      <span className="text-xs text-gray-400 font-mono" title={log.resourceId}>
                        {log.resourceId.substring(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {log.metadata ? (
                        <pre className="text-xs bg-gray-50 p-1 rounded border border-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
                          {JSON.stringify(log.metadata)}
                        </pre>
                      ) : (
                        <span className="text-gray-400 italic">No details</span>
                      )}
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

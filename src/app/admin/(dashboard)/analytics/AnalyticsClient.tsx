"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getAnalyticsData, DateRange } from "../../actions/analytics";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import {
  RefreshCw, TrendingUp, TrendingDown, Users, Eye, Clock, MousePointerClick,
  Smartphone, Monitor, Tablet, MapPin, Globe, Search, Activity, ArrowUpRight,
  MessageCircle, Phone, Mail, FolderHeart, Film, Briefcase, Calendar, Zap,
  BarChart3, ExternalLink,
} from "lucide-react";

// ─── Colors ────────────────────────────────────────────────────
const CHART_BLACK = "#111111";
const CHART_COLORS = ["#111111", "#444444", "#777777", "#AAAAAA", "#D4D4D4", "#E8E8E8"];
const DEVICE_COLORS: Record<string, string> = { desktop: "#111", mobile: "#555", tablet: "#999" };
const DEVICE_ICONS: Record<string, React.ReactNode> = {
  desktop: <Monitor size={16} />,
  mobile: <Smartphone size={16} />,
  tablet: <Tablet size={16} />,
};

const DATE_PRESETS: { label: string; value: DateRange }[] = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "This Year", value: "year" },
  { label: "All Time", value: "all" },
];

// ─── Helpers ───────────────────────────────────────────────────
function fmt(n: number | undefined | null): string {
  if (n === undefined || n === null) return "—";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function fmtDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function fmtPercent(rate: number | undefined | null): string {
  if (rate === undefined || rate === null) return "—";
  return `${(rate * 100).toFixed(1)}%`;
}

function ChangeIndicator({ change }: { change: number | null | undefined }) {
  if (change === null || change === undefined) return null;
  const isPositive = change >= 0;
  return (
    <span className={`inline-flex items-center text-xs font-medium ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
      {isPositive ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
      {Math.abs(change).toFixed(1)}%
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────
export function AnalyticsClient() {
  const [range, setRange] = useState<DateRange>("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [ga4Connected, setGa4Connected] = useState(false);
  const [trendMetric, setTrendMetric] = useState<"users" | "sessions" | "pageViews">("users");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAnalyticsData(range);
      if (res.success && res.data) {
        setData(res.data);
        setGa4Connected(!!res.ga4Connected);
      } else {
        setError(res.error || "Failed to load data");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="space-y-8">
      {/* ─── Header Bar ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {DATE_PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => setRange(p.value)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors font-medium ${
                range === p.value ? "bg-black text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {/* Data source badge */}
          <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded ${ga4Connected ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            {ga4Connected ? "GA4 Connected" : "GA4 Not Connected"}
          </span>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center px-3 py-1.5 text-xs text-gray-500 hover:text-black hover:bg-gray-50 rounded-md transition-colors font-medium"
          >
            <RefreshCw size={14} className={`mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : loading && !data ? (
        <LoadingSkeleton />
      ) : !data ? (
        <EmptyState message="No analytics data available." />
      ) : (
        <>
          {/* ═══════ REALTIME ═══════ */}
          {data.realtime && (
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-sm font-medium text-gray-700">Realtime</span>
              </div>
              <span className="text-2xl font-semibold font-serif">{data.realtime.activeUsers}</span>
              <span className="text-xs text-gray-500">active users now</span>
              {data.realtime.activePages?.length > 0 && (
                <div className="ml-auto hidden md:flex gap-2">
                  {data.realtime.activePages.slice(0, 3).map((p: any) => (
                    <span key={p.page} className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-600">
                      {p.page} <strong>{p.users}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════ KPI CARDS ═══════ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ga4Connected && data.ga4 && !data.ga4.error ? (
              <>
                <KPICard title="Users" value={fmt(data.ga4.overview.users.value)} change={data.ga4.overview.users.change} icon={<Users size={18} />} source="GA4" />
                <KPICard title="Sessions" value={fmt(data.ga4.overview.sessions.value)} change={data.ga4.overview.sessions.change} icon={<Activity size={18} />} source="GA4" />
                <KPICard title="Page Views" value={fmt(data.ga4.overview.pageViews.value)} change={data.ga4.overview.pageViews.change} icon={<Eye size={18} />} source="GA4" />
                <KPICard title="Avg Duration" value={fmtDuration(data.ga4.overview.avgSessionDuration.value)} change={data.ga4.overview.avgSessionDuration.change} icon={<Clock size={18} />} source="GA4" />
              </>
            ) : (
              <>
                <KPICard title="Users" value="—" icon={<Users size={18} />} source="GA4" disabled />
                <KPICard title="Sessions" value="—" icon={<Activity size={18} />} source="GA4" disabled />
                <KPICard title="Page Views" value="—" icon={<Eye size={18} />} source="GA4" disabled />
                <KPICard title="Avg Duration" value="—" icon={<Clock size={18} />} source="GA4" disabled />
              </>
            )}
            <KPICard title="Inquiries" value={fmt(data.totalInquiries)} icon={<MessageCircle size={18} />} source="Database" />
            <KPICard
              title="Conversion"
              value={data.conversionRate ? `${data.conversionRate}%` : "—"}
              icon={<TrendingUp size={18} />}
              source="Database"
              tooltip="Confirmed inquiries ÷ total inquiries"
            />
          </div>

          {/* GA4 not connected banner */}
          {!ga4Connected && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <BarChart3 size={20} className="text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-900">Analytics Tracking Not Connected</h3>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Website visitor analytics (Users, Sessions, Page Views, Traffic Sources, Devices, Geography) require Google Analytics 4. 
                    Add <code className="bg-amber-100 px-1 rounded text-[11px]">NEXT_PUBLIC_GA_MEASUREMENT_ID</code>, <code className="bg-amber-100 px-1 rounded text-[11px]">GA4_PROPERTY_ID</code>, <code className="bg-amber-100 px-1 rounded text-[11px]">GA4_CLIENT_EMAIL</code>, and <code className="bg-amber-100 px-1 rounded text-[11px]">GA4_PRIVATE_KEY</code> to your environment.
                  </p>
                  <p className="text-xs text-amber-600 mt-2">Business analytics (Inquiries, Conversions, Events) are shown from the database below.</p>
                </div>
              </div>
            </div>
          )}

          {ga4Connected && data.ga4?.error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {data.ga4.error}
            </div>
          )}

          {/* ═══════ TRAFFIC TREND ═══════ */}
          {ga4Connected && data.ga4?.trafficTrend && (
            <Section title="Traffic Trend" source="Google Analytics" icon={<Activity size={16} />}>
              <div className="flex gap-1 mb-4">
                {(["users", "sessions", "pageViews"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setTrendMetric(m)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      trendMetric === m ? "bg-black text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {m === "pageViews" ? "Page Views" : m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
              <div className="h-[320px]">
                {data.ga4.trafficTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.ga4.trafficTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)", fontSize: 12 }} />
                      <Line type="monotone" dataKey={trendMetric} stroke={CHART_BLACK} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: CHART_BLACK }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="No traffic data for this period." />
                )}
              </div>
            </Section>
          )}

          {/* ═══════ INQUIRY TREND (Always from DB) ═══════ */}
          <Section title="Inquiry Trend" source="Database" icon={<MessageCircle size={16} />}>
            <div className="h-[280px]">
              {data.inquiryTrend?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.inquiryTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)", fontSize: 12 }} />
                    <Bar dataKey="count" fill={CHART_BLACK} radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No inquiry data for this period." />
              )}
            </div>
          </Section>

          {/* ═══════ TWO-COLUMN: TRAFFIC SOURCES + LANDING PAGES ═══════ */}
          {ga4Connected && data.ga4 && !data.ga4.error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title="Traffic Sources" source="Google Analytics" icon={<Globe size={16} />}>
                {data.ga4.trafficSources?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                          <th className="text-left py-2 font-medium">Source</th>
                          <th className="text-right py-2 font-medium">Users</th>
                          <th className="text-right py-2 font-medium">Sessions</th>
                          <th className="text-right py-2 font-medium hidden sm:table-cell">Engage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.ga4.trafficSources.map((s: any) => (
                          <tr key={s.source} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="py-2.5 font-medium text-gray-800">{s.source}</td>
                            <td className="py-2.5 text-right text-gray-600">{fmt(s.users)}</td>
                            <td className="py-2.5 text-right text-gray-600">{fmt(s.sessions)}</td>
                            <td className="py-2.5 text-right text-gray-500 hidden sm:table-cell">{fmtPercent(s.engagementRate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState message="No traffic source data." />
                )}
              </Section>

              <Section title="Landing Pages" source="Google Analytics" icon={<ArrowUpRight size={16} />}>
                {data.ga4.landingPages?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                          <th className="text-left py-2 font-medium">Page</th>
                          <th className="text-right py-2 font-medium">Sessions</th>
                          <th className="text-right py-2 font-medium hidden sm:table-cell">Engage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.ga4.landingPages.map((p: any) => (
                          <tr key={p.page} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="py-2.5 font-medium text-gray-800 max-w-[200px] truncate" title={p.page}>{p.page}</td>
                            <td className="py-2.5 text-right text-gray-600">{fmt(p.sessions)}</td>
                            <td className="py-2.5 text-right text-gray-500 hidden sm:table-cell">{fmtPercent(p.engagementRate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState message="No landing page data." />
                )}
              </Section>
            </div>
          )}

          {/* ═══════ TWO-COLUMN: TOP PAGES + PORTFOLIO ═══════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ga4Connected && data.ga4?.topPages && (
              <Section title="Top Pages" source="Google Analytics" icon={<Eye size={16} />}>
                {data.ga4.topPages.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                          <th className="text-left py-2 font-medium">Page</th>
                          <th className="text-right py-2 font-medium">Views</th>
                          <th className="text-right py-2 font-medium">Users</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.ga4.topPages.map((p: any) => (
                          <tr key={p.page} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="py-2.5 font-medium text-gray-800 max-w-[200px] truncate" title={p.page}>{p.page}</td>
                            <td className="py-2.5 text-right text-gray-600">{fmt(p.views)}</td>
                            <td className="py-2.5 text-right text-gray-600">{fmt(p.users)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState message="No page data." />
                )}
              </Section>
            )}

            {/* Portfolio Performance */}
            <Section title="Portfolio Performance" source={ga4Connected ? "Google Analytics" : "Database"} icon={<FolderHeart size={16} />}>
              {ga4Connected && data.ga4?.portfolioPerformance?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        <th className="text-left py-2 font-medium">Album</th>
                        <th className="text-right py-2 font-medium">Views</th>
                        <th className="text-right py-2 font-medium">Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.ga4.portfolioPerformance.map((p: any) => (
                        <tr key={p.page} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="py-2.5 font-medium text-gray-800">{p.page.replace("/portfolio/", "").replace(/-/g, " ")}</td>
                          <td className="py-2.5 text-right text-gray-600">{fmt(p.views)}</td>
                          <td className="py-2.5 text-right text-gray-600">{fmt(p.users)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Albums</span>
                    <span className="font-semibold">{data.portfolioCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Published</span>
                    <span className="font-semibold">{data.publishedPortfolioCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Films</span>
                    <span className="font-semibold">{data.filmCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Services</span>
                    <span className="font-semibold">{data.serviceCount}</span>
                  </div>
                  {!ga4Connected && (
                    <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                      Album-level view analytics require GA4 connection.
                    </p>
                  )}
                </div>
              )}
            </Section>
          </div>

          {/* ═══════ CONVERSIONS ═══════ */}
          <Section title="Business Conversions" source={ga4Connected ? "Google Analytics" : "Database"} icon={<MousePointerClick size={16} />}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {ga4Connected && data.ga4?.conversions?.length > 0 ? (
                data.ga4.conversions.map((c: any) => (
                  <ConversionCard key={c.event} event={c.event} count={c.count} />
                ))
              ) : (
                <>
                  <ConversionCard event="contact_form_submit" count={data.totalInquiries} label="Form Submissions" />
                  <ConversionCard event="whatsapp_click" count={null} label="WhatsApp Clicks" disabled={!ga4Connected} />
                  <ConversionCard event="phone_click" count={null} label="Phone Clicks" disabled={!ga4Connected} />
                  <ConversionCard event="email_click" count={null} label="Email Clicks" disabled={!ga4Connected} />
                  <ConversionCard event="portfolio_cta_click" count={null} label="Portfolio CTA" disabled={!ga4Connected} />
                  <ConversionCard event="service_cta_click" count={null} label="Service CTA" disabled={!ga4Connected} />
                  <ConversionCard event="film_click" count={null} label="Film Plays" disabled={!ga4Connected} />
                </>
              )}
            </div>
            {!ga4Connected && (
              <p className="text-xs text-gray-400 mt-4">
                WhatsApp, Phone, and Email click tracking requires GA4 connection. Events are instrumented and will populate once connected.
              </p>
            )}
          </Section>

          {/* ═══════ TWO-COLUMN: STATUS + EVENT TYPE ═══════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Inquiry Status" source="Database" icon={<Activity size={16} />}>
              {data.statusBreakdown?.length > 0 ? (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/2 h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.statusBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="count" nameKey="status">
                          {data.statusBreakdown.map((_: any, i: number) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)", fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2 space-y-2">
                    {data.statusBreakdown.map((item: any, i: number) => (
                      <div key={item.status} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                          <span className="text-gray-600">{item.status}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState message="No inquiry data." />
              )}
            </Section>

            <Section title="Event Types" source="Database" icon={<Calendar size={16} />}>
              {data.eventTypeBreakdown?.length > 0 ? (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.eventTypeBreakdown} layout="vertical" margin={{ left: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#f0f0f0" />
                      <XAxis type="number" allowDecimals={false} hide />
                      <YAxis dataKey="service" type="category" tick={{ fontSize: 12, fill: "#555" }} axisLine={false} tickLine={false} width={60} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)", fontSize: 12 }} />
                      <Bar dataKey="count" fill={CHART_BLACK} radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState message="No event type data." />
              )}
            </Section>
          </div>

          {/* ═══════ TWO-COLUMN: DEVICES + GEOGRAPHY ═══════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Devices" source={ga4Connected ? "Google Analytics" : "Not available"} icon={<Monitor size={16} />}>
              {ga4Connected && data.ga4?.devices?.length > 0 ? (
                <div className="space-y-4">
                  {data.ga4.devices.map((d: any) => {
                    const total = data.ga4.devices.reduce((sum: number, x: any) => sum + x.sessions, 0);
                    const pct = total > 0 ? (d.sessions / total) * 100 : 0;
                    return (
                      <div key={d.device}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2 text-sm">
                            {DEVICE_ICONS[d.device] || <Monitor size={16} />}
                            <span className="font-medium text-gray-800 capitalize">{d.device}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-500">{fmt(d.sessions)} sessions</span>
                            <span className="font-semibold text-gray-900">{pct.toFixed(0)}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: DEVICE_COLORS[d.device] || "#888" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState message={ga4Connected ? "No device data." : "Device analytics require GA4 connection."} />
              )}
            </Section>

            <Section title="Top Locations" source={ga4Connected && data.ga4?.geography?.length ? "Google Analytics" : "Database"} icon={<MapPin size={16} />}>
              {ga4Connected && data.ga4?.geography?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        <th className="text-left py-2 font-medium">City</th>
                        <th className="text-left py-2 font-medium hidden sm:table-cell">Country</th>
                        <th className="text-right py-2 font-medium">Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.ga4.geography.map((g: any, i: number) => (
                        <tr key={`${g.city}-${i}`} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="py-2 font-medium text-gray-800">{g.city}</td>
                          <td className="py-2 text-gray-500 hidden sm:table-cell">{g.country}</td>
                          <td className="py-2 text-right text-gray-600">{fmt(g.users)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : data.locationBreakdown?.length > 0 ? (
                <div className="space-y-3">
                  {data.locationBreakdown.map((loc: any) => {
                    const maxCount = Math.max(...data.locationBreakdown.map((l: any) => l.count));
                    const pct = (loc.count / maxCount) * 100;
                    return (
                      <div key={loc.location}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                          <span className="font-medium text-gray-800">{loc.location}</span>
                          <span className="font-semibold text-gray-900">{loc.count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-xs text-gray-400 pt-2">Source: Inquiry locations from database</p>
                </div>
              ) : (
                <EmptyState message="No location data available." />
              )}
            </Section>
          </div>

          {/* ═══════ SEARCH PERFORMANCE (placeholder for GSC) ═══════ */}
          <Section title="Search Performance" source="Google Search Console" icon={<Search size={16} />}>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Search size={32} className="text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">Search Console Not Connected</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                Connect Google Search Console to view Clicks, Impressions, CTR, and Average Position data.
                This is separate from GA4 website analytics.
              </p>
            </div>
          </Section>
        </>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────

function Section({ title, source, icon, children }: { title: string; source: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-gray-400">{icon}</span>
          {title}
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{source}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function KPICard({ title, value, change, icon, source, disabled, tooltip }: {
  title: string; value: string; change?: number | null; icon: React.ReactNode;
  source: string; disabled?: boolean; tooltip?: string;
}) {
  return (
    <div className={`p-4 rounded-xl border transition-colors ${disabled ? "bg-gray-50 border-gray-100" : "bg-white border-gray-100 shadow-sm"}`} title={tooltip}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium uppercase tracking-wide ${disabled ? "text-gray-300" : "text-gray-400"}`}>{title}</span>
        <span className={`${disabled ? "text-gray-300" : "text-gray-400"}`}>{icon}</span>
      </div>
      <div className={`text-2xl font-semibold font-serif ${disabled ? "text-gray-300" : "text-gray-900"}`}>{value}</div>
      <div className="flex items-center justify-between mt-2">
        {change !== undefined ? <ChangeIndicator change={change} /> : <span />}
        <span className={`text-[9px] uppercase tracking-wider ${disabled ? "text-gray-300" : "text-gray-400"}`}>{source}</span>
      </div>
    </div>
  );
}

function ConversionCard({ event, count, label, disabled }: { event: string; count: number | null; label?: string; disabled?: boolean }) {
  const labels: Record<string, string> = {
    contact_form_submit: "Form Submissions",
    whatsapp_click: "WhatsApp Clicks",
    phone_click: "Phone Clicks",
    email_click: "Email Clicks",
    portfolio_cta_click: "Portfolio CTA",
    service_cta_click: "Service CTA",
    film_click: "Film Plays",
  };
  const icons: Record<string, React.ReactNode> = {
    contact_form_submit: <MessageCircle size={16} />,
    whatsapp_click: <Zap size={16} />,
    phone_click: <Phone size={16} />,
    email_click: <Mail size={16} />,
    portfolio_cta_click: <FolderHeart size={16} />,
    service_cta_click: <Briefcase size={16} />,
    film_click: <Film size={16} />,
  };

  return (
    <div className={`p-4 rounded-xl border ${disabled || count === null ? "bg-gray-50 border-gray-100" : "bg-white border-gray-100 shadow-sm"}`}>
      <div className={`mb-2 ${disabled || count === null ? "text-gray-300" : "text-gray-400"}`}>{icons[event] || <MousePointerClick size={16} />}</div>
      <div className={`text-xl font-semibold font-serif ${disabled || count === null ? "text-gray-300" : "text-gray-900"}`}>
        {count !== null ? fmt(count) : "—"}
      </div>
      <div className={`text-xs mt-1 ${disabled || count === null ? "text-gray-300" : "text-gray-500"}`}>{label || labels[event] || event}</div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-xl" />
        ))}
      </div>
      <div className="h-80 bg-gray-100 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-60 bg-gray-100 rounded-xl" />
        <div className="h-60 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-10 text-sm text-gray-400">
      {message}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
      <p className="text-sm text-red-600 mb-3">{message}</p>
      <button onClick={onRetry} className="px-4 py-2 text-sm bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
        Retry
      </button>
    </div>
  );
}

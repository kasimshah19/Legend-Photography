/**
 * GA4 Analytics Service — Server-side only.
 * 
 * Uses the Google Analytics Data API v1 (REST) to fetch analytics data.
 * Requires a GA4 service account with read access to the property.
 * 
 * Environment variables:
 *   GA4_PROPERTY_ID       — GA4 property ID (e.g. "123456789")
 *   GA4_CLIENT_EMAIL      — Service account email
 *   GA4_PRIVATE_KEY       — Service account private key (PEM)
 * 
 * SECURITY: This file runs ONLY on the server. Credentials never reach the browser.
 */

import { SignJWT, importPKCS8 } from "jose";

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const GA4_CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL;
const GA4_PRIVATE_KEY = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n");

const GA4_API_BASE = "https://analyticsdata.googleapis.com/v1beta";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

// ─── Token Cache ───────────────────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiry = 0;

export function isGA4Configured(): boolean {
  return !!(GA4_PROPERTY_ID && GA4_CLIENT_EMAIL && GA4_PRIVATE_KEY);
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  if (!GA4_CLIENT_EMAIL || !GA4_PRIVATE_KEY) {
    throw new Error("GA4 service account not configured");
  }

  const now = Math.floor(Date.now() / 1000);
  const key = await importPKCS8(GA4_PRIVATE_KEY, "RS256");

  const jwt = await new SignJWT({
    iss: GA4_CLIENT_EMAIL,
    scope: SCOPE,
    aud: TOKEN_URL,
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Token request failed: ${res.status} ${errBody}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken!;
}

async function runReport(body: Record<string, unknown>): Promise<any> {
  const token = await getAccessToken();
  const res = await fetch(`${GA4_API_BASE}/properties/${GA4_PROPERTY_ID}:runReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`GA4 report failed: ${res.status} ${errBody}`);
  }

  return res.json();
}

async function runRealtimeReport(body: Record<string, unknown>): Promise<any> {
  const token = await getAccessToken();
  const res = await fetch(`${GA4_API_BASE}/properties/${GA4_PROPERTY_ID}:runRealtimeReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`GA4 realtime report failed: ${res.status} ${errBody}`);
  }

  return res.json();
}

// ─── Helper ────────────────────────────────────────────────────

function extractRows(report: any): Array<{ dimensions: string[]; metrics: string[] }> {
  if (!report?.rows) return [];
  return report.rows.map((row: any) => ({
    dimensions: (row.dimensionValues || []).map((d: any) => d.value),
    metrics: (row.metricValues || []).map((m: any) => m.value),
  }));
}

function dateStr(d: Date): string {
  return d.toISOString().split("T")[0].replace(/-/g, "");
}

// ─── Public API ────────────────────────────────────────────────

export type GA4DateRange = {
  startDate: string; // "YYYY-MM-DD" or "NdaysAgo" or "today"
  endDate: string;
};

export async function getOverview(dateRange: GA4DateRange, comparisonRange?: GA4DateRange) {
  const dateRanges: any[] = [{ startDate: dateRange.startDate, endDate: dateRange.endDate }];
  if (comparisonRange) {
    dateRanges.push({ startDate: comparisonRange.startDate, endDate: comparisonRange.endDate });
  }

  const report = await runReport({
    dateRanges,
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "engagedSessions" },
      { name: "averageSessionDuration" },
      { name: "engagementRate" },
      { name: "conversions" },
    ],
  });

  const rows = extractRows(report);
  const current = rows[0]?.metrics || [];
  const previous = rows[1]?.metrics || [];

  const fmt = (idx: number) => {
    const cur = parseFloat(current[idx] || "0");
    const prev = parseFloat(previous[idx] || "0");
    const change = prev > 0 ? ((cur - prev) / prev) * 100 : null;
    return { value: cur, change };
  };

  return {
    users: fmt(0),
    sessions: fmt(1),
    pageViews: fmt(2),
    engagedSessions: fmt(3),
    avgSessionDuration: fmt(4),
    engagementRate: fmt(5),
    conversions: fmt(6),
  };
}

export async function getTrafficTrend(dateRange: GA4DateRange) {
  const report = await runReport({
    dateRanges: [dateRange],
    dimensions: [{ name: "date" }],
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
    ],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });

  return extractRows(report).map((r) => ({
    date: `${r.dimensions[0].slice(0, 4)}-${r.dimensions[0].slice(4, 6)}-${r.dimensions[0].slice(6, 8)}`,
    users: parseInt(r.metrics[0]),
    sessions: parseInt(r.metrics[1]),
    pageViews: parseInt(r.metrics[2]),
  }));
}

export async function getTrafficSources(dateRange: GA4DateRange) {
  const report = await runReport({
    dateRanges: [dateRange],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "engagementRate" },
      { name: "conversions" },
    ],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  });

  return extractRows(report).map((r) => ({
    source: r.dimensions[0],
    users: parseInt(r.metrics[0]),
    sessions: parseInt(r.metrics[1]),
    engagementRate: parseFloat(r.metrics[2]),
    conversions: parseInt(r.metrics[3]),
  }));
}

export async function getTopPages(dateRange: GA4DateRange) {
  const report = await runReport({
    dateRanges: [dateRange],
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "totalUsers" },
      { name: "averageSessionDuration" },
    ],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 15,
  });

  return extractRows(report).map((r) => ({
    page: r.dimensions[0],
    views: parseInt(r.metrics[0]),
    users: parseInt(r.metrics[1]),
    avgDuration: parseFloat(r.metrics[2]),
  }));
}

export async function getLandingPages(dateRange: GA4DateRange) {
  const report = await runReport({
    dateRanges: [dateRange],
    dimensions: [{ name: "landingPagePlusQueryString" }],
    metrics: [
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "engagementRate" },
      { name: "conversions" },
    ],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  });

  return extractRows(report).map((r) => ({
    page: r.dimensions[0],
    sessions: parseInt(r.metrics[0]),
    users: parseInt(r.metrics[1]),
    engagementRate: parseFloat(r.metrics[2]),
    conversions: parseInt(r.metrics[3]),
  }));
}

export async function getDeviceBreakdown(dateRange: GA4DateRange) {
  const report = await runReport({
    dateRanges: [dateRange],
    dimensions: [{ name: "deviceCategory" }],
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "engagementRate" },
    ],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });

  return extractRows(report).map((r) => ({
    device: r.dimensions[0],
    users: parseInt(r.metrics[0]),
    sessions: parseInt(r.metrics[1]),
    engagementRate: parseFloat(r.metrics[2]),
  }));
}

export async function getGeography(dateRange: GA4DateRange) {
  const report = await runReport({
    dateRanges: [dateRange],
    dimensions: [{ name: "country" }, { name: "city" }],
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
    ],
    orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
    limit: 15,
  });

  return extractRows(report).map((r) => ({
    country: r.dimensions[0],
    city: r.dimensions[1] === "(not set)" ? "Unknown" : r.dimensions[1],
    users: parseInt(r.metrics[0]),
    sessions: parseInt(r.metrics[1]),
  }));
}

export async function getConversionEvents(dateRange: GA4DateRange) {
  const report = await runReport({
    dateRanges: [dateRange],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        inListFilter: {
          values: [
            "contact_form_submit",
            "whatsapp_click",
            "phone_click",
            "email_click",
            "portfolio_cta_click",
            "service_cta_click",
            "film_click",
          ],
        },
      },
    },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
  });

  return extractRows(report).map((r) => ({
    event: r.dimensions[0],
    count: parseInt(r.metrics[0]),
  }));
}

export async function getPortfolioPerformance(dateRange: GA4DateRange) {
  const report = await runReport({
    dateRanges: [dateRange],
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "totalUsers" },
      { name: "averageSessionDuration" },
    ],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "BEGINS_WITH",
          value: "/portfolio/",
        },
      },
    },
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10,
  });

  return extractRows(report).map((r) => ({
    page: r.dimensions[0],
    views: parseInt(r.metrics[0]),
    users: parseInt(r.metrics[1]),
    avgDuration: parseFloat(r.metrics[2]),
  }));
}

export async function getRealtimeData() {
  const report = await runRealtimeReport({
    metrics: [{ name: "activeUsers" }],
  });
  
  const rows = extractRows(report);
  const activeUsers = rows[0]?.metrics[0] ? parseInt(rows[0].metrics[0]) : 0;

  // Active pages
  const pagesReport = await runRealtimeReport({
    dimensions: [{ name: "unifiedScreenName" }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    limit: 5,
  });

  const activePages = extractRows(pagesReport).map((r) => ({
    page: r.dimensions[0],
    users: parseInt(r.metrics[0]),
  }));

  return { activeUsers, activePages };
}

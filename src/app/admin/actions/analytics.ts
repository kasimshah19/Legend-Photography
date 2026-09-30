"use server";

import { connectMongo } from "@/lib/mongodb";
import { Inquiry } from "@/lib/models/Inquiry";
import { Portfolio } from "@/lib/models/Portfolio";
import { Film } from "@/lib/models/Film";
import { Service } from "@/lib/models/Service";
import { requireAuth } from "@/lib/authorization";
import * as ga4 from "@/lib/ga4";

export type DateRange = "today" | "yesterday" | "7d" | "30d" | "90d" | "year" | "all";

function getDateBounds(range: DateRange) {
  const now = new Date();
  let startDate: Date;
  let ga4Start: string;
  let ga4End = "today";
  let daysBack = 30;

  switch (range) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      ga4Start = "today";
      ga4End = "today";
      daysBack = 1;
      break;
    case "yesterday":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      ga4Start = "yesterday";
      ga4End = "yesterday";
      daysBack = 1;
      break;
    case "7d":
      startDate = new Date(now.getTime() - 7 * 86400000);
      ga4Start = "7daysAgo";
      daysBack = 7;
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 86400000);
      ga4Start = "30daysAgo";
      daysBack = 30;
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 86400000);
      ga4Start = "90daysAgo";
      daysBack = 90;
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      ga4Start = `${now.getFullYear()}-01-01`;
      daysBack = Math.ceil((now.getTime() - startDate.getTime()) / 86400000);
      break;
    case "all":
      startDate = new Date(0);
      ga4Start = "2020-01-01";
      daysBack = 365;
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 86400000);
      ga4Start = "30daysAgo";
      daysBack = 30;
  }

  // Comparison range
  const compStart = new Date(startDate.getTime() - daysBack * 86400000);
  const compEnd = new Date(startDate.getTime() - 1);
  const compGA4Start = compStart.toISOString().split("T")[0];
  const compGA4End = compEnd.toISOString().split("T")[0];

  return {
    startDate,
    ga4Range: { startDate: ga4Start, endDate: ga4End },
    comparisonRange: { startDate: compGA4Start, endDate: compGA4End },
    daysBack,
  };
}

export async function getAnalyticsData(range: DateRange) {
  await requireAuth(["SUPER_ADMIN", "ADMIN"]);

  const { startDate, ga4Range, comparisonRange } = getDateBounds(range);
  const inquiryMatch = { createdAt: { $gte: startDate } };

  const ga4Connected = ga4.isGA4Configured();

  // ─── Parallel Fetching ───────────────────────────────────────
  try {
    await connectMongo();

    // MongoDB queries
    const [
      totalInquiries,
      confirmedInquiries,
      portfolioCount,
      publishedPortfolioCount,
      filmCount,
      serviceCount,
      trendAgg,
      statusAgg,
      eventTypeAgg,
      locationAgg,
    ] = await Promise.all([
      Inquiry.countDocuments(inquiryMatch),
      Inquiry.countDocuments({ ...inquiryMatch, status: "CONFIRMED" }),
      Portfolio.countDocuments(),
      Portfolio.countDocuments({ published: true }),
      Film.countDocuments(),
      Service.countDocuments(),
      Inquiry.aggregate([
        { $match: inquiryMatch },
        {
          $group: {
            _id: {
              $dateToString: {
                format: range === "today" ? "%Y-%m-%d %H:00" : range === "year" || range === "all" ? "%Y-%m" : "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Inquiry.aggregate([
        { $match: inquiryMatch },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Inquiry.aggregate([
        { $match: inquiryMatch },
        { $group: { _id: "$service", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Inquiry.aggregate([
        { $match: { ...inquiryMatch, location: { $nin: [null, ""] } } },
        { $group: { _id: "$location", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    // GA4 queries — only if configured
    let ga4Data: any = null;
    if (ga4Connected) {
      try {
        const [
          overview,
          trafficTrend,
          trafficSources,
          topPages,
          landingPages,
          devices,
          geography,
          conversions,
          portfolioPerformance,
        ] = await Promise.all([
          ga4.getOverview(ga4Range, comparisonRange),
          ga4.getTrafficTrend(ga4Range),
          ga4.getTrafficSources(ga4Range),
          ga4.getTopPages(ga4Range),
          ga4.getLandingPages(ga4Range),
          ga4.getDeviceBreakdown(ga4Range),
          ga4.getGeography(ga4Range),
          ga4.getConversionEvents(ga4Range),
          ga4.getPortfolioPerformance(ga4Range),
        ]);

        ga4Data = {
          overview,
          trafficTrend,
          trafficSources,
          topPages,
          landingPages,
          devices,
          geography,
          conversions,
          portfolioPerformance,
        };
      } catch (err) {
        console.error("GA4 fetch error:", err);
        ga4Data = { error: "Failed to load GA4 data. Check credentials." };
      }
    }

    // Realtime — separate, non-blocking
    let realtime = null;
    if (ga4Connected) {
      try {
        realtime = await ga4.getRealtimeData();
      } catch {
        // Realtime is optional, fail silently
      }
    }

    return {
      success: true,
      ga4Connected,
      data: {
        // Business metrics (MongoDB)
        totalInquiries,
        confirmedInquiries,
        conversionRate: totalInquiries > 0 ? ((confirmedInquiries / totalInquiries) * 100).toFixed(1) : null,
        portfolioCount,
        publishedPortfolioCount,
        filmCount,
        serviceCount,
        inquiryTrend: trendAgg.map((t) => ({ date: t._id, count: t.count })),
        statusBreakdown: statusAgg.map((s) => ({ status: s._id, count: s.count })),
        eventTypeBreakdown: eventTypeAgg.map((e) => ({ service: e._id || "Unknown", count: e.count })),
        locationBreakdown: locationAgg.map((l) => ({ location: l._id, count: l.count })),
        // Website analytics (GA4)
        ga4: ga4Data,
        realtime,
      },
    };
  } catch (error) {
    console.error("Analytics error:", error);
    return { success: false, ga4Connected, error: "Failed to load analytics data." };
  }
}

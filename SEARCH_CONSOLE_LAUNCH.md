# Google Search Console Launch Plan

## Pre-Launch Prerequisites
1. **Domain Verification**: Ensure `NEXT_PUBLIC_SITE_URL` is correct in production `.env`.
2. **Local Business Data**: Ensure address and phone numbers are verified and match Google Business Profile.

## Launch Checklist
- [ ] **Verify Domain**: Add and verify the production domain property in Google Search Console via DNS record.
- [ ] **Submit Sitemap**: Navigate to Sitemaps in GSC and submit `https://[yourdomain.com]/sitemap.xml`.
- [ ] **Inspect Homepage**: Use the URL Inspection tool on the homepage and request indexing.
- [ ] **Inspect Services Page**: Request indexing for `/services`.
- [ ] **Inspect Contact Page**: Request indexing for `/contact`.
- [ ] **Inspect Sample Portfolio Album**: Request indexing for a representative dynamic `/portfolio/[slug]` page to verify schema and image parsing.

## Ongoing Monitoring
- **Indexing Status**: Monitor the "Pages" report for errors (404s, Soft 404s, Crawl anomalies).
- **Core Web Vitals**: Monitor the "Experience" section to ensure LCP, CLS, and INP remain in the "Good" range.
- **Search Performance**: Monitor impressions, clicks, CTR, and average position for Brand and Non-Brand queries.
- **Rich Results**: Monitor the "Enhancements" section for valid Breadcrumbs, Sitelinks searchbox, and Local Business schema.

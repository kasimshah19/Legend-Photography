# Legend Photography - SEO Architecture & Implementation

This document outlines the SEO implementation, technical foundations, strategy, and maintenance checklist for Legend Photography. It serves as the single source of truth for the project's search engine optimization.

## 1. SEO Strategy & Focus

The SEO strategy is designed to maximize legitimate, intent-driven organic traffic without resorting to black-hat tactics. Focus areas include:
- **Local SEO:** Optimizing for location-specific photography services.
- **Visual SEO (Images & Video):** Maximizing discoverability of portfolio assets.
- **Technical Excellence:** Perfect crawlability, indexability, and Core Web Vitals.
- **Semantic Clarity:** Using structured data to explicitly define the business entity.
- **Content Authenticity:** Using only verified business information. No fake locations, reviews, or awards.

---

## 2. Technical SEO Implementation

### 2.1 Metadata Architecture
All indexable pages feature unique, descriptive titles and descriptions optimized for search intent.
- **Global Config:** `siteConfig.ts` centralizes business information.
- **Site-Wide Meta (`layout.tsx`):**
  - Defines `metadataBase` to avoid relative URL issues.
  - Implements Open Graph (OG) and Twitter card defaults.
- **Page-Specific Meta:**
  - `page.tsx`: Explicitly defines the homepage metadata to establish the primary business intent ("Premium Wedding & Pre-Wedding Photography").
  - `portfolio/page.tsx`: Refined to target "Photography Portfolio" searches.
  - `services/page.tsx`: Targets "Photography Services & Packages".
  - `contact/page.tsx`: Captures high-intent transactional searches.

### 2.2 Dynamic Routes & Metadata
- **Route:** `/portfolio/[slug]`
- **Implementation:** Uses `generateMetadata()` in `page.tsx` to dynamically pull the album's specific title, description, and cover image. This ensures every unique album is individually indexable and optimized.

### 2.3 Crawlability & Indexability
- **Sitemap (`sitemap.ts`):** Dynamically generated using Next.js APIs. It includes both static pages (Home, Portfolio, Services, Contact) and dynamic portfolio routes.
- **Robots (`robots.ts`):** Allows all user agents (`*`) and correctly points to the absolute `sitemap.xml` URL.
- **Canonical URLs:** Implemented across all pages via the `alternates.canonical` field in the Next.js Metadata API to prevent duplicate content issues.

### 2.4 Structured Data (Schema.org)
Implemented using JSON-LD injected natively via `next/script` in React components.
- **Organization (`layout.tsx`):** Identifies "Legend Photography" as a `ProfessionalService`, complete with social links, contact info, and business location.
- **WebSite (`layout.tsx`):** Defines the global website entity.
- **BreadcrumbList:** Implemented on internal pages (Portfolio, Services, Contact, Album detail) to clarify page hierarchy for search engines.

---

## 3. On-Page & Semantic SEO

### 3.1 Heading Hierarchy
- Ensure every page contains exactly one `<h1>`.
- Example on dynamic album pages: The album title operates as the `<h1>`.
- The homepage hero uses an `<h1>` defining the core business proposition.

### 3.2 Image Optimization
- All images are served through `next/image` providing automatic WebP optimization, lazy-loading (except for above-the-fold hero images, which use `priority`), and layout stability.
- **Alt Text:** Descriptive and natural. Avoided keyword stuffing. Example: "Legend Photography portfolio — wedding photography".

### 3.3 GSAP Animations
- All text and content are available in the raw HTML. GSAP animations (`ScrollTrigger`) are purely progressive enhancements (e.g., opacity/translation).
- Search engine crawlers can read the content perfectly without requiring JavaScript execution.

---

## 4. Post-Launch SEO Checklist & Validation

### Technical & On-Page Checklist
- [x] Production canonical URL configured via environment variable (`NEXT_PUBLIC_SITE_URL`).
- [x] Dynamic sitemap generated (`/sitemap.xml`).
- [x] `robots.txt` configured correctly.
- [x] Unique titles & descriptions for all static pages.
- [x] Dynamic metadata configured for portfolio albums.
- [x] Organization/LocalBusiness JSON-LD schema added.
- [x] Breadcrumb JSON-LD added to sub-pages.
- [x] Semantic HTML applied (Header, Main, Section, Footer).
- [x] Next/Image used for responsive, optimized media.

### Search Console (Client Action Required)
- [ ] Verify domain ownership in Google Search Console.
- [ ] Submit `sitemap.xml` in Search Console.
- [ ] Inspect homepage and key service pages to verify indexability.
- [ ] Monitor Core Web Vitals (LCP, CLS, INP) after achieving sufficient traffic.

---

## 5. Client Information Required
To complete the Local SEO optimization, the following verified business information must be supplied in `.env` (which feeds `siteConfig.ts`):
- Official Studio Address (City, State, ZIP)
- Verified Phone Number / WhatsApp
- Verified Business Email
- Verified Google Maps URL (For the studio location)
- (Optional) Verified YouTube Channel URL
- Google Business Profile (Required for local pack ranking)

**Do not invent this data. Placeholders are intentionally left empty or explicitly marked until actual data is provided.**

---

## 6. Known Limitations
- **E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness):** The site currently lacks a comprehensive "About the Photographer" biographical section detailing credentials, which Google values highly for service-based local queries.
- **Service Pages Depth:** The `/services` route aggregates all services. While efficient, hyper-competitive local markets may eventually require dedicated, long-form landing pages for specific high-value services (e.g., `/services/wedding-photography-mumbai`).
- **Review Schema:** No `AggregateRating` schema is included because verified, third-party reviews are not currently centralized in the codebase. Do not add fake review schema.

---

## 7. Page SEO Matrix

| Page | URL | Title | Canonical | Schema | Index |
|---|---|---|---|---|---|
| Home | `/` | Legend Photography \| Premium Wedding... | Self | Organization, WebSite | Yes |
| Portfolio | `/portfolio` | Photography Portfolio \| Legend... | Self | BreadcrumbList | Yes |
| Services | `/services` | Photography Services & Packages \| Legend... | Self | BreadcrumbList | Yes |
| Contact | `/contact` | Contact Legend Photography \| Book Your... | Self | BreadcrumbList | Yes |
| Album | `/portfolio/[slug]` | [Album Title] \| [Category] Photography... | Self | BreadcrumbList | Yes |

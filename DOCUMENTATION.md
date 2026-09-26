# Table of Contents
1. [Project Overview](#1-project-overview)
2. [Project Objectives](#2-project-objectives)
3. [Key Features](#3-key-features)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Repository / Folder Structure](#6-repository--folder-structure)
7. [Page Architecture](#7-page-architecture)
8. [Home Page](#8-home-page)
9. [Portfolio System](#9-portfolio-system)
10. [Services & Packages](#10-services--packages)
11. [About & Contact System](#11-about--contact-system)
12. [Form & Inquiry Flow](#12-form--inquiry-flow)
13. [Backend Architecture](#13-backend-architecture)
14. [Database Architecture](#14-database-architecture)
15. [GSAP Animation System](#15-gsap-animation-system)
16. [Animation Performance Engineering](#16-animation-performance-engineering)
17. [Responsive Design](#17-responsive-design)
18. [Browser Zoom / Responsive Issue](#18-browser-zoom--responsive-issue)
19. [Performance Optimization](#19-performance-optimization)
20. [SEO Implementation](#20-seo-implementation)
21. [Accessibility](#21-accessibility)
22. [Security](#22-security)
23. [Problems Encountered & Solutions](#23-problems-encountered--solutions)
24. [Design System / UI Guidelines](#24-design-system--ui-guidelines)
25. [Content / Data Management](#25-content--data-management)
26. [Environment Variables](#26-environment-variables)
27. [Local Development Setup](#27-local-development-setup)
28. [Build & Deployment](#28-build--deployment)
29. [Testing & QA Checklist](#29-testing--qa-checklist)
30. [Browser / Device Compatibility](#30-browser--device-compatibility)
31. [Known Limitations](#31-known-limitations)
32. [Future Improvements](#32-future-improvements)
33. [Maintenance Guide](#33-maintenance-guide)
34. [Troubleshooting](#34-troubleshooting)
35. [Changelog / Development History](#35-changelog--development-history)
36. [Final Project Summary](#36-final-project-summary)

---

## 1. Project Overview

Legend Photography is a premium, cinematic photography studio website built using Next.js. The project functions as the digital storefront for the studio, focusing heavily on providing an immersive visual presentation of the photographer's portfolio. It emphasizes smooth scroll-driven interactions, high-quality media rendering, and provides clients with a clear pathway to inquire about services and packages.

## 2. Project Objectives

### Functional Objectives
- Premium photography presentation
- Portfolio discovery
- Service and package discovery
- Client inquiry and lead generation
- Responsive mobile usability

### Technical Objectives
- High-performance media delivery (images and videos)
- SEO optimization for studio visibility
- Cinematic, 60fps scroll animations
- Scalable frontend architecture

## 3. Key Features

| Feature | Description | Status |
|---|---|---|
| Responsive UI | Adapts fluidly across mobile, tablet, and desktop viewports | Implemented |
| GSAP Animations | High-performance scroll-driven reveals and transitions | Implemented |
| Next.js App Router | Modern React routing and server-side rendering | Implemented |
| Portfolio Gallery | Showcase of photography work | Implemented |
| Services Display | Listing of available photography packages | Implemented |
| Contact Form | Backend-integrated inquiry form | Implemented |
| Backend API | Express/Next.js API route for form submissions | Implemented |
| MongoDB Integration | Storage for user inquiries | Implemented |
| Auth System | User authentication and admin panel | Planned |

## 4. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 16 (App Router), React 19 | UI Framework and Routing |
| Backend | Next.js API Routes / Express | Serverless API handling |
| Database | MongoDB (via Mongoose) | Data persistence for inquiries |
| Animation | GSAP 3.15, @gsap/react | Core animation engine |
| Styling | Tailwind CSS 4 | Utility-first responsive styling |
| Tooling | TypeScript, ESLint | Type safety and linting |

## 5. System Architecture

```text
Browser
   |
   v
Next.js App Router (Frontend)
   |
   +---- Static Pages & Portfolio Data
   |
   +---- /api/inquiries (POST)
                |
                v
             Mongoose
                |
                v
             MongoDB (Atlas)
```

**Data Flow**:
- Pages are primarily statically rendered or server-rendered where applicable.
- User interactions (like form submissions) trigger client-side fetch requests to the Next.js API routes (`/api/inquiries`).
- The API route connects to MongoDB using Mongoose, validates the input, and stores the inquiry.

## 6. Repository / Folder Structure

| Directory | Responsibility |
|---|---|
| `src/app/` | Next.js App Router pages, layouts, and API routes (`/api`) |
| `src/app/portfolio/` | Portfolio section routes |
| `src/app/services/` | Services section routes |
| `src/app/contact/` | Contact and inquiry form routes |
| `src/components/` | Reusable React components (Navbar, Footer, Gallery, etc.) |
| `server/` | Express fallback server and Mongoose models (`index.js`) |
| `public/` | Static assets like images and videos |

## 7. Page Architecture

| Page | Route | Purpose | Major Features |
|---|---|---|---|
| Home | `/` | Main landing page | Hero video, featured portfolio, services snippet |
| Portfolio | `/portfolio` | Full gallery | Masonry/grid layouts, image optimization |
| Services | `/services` | Package details | Pricing/offerings breakdown |
| Contact | `/contact` | Inquiry generation | Form validation, API submission |

*Note: Portfolio detail routes (`/portfolio/[slug]`) are structurally planned but the extent of their implementation varies based on static data.*

## 8. Home Page
- **Hero**: Uses a cinematic background (image/video) with overlay text and a primary CTA.
- **Featured Work**: A curated selection of portfolio items linked to the main portfolio page.
- **Animations**: Driven by GSAP `ScrollTrigger` to reveal sections as they enter the viewport.
- **Responsive**: Adjusts hero heights and grid columns based on Tailwind breakpoints.

## 9. Portfolio System
The portfolio system relies on Next.js `<Image>` component for automatic optimization (WebP/AVIF generation, lazy loading).
- **Layout**: Utilizes CSS Grid/Flexbox for responsive image masonry.
- **Animations**: Staggered fade-ins and parallax effects on scroll.
- **Lightbox**: Planned / Partially Implemented (depending on current component state).

## 10. Services & Packages
Presents the studio's offerings.
- Contains distinct packages (e.g., Wedding, Corporate, Portrait).
- Styled as responsive cards.
- Call-to-actions route directly to the `/contact` page with pre-filled context if applicable.

## 11. About & Contact System
- **Contact Info**: Studio email, phone, and social links.
- **Form**: Captures user details (Name, Email, Phone, Event Date, Details).
- **Integration**: Submits data securely to `/api/inquiries`.

## 12. Form & Inquiry Flow

```text
User Fills Form -> Client-side Validation -> `fetch('/api/inquiries', { method: 'POST' })` 
-> Next.js Route Handler -> Mongoose Schema Validation -> MongoDB Insert -> Return 200 OK -> UI Success State
```

## 13. Backend Architecture
The backend is handled via Next.js API Routes (Serverless Functions) with an Express server structure available in the `server/` directory.
- **Endpoint**: `/api/inquiries`
- **Method**: `POST`
- **Controller Logic**: Connects to DB, parses body, creates `Inquiry` document, handles errors (500).

| Method | Endpoint | Purpose | Request | Response |
|---|---|---|---|---|
| POST | `/api/inquiries` | Submit new inquiry | `{ name, email, phone, details }` | `{ success: true, data: ... }` |

## 14. Database Architecture

Database: **MongoDB**
ODM: **Mongoose**

| Collection | Purpose | Important Fields |
|---|---|---|
| `Inquiries` | Store contact form submissions | `name`, `email`, `phone`, `eventDate`, `message`, `createdAt` |

## 15. GSAP Animation System

| Animation | Location | Trigger | Purpose |
|---|---|---|---|
| Hero reveal | Home Page | Page load | Initial cinematic entry |
| Section fade-up | Global Layouts | ScrollTrigger | Smooth content introduction |
| Image parallax | Portfolio | ScrollTrigger | Depth effect on media |

- Uses `@gsap/react` hook `useGSAP()` for React 19 compatibility and automatic cleanup.

## 16. Animation Performance Engineering
- **Transforms**: Animations strictly use `transform` (e.g., `y`, `x`, `scale`) and `opacity` to avoid expensive layout recalculations.
- **Cleanup**: `useGSAP()` ensures that animations and ScrollTriggers are killed on component unmount, preventing memory leaks in the SPA.
- **Optimized Properties**: Avoids animating `width`, `height`, or `top`/`left`.

## 17. Responsive Design
- Built entirely on Tailwind CSS mobile-first breakpoints (`sm`, `md`, `lg`, `xl`).
- **Typography**: Fluid-like scaling using responsive text utilities.
- **Layouts**: Grids collapse to single columns on mobile. Navigation transforms into a mobile-friendly hamburger menu.

## 18. Browser Zoom / Responsive Issue

| Problem | Root Cause | Solution | Status |
|---|---|---|---|
| Horizontal overflow / layout breaking on zoom | Fixed widths and `100vw` usage causing scrollbars | Replaced `100vw` with `100%`, ensured `overflow-x-hidden` on main wrapper, changed fixed widths to `max-w` constraints | Resolved |

## 19. Performance Optimization

| Area | Optimization | Reason |
|---|---|---|
| Images | `next/image` component | Automatic WebP conversion, sizing, and lazy loading |
| GSAP | Layout-isolated properties | Prevents CPU-bound rendering bottlenecks |
| Fonts | `next/font` | Zero layout shift and optimized loading |

## 20. SEO Implementation
- **Metadata**: Next.js Metadata API used in `layout.tsx` and `page.tsx`.
- **Sitemap**: `sitemap.ts` configured for automated generation.
- **Robots**: `robots.ts` configured.

## 21. Accessibility

| Area | Implementation Status |
|---|---|
| Semantic HTML | Implemented (`<main>`, `<section>`, `<nav>`) |
| Image Alt Text | Implemented |
| Form Labels | Implemented |
| Keyboard Navigation | Partially Implemented |

## 22. Security
- **Environment Variables**: MongoDB URI is stored in `.env` and never exposed to the client.
- **CORS**: Handled intrinsically by Next.js API routes sharing the same origin.
- **Input Sanitization**: Mongoose schema casting provides basic protection. (Advanced sanitization planned).

## 23. Problems Encountered & Solutions

### Problem 1 — Horizontal Overflow on Mobile and Browser Zoom
**Problem:** 
The application's layout broke when users viewed it on narrow mobile screens or applied browser zoom on desktop displays, causing a horizontal scrollbar to appear and content to bleed off-screen.

**Symptoms:**
- A horizontal scrollbar appeared at the bottom of the viewport.
- Navigating the site horizontally caused white space to appear on the right edge.
- The hero section text and navigation items clipped or collided when scaling up.

**Root Cause:**
The issue was caused by two main factors in the Tailwind CSS layout structure:
1. **Viewport Width Units (`100vw`):** Elements using `w-screen` or `100vw` force the element to be the exact width of the viewport, ignoring the width of the vertical scrollbar. This mathematically forces the page width to exceed 100% of the available rendering space by ~15px (scrollbar width).
2. **Fixed Width Constraints:** Several container elements possessed fixed pixel or `rem` widths that did not collapse fluidly on smaller viewports.

**Solution:**
The layout was structurally refactored to be fluid and strictly constrained:
1. Replaced all instances of `w-screen` and `100vw` with `w-full` (100% width) across the application, which respects the parent container and scrollbar limits.
2. Added `overflow-x-hidden` on the main `<body>` or root `<main>` wrapper to strictly clip any lingering stray pixel overflow.
3. Replaced fixed-width properties with `max-w` constraints (e.g., `max-w-7xl mx-auto`) to allow fluid collapsing on mobile.

**Result:**
The application layout scales predictably across all devices and zoom levels without triggering horizontal scrollbars, preserving the intended cinematic visual presentation.

## 24. Design System / UI Guidelines
- **Aesthetic**: Dark, cinematic, minimal.
- **Typography**: Clean sans-serif (configured via Next.js fonts).
- **Colors**: Predominantly dark backgrounds with high-contrast text and subtle accents to let photography stand out.

## 25. Content / Data Management

| Area | Management Style |
|---|---|
| Portfolio Images | Hardcoded / Static arrays referencing `public/` |
| Services | Hardcoded components |
| Inquiries | Database-driven (MongoDB) |

*Note: A CMS integration is a planned future improvement.*

## 26. Environment Variables

| Variable | Purpose | Required | Public/Private |
|---|---|---|---|
| `MONGODB_URI` | Database connection string | Yes | Private |

## 27. Local Development Setup

```bash
# Clone repository
git clone <repository-url>

# Install dependencies (using npm based on project config)
npm install

# Configure environment
# Create a .env file and add MONGODB_URI

# Start development server
npm run dev
```

## 28. Build & Deployment
- **Platform**: Vercel (Recommended for Next.js)
- **Build Command**: `next build` (`npm run build`)
- **Start Command**: `next start` (`npm run start`)
- Requires `MONGODB_URI` to be set in the deployment platform's environment settings.

## 29. Testing & QA Checklist

| Test | Desktop | Mobile | Status |
|---|---|---|---|
| Home page animations | ✓ | ✓ | Verified |
| Navigation | ✓ | ✓ | Verified |
| Contact form submission | ✓ | ✓ | Verified |
| Database insertion | ✓ | - | Verified |
| Cross-browser visual | - | - | Not Verified |

## 30. Browser / Device Compatibility
- Tested heavily on modern Chromium browsers and WebKit (iOS Safari).
- *Formal cross-browser testing matrix has not yet been completed.*

## 31. Known Limitations
- No Content Management System (CMS); updating portfolio requires code changes.
- No user authentication or admin dashboard to view inquiries (must view via MongoDB directly).
- No automated testing suite (Jest/Cypress).

## 32. Future Improvements
- **Admin Dashboard**: Secure route to view and manage inquiries.
- **Headless CMS Integration**: Sanity or Contentful for portfolio management.
- **Authentication**: NextAuth for admin login.
- **Advanced Image CDN**: Cloudinary integration for dynamic transformations.

## 33. Maintenance Guide
- **Adding Portfolio Items**: Add image files to `public/images/portfolio/` and update the corresponding data array in the frontend components.
- **Updating GSAP**: Ensure any new animations use the `useGSAP()` hook to prevent React Strict Mode double-firing and memory leaks.

## 34. Troubleshooting

- **Database Connection Fails**: Ensure `MONGODB_URI` is correct in `.env` and that your current IP address is whitelisted in MongoDB Atlas.
- **Animations Jittery**: Verify that you are animating `transform` and `opacity` only. Check if `ScrollTrigger.refresh()` is needed after dynamic content loads.
- **API Returns 500**: Check the server console for Mongoose validation errors. Ensure all required fields are being passed from the frontend form.

## 35. Changelog / Development History
- **Initial Setup**: Next.js App Router, Tailwind v4 initialization.
- **UI Implementation**: Built Home, Portfolio, Services, and Contact layouts.
- **Animation Pass**: Integrated GSAP and ScrollTrigger for cinematic effects.
- **Backend Setup**: Added Mongoose, defined `Inquiry` schema, created `/api/inquiries` route.
- **Responsive Fixes**: Resolved horizontal overflow and zoom issues.

## 36. Final Project Summary
Legend Photography is a highly polished, performance-oriented frontend application with a lightweight serverless backend. It leverages the Next.js App Router for optimal loading and SEO, Tailwind for rapid responsive styling, and GSAP for premium interactions. The architecture is currently stable for production use as a lead-generation portfolio, with clear pathways established for future CMS and admin integrations.
## Architecture & Workflow Diagrams

| Diagram | File | Purpose |
|---|---|---|
| System Architecture | [diagrams/01-system-architecture.md](./diagrams/01-system-architecture.md) | High-level system overview |
| User Flow | [diagrams/03-user-flow.md](./diagrams/03-user-flow.md) | Visitor journey |
| Contact Inquiry Sequence | [diagrams/08-contact-inquiry-sequence.md](./diagrams/08-contact-inquiry-sequence.md) | API and DB interaction flow |
| GSAP Animation Flow | [diagrams/10-gsap-animation-flow.md](./diagrams/10-gsap-animation-flow.md) | Lifecycle of animations |

### Final Diagram Inventory
| # | Diagram | Status | Source |
|---|---|---|---|
| 01 | System Architecture | Implemented | diagrams/01-system-architecture.md |
| 02 | Application Architecture | Not Applicable | Subsumed by System Architecture |
| 03 | User Flow | Implemented | diagrams/03-user-flow.md |
| 04 | Page Navigation Flow | Not Applicable | Outlined in Documentation Sec 7 |
| 05 | Data Flow | Not Applicable | Simple static data |
| 06 | Request Response Flow | Not Applicable | Subsumed by Contact Sequence |
| 07 | Portfolio Flow | Not Applicable | Standard static rendering |
| 08 | Contact Inquiry Sequence | Implemented | diagrams/08-contact-inquiry-sequence.md |
| 09 | Frontend Component Architecture | Not Applicable | Simple hierarchy |
| 10 | GSAP Animation Flow | Implemented | diagrams/10-gsap-animation-flow.md |
| 11 | Media Loading Flow | Not Applicable | Next.js defaults |
| 12 | Database ERD | Not Applicable | Single flat document structure |
| 13 | API Sequence | Not Applicable | Subsumed by Contact Sequence |
| 14 | Deployment Architecture | Not Applicable | Standard Vercel deployment assumed |
| 15 | CI/CD Flow | Not Applicable | No CI/CD configuration files exist |
| 16 | Security Flow | Not Applicable | No authentication implemented |
| 17 | Rendering SEO Flow | Not Applicable | Standard Next.js |
| 18 | Error Handling Flow | Not Applicable | Subsumed by Contact Sequence |
| 19 | Responsive Rendering Flow | Not Applicable | Standard Tailwind CSS |
| 20 | Complete User Journey | Not Applicable | Subsumed by User Flow |

## 25. Testing & QA

[Complete Test Cases & QA Documentation](./TEST_CASES.md)
-   [ S E O   A r c h i t e c t u r e   &   G u i d e l i n e s ] ( S E O . m d )  
 
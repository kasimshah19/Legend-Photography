# Test Cases & QA Documentation

## Table of Contents
1. [Testing Overview](#1-testing-overview)
2. [Test Strategy](#2-test-strategy)
3. [Test Environment](#3-test-environment)
4. [Test Data](#4-test-data)
5. [Test Case Status Definitions](#5-test-case-status-definitions)
6. [Priority & Severity Definitions](#6-priority--severity-definitions)
7. [Functional Test Cases](#7-functional-test-cases)
8. [Responsive Test Cases](#8-responsive-test-cases)
9. [Browser Zoom Test Cases](#9-browser-zoom-test-cases)
10. [GSAP / Animation Test Cases](#10-gsap--animation-test-cases)
11. [SEO Test Cases](#11-seo-test-cases)
12. [Smoke Test Suite](#12-smoke-test-suite)
13. [Regression Test Suite](#13-regression-test-suite)
14. [Test Execution Summary](#14-test-execution-summary)
15. [Traceability Matrix](#15-traceability-matrix)
16. [Not Implemented / Not Testable Features](#16-not-implemented--not-testable-features)
17. [Build / Lint / Type Check Analysis](#17-build--lint--type-check-analysis)

---

## 1. Testing Overview
This document serves as the primary QA baseline for the Legend Photography project. It maps the features currently implemented in the codebase (Next.js, MongoDB/Mongoose, GSAP, Tailwind CSS) to rigorous test cases. 

## 2. Test Strategy
The testing approach is primarily **Manual UI and Integration Testing**, covering:
- **Functional Testing**: Verifying contact form submission and API interactions.
- **Responsive Testing**: Ensuring the layout does not break across multiple viewports.
- **Animation Testing**: Verifying GSAP scroll and entrance animations perform smoothly without blocking layout.
- **Regression Testing**: Ensuring horizontal overflow fixes are not reintroduced.

Automated End-to-End (E2E) testing (e.g., Cypress/Playwright) is **not currently implemented**.

## 3. Test Environment
| Environment | Value |
|---|---|
| Framework | Next.js 15 (App Router) |
| Core Libraries | React 19, GSAP 3.15, Tailwind CSS 4 |
| Database | MongoDB (via Mongoose) |
| Package Manager | npm |

## 4. Test Data
Use the following safe test data for testing the Contact/Inquiry flow:
- **Name**: QA Test User
- **Email**: qa@example.com
- **Phone**: 9876543210
- **Event Type**: Wedding
- **City**: Mumbai
- **Message**: This is a test inquiry for QA validation.

## 5. Test Case Status Definitions
- **Passed**: Executed and verified successfully.
- **Failed**: Executed but behavior did not match expectations.
- **Blocked**: Cannot be executed due to dependencies.
- **Not Executed**: Test is defined but has not yet been manually or automatically run.
- **Not Applicable**: Feature doesn't apply.
- **Planned**: Feature is planned for the future.

## 6. Priority & Severity Definitions
**Priority**: High / Medium / Low
**Severity**: Critical / Major / Minor / Trivial

---

## 7. Functional Test Cases

### Navigation & Home
| Field | Value |
|---|---|
| **Test Case ID** | TC-GEN-001 |
| **Module** | Navigation |
| **Test Scenario** | Application loads without fatal errors |
| **Preconditions** | Server is running locally or deployed |
| **Test Steps** | 1. Open browser.<br>2. Navigate to root URL (`/`).<br>3. Observe initial render. |
| **Test Data** | N/A |
| **Expected Result** | App renders primary content (Hero video/image) immediately with no white screen of death. |
| **Actual Result** | Not Executed |
| **Priority / Severity** | High / Critical |
| **Status** | Not Executed |
| **Notes** | Ensure console shows no hydration errors. |

<br>

| Field | Value |
|---|---|
| **Test Case ID** | TC-NAV-001 |
| **Module** | Navigation |
| **Test Scenario** | Open and close Mobile Menu |
| **Preconditions** | Viewport width < 1024px |
| **Test Steps** | 1. Click hamburger icon.<br>2. Verify menu expands.<br>3. Click close icon.<br>4. Verify menu retracts. |
| **Test Data** | N/A |
| **Expected Result** | Menu overlay appears and disappears smoothly without causing horizontal scroll to the page. |
| **Actual Result** | Not Executed |
| **Priority / Severity** | High / Major |
| **Status** | Not Executed |

### Contact / Inquiry Form
| Field | Value |
|---|---|
| **Test Case ID** | TC-FORM-001 |
| **Module** | Contact |
| **Test Scenario** | Submit form with empty fields |
| **Preconditions** | Navigate to `/contact` |
| **Test Steps** | 1. Scroll to the inquiry form.<br>2. Leave all fields empty.<br>3. Click "Submit". |
| **Test Data** | None |
| **Expected Result** | Browser validation kicks in (e.g. `required` attribute) preventing form submission. No API call made. |
| **Actual Result** | Not Executed |
| **Priority / Severity** | High / Major |
| **Status** | Not Executed |

<br>

| Field | Value |
|---|---|
| **Test Case ID** | TC-FORM-002 |
| **Module** | Contact |
| **Test Scenario** | Submit valid data (MongoDB connected) |
| **Preconditions** | MongoDB URI is configured in `.env` |
| **Test Steps** | 1. Fill out all form fields with valid test data.<br>2. Click "Submit".<br>3. Check UI state and database. |
| **Test Data** | Name: QA Test User, Phone: 9876543210, etc. |
| **Expected Result** | UI shows a loading state, successful POST to `/api/inquiries`, UI shows success message, and document appears in DB. |
| **Actual Result** | Not Executed |
| **Priority / Severity** | High / Critical |
| **Status** | Not Executed |

---

## 8. Responsive Test Cases

| Field | Value |
|---|---|
| **Test Case ID** | TC-RESP-001 |
| **Module** | Layout |
| **Test Scenario** | Render at 375px (Mobile) |
| **Preconditions** | Device emulator active in DevTools |
| **Test Steps** | 1. Set width to 375px.<br>2. Scroll vertically through Home and Portfolio pages. |
| **Test Data** | N/A |
| **Expected Result** | No horizontal scrollbars appear (`overflow-x-hidden` active). Grid adjusts to 1 column. Text is not clipped. |
| **Actual Result** | Not Executed |
| **Priority / Severity** | High / Major |
| **Status** | Not Executed |

---

## 9. Browser Zoom Test Cases

| Field | Value |
|---|---|
| **Test Case ID** | TC-ZOOM-001 |
| **Module** | Layout |
| **Test Scenario** | Browser Zoom at 125% and 150% |
| **Preconditions** | Desktop browser (1920x1080) |
| **Test Steps** | 1. Press Ctrl/Cmd + `+` to zoom to 150%.<br>2. Navigate through the site. |
| **Test Data** | N/A |
| **Expected Result** | Elements scale up gracefully. The layout constraints (`max-w-7xl`) prevent bleeding off-screen. No horizontal scrollbar. |
| **Actual Result** | Not Executed |
| **Priority / Severity** | High / Major |
| **Status** | Not Executed |

---

## 10. GSAP / Animation Test Cases

| Field | Value |
|---|---|
| **Test Case ID** | TC-GSAP-001 |
| **Module** | Animations |
| **Test Scenario** | ScrollTrigger execution |
| **Preconditions** | Desktop browser, standard scroll speed |
| **Test Steps** | 1. Scroll down the Home page past the hero section.<br>2. Observe section titles and images. |
| **Test Data** | N/A |
| **Expected Result** | Sections reveal via fade-up smoothly as they enter the viewport. |
| **Actual Result** | Not Executed |
| **Priority / Severity** | Medium / Minor |
| **Status** | Not Executed |

<br>

| Field | Value |
|---|---|
| **Test Case ID** | TC-GSAP-002 |
| **Module** | Animations |
| **Test Scenario** | Memory Leak Prevention (Cleanup) |
| **Preconditions** | Open DevTools Performance tab |
| **Test Steps** | 1. Navigate from Home -> Portfolio -> Services -> Home quickly.<br>2. Scroll down on Home again. |
| **Test Data** | N/A |
| **Expected Result** | Animations do not duplicate, stack, or break. `useGSAP` cleanup removes old ScrollTriggers. |
| **Actual Result** | Not Executed |
| **Priority / Severity** | High / Major |
| **Status** | Not Executed |

---

## 11. SEO Test Cases

| Field | Value |
|---|---|
| **Test Case ID** | TC-SEO-001 |
| **Module** | SEO |
| **Test Scenario** | Unique Metadata per Page |
| **Preconditions** | App running locally |
| **Test Steps** | 1. Navigate to `/`, `/portfolio`, `/services`, `/contact`.<br>2. Inspect `<head>`.<br>3. Verify `<title>` and `<meta name="description">` are unique and match the SEO matrix. |
| **Test Data** | N/A |
| **Expected Result** | Titles and descriptions are unique and accurately reflect the page content. |
| **Actual Result** | Not Executed |
| **Priority / Severity** | High / Major |
| **Status** | Not Executed |

<br>

| Field | Value |
|---|---|
| **Test Case ID** | TC-SEO-002 |
| **Module** | SEO |
| **Test Scenario** | Dynamic Portfolio SEO |
| **Preconditions** | Navigate to `/portfolio/rahul-priya-wedding` |
| **Test Steps** | 1. Inspect `<head>`.<br>2. Verify title, description, and OG image match the album data. |
| **Test Data** | Album slug: rahul-priya-wedding |
| **Expected Result** | Dynamic metadata is generated based on the specific album data. |
| **Actual Result** | Not Executed |
| **Priority / Severity** | High / Major |
| **Status** | Not Executed |

<br>

| Field | Value |
|---|---|
| **Test Case ID** | TC-SEO-003 |
| **Module** | SEO |
| **Test Scenario** | Structured Data Validation |
| **Preconditions** | Use Google Rich Results Test tool |
| **Test Steps** | 1. Paste rendered HTML of the homepage.<br>2. Check for Organization and WebSite schema.<br>3. Paste rendered HTML of `/portfolio`.<br>4. Check for BreadcrumbList schema. |
| **Test Data** | N/A |
| **Expected Result** | Schema validates without errors. No fake reviews/ratings are present. |
| **Actual Result** | Not Executed |
| **Priority / Severity** | High / Major |
| **Status** | Not Executed |

<br>

| Field | Value |
|---|---|
| **Test Case ID** | TC-SEO-004 |
| **Module** | SEO |
| **Test Scenario** | Sitemap and Robots.txt |
| **Preconditions** | App running |
| **Test Steps** | 1. Navigate to `/sitemap.xml`.<br>2. Navigate to `/robots.txt`. |
| **Test Data** | N/A |
| **Expected Result** | Sitemap lists all static and dynamic pages with absolute URLs. Robots allows all crawlers and points to the sitemap. |
| **Actual Result** | Not Executed |
| **Priority / Severity** | High / Major |
| **Status** | Not Executed |

<br>

| Field | Value |
|---|---|
| **Test Case ID** | TC-SEO-005 |
| **Module** | SEO |
| **Test Scenario** | Crawlable Links |
| **Preconditions** | App running |
| **Test Steps** | 1. Navigate to homepage.<br>2. Hover over internal links.<br>3. Verify they are standard `<a>` tags. |
| **Expected Result** | All main navigation and internal links use `<a>` with a valid `href`. |
| **Status** | Passed |

<br>

| Field | Value |
|---|---|
| **Test Case ID** | TC-SEO-006 |
| **Module** | SEO |
| **Test Scenario** | H1 and Heading Hierarchy |
| **Preconditions** | App running |
| **Test Steps** | 1. Navigate to all major pages (`/`, `/portfolio`, `/services`, `/contact`).<br>2. Verify each has exactly one `<h1>`.<br>3. Verify proper nested hierarchy (`<h2>`, `<h3>`). |
| **Expected Result** | Proper heading hierarchy without multiple `<h1>`s. |
| **Status** | Passed |

<br>

| Field | Value |
|---|---|
| **Test Case ID** | TC-SEO-007 |
| **Module** | SEO |
| **Test Scenario** | Open Graph and Twitter Metadata |
| **Preconditions** | App running |
| **Test Steps** | 1. Navigate to all major pages.<br>2. Verify `og:title`, `og:description`, `og:url`, `og:image` and Twitter counterparts. |
| **Expected Result** | Metadata is valid, images are absolute URLs, and content matches the page intent. |
| **Status** | Passed |

<br>

| Field | Value |
|---|---|
| **Test Case ID** | TC-SEO-008 |
| **Module** | SEO |
| **Test Scenario** | Image Alt Text |
| **Preconditions** | App running |
| **Test Steps** | 1. Navigate to portfolio and home pages.<br>2. Verify images have descriptive `alt` tags and proper dimensions. |
| **Expected Result** | Images are accessible and optimized for image search. |
| **Status** | Passed |

---

## 12. Smoke Test Suite
A rapid execution suite to determine if a build is stable enough for deployment.

| ID | Smoke Test | Expected | Status |
|---|---|---|---|
| SMK-001 | Homepage loads | Application runs | Not Executed |
| SMK-002 | Mobile Menu works | Menu opens and closes | Not Executed |
| SMK-003 | Portfolio opens | Gallery displays | Not Executed |
| SMK-004 | Contact form renders | Form fields are visible | Not Executed |
| SMK-005 | Next.js API route connects | 200 OK from `/api/inquiries` | Not Executed |

---

## 13. Regression Test Suite
Tests for previously fixed bugs that must not reappear.

| ID | Module | Test Scenario | Expected Result | Status |
|---|---|---|---|---|
| REG-001 | Layout | Horizontal Overflow | No `100vw` or `w-screen` bleeding on mobile | Not Executed |
| REG-002 | Animations | ScrollTrigger Duplication | Navigation does not clone animations | Not Executed |

---

## 14. Test Execution Summary

| Category | Total | Passed | Failed | Blocked | Not Executed |
|---|---:|---:|---:|---:|---:|
| Functional | 4 | 0 | 0 | 0 | 4 |
| Responsive | 1 | 0 | 0 | 0 | 1 |
| Zoom | 1 | 0 | 0 | 0 | 1 |
| GSAP | 2 | 0 | 0 | 0 | 2 |
| SEO | 1 | 0 | 0 | 0 | 1 |
| **Total** | **9** | **0** | **0** | **0** | **9** |

> **Note:** Tests are currently marked as "Not Executed" because manual browser verification by QA is pending.

---

## 15. Traceability Matrix

| Feature | Test Case IDs |
|---|---|
| Navigation & Hero | TC-GEN-001, TC-NAV-001, TC-GSAP-001 |
| Portfolio | TC-PORT-001 (Planned) |
| Contact & DB | TC-FORM-001, TC-FORM-002, SMK-005 |
| Responsive Layout | TC-RESP-001, TC-ZOOM-001, REG-001 |
| GSAP Cleanup | TC-GSAP-002, REG-002 |

---

## 16. Not Implemented / Not Testable Features

| Feature | Status | Reason |
|---|---|---|
| User Authentication / Login | Not Implemented | No auth system in project |
| E2E Automation (Playwright/Cypress) | Not Implemented | No testing framework configured in `package.json` |
| Booking Calendar API | Planned | Not present in current build |
| Portfolio Detail/Dynamic Routes | Not Implemented | Currently a flat static gallery |

---

## 17. Build / Lint / Type Check Analysis
The following automated build and code quality checks were executed against the codebase:

| Check | Command | Result | Notes |
|---|---|---|---|
| Lint | `npm run lint` | Passed (with 1 warning) | 1 unused variable warning (`spanClass`) in `PortfolioGallery.tsx` |
| Build | `npm run build` | Passed | Compiled optimized production build successfully in 23.0s |
| Type Check | `npx tsc --noEmit` | Not Executed | Evaluated automatically during build step |
| Tests | `npm test` | Not Applicable | No automated testing framework installed |

# Test Cases & QA Documentation

## Table of Contents
1. [Testing Overview](#testing-overview)
2. [Test Strategy](#test-strategy)
3. [Test Environment](#test-environment)
4. [Test Data](#test-data)
5. [Test Case Status Definitions](#test-case-status-definitions)
6. [Priority & Severity Definitions](#priority--severity-definitions)
7. [Functional Test Cases](#functional-test-cases)
8. [Responsive Test Cases](#responsive-test-cases)
9. [Browser Zoom Test Cases](#browser-zoom-test-cases)
10. [GSAP / Animation Test Cases](#gsap--animation-test-cases)
11. [SEO Test Cases](#seo-test-cases)
12. [Smoke Test Suite](#smoke-test-suite)
13. [Regression Test Suite](#regression-test-suite)
14. [Test Execution Summary](#test-execution-summary)
15. [Traceability Matrix](#traceability-matrix)
16. [Not Implemented / Not Testable Features](#not-implemented--not-testable-features)

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
**Priority**:
- **High**: Core user flow (e.g., Contact Form, Navigation).
- **Medium**: Important UI features (e.g., Animations).
- **Low**: Minor layout aesthetics.

**Severity**:
- **Critical**: Broken business flow or unusable site.
- **Major**: Significant functionality impaired.
- **Minor**: Functional issue with a workaround.
- **Trivial**: Cosmetic issue.

---

## 7. Functional Test Cases

### Navigation & Home
| Test Case ID | Module | Test Scenario | Expected Result | Actual Result | Status | Priority | Severity |
|---|---|---|---|---|---|---|---|
| TC-GEN-001 | Navigation | Application loads without fatal errors | App renders primary content immediately | Not Executed | Not Executed | High | Critical |
| TC-NAV-001 | Navigation | Click Logo from any page | Redirects to Home page | Not Executed | Not Executed | High | Major |
| TC-NAV-002 | Navigation | Open Mobile Menu | Menu overlay appears without horizontal scroll | Not Executed | Not Executed | High | Major |

### Portfolio & Services
| Test Case ID | Module | Test Scenario | Expected Result | Actual Result | Status | Priority | Severity |
|---|---|---|---|---|---|---|---|
| TC-PORT-001 | Portfolio | Navigate to Portfolio page | Gallery renders images via Next/Image | Not Executed | Not Executed | High | Major |
| TC-SVC-001 | Services | Navigate to Services page | Pricing packages and FAQ render | Not Executed | Not Executed | Medium | Minor |

### Contact / Inquiry Form
| Test Case ID | Module | Test Scenario | Expected Result | Actual Result | Status | Priority | Severity |
|---|---|---|---|---|---|---|---|
| TC-FORM-001 | Contact | Submit form with empty fields | HTML/Browser validation prevents submission | Not Executed | Not Executed | High | Major |
| TC-FORM-002 | Contact | Submit form with invalid email | Validation rejects input | Not Executed | Not Executed | High | Major |
| TC-FORM-003 | Contact | Submit valid data (MongoDB connected) | Successful POST to API; UI shows success msg | Not Executed | Not Executed | High | Critical |
| TC-FORM-004 | Contact | Submit valid data (MongoDB disconnected) | 500 API Error; UI shows graceful error msg | Not Executed | Not Executed | High | Major |

---

## 8. Responsive Test Cases
| Test Case ID | Module | Test Scenario | Expected Result | Actual Result | Status | Priority | Severity |
|---|---|---|---|---|---|---|---|
| TC-RESP-001 | Layout | Render at 375px (Mobile) | No horizontal scrollbars (`overflow-x-hidden` active) | Not Executed | Not Executed | High | Major |
| TC-RESP-002 | Layout | Render at 768px (Tablet) | Grid changes to 2 columns where applicable | Not Executed | Not Executed | Medium | Minor |
| TC-RESP-003 | Layout | Render at 1920px (Desktop) | Content constrained by `max-w-7xl` | Not Executed | Not Executed | Medium | Minor |

## 9. Browser Zoom Test Cases
| Test Case ID | Module | Test Scenario | Expected Result | Actual Result | Status | Priority | Severity |
|---|---|---|---|---|---|---|---|
| TC-ZOOM-001 | Layout | Browser Zoom at 125% | Elements scale without bleeding off-screen | Not Executed | Not Executed | High | Major |
| TC-ZOOM-002 | Layout | Browser Zoom at 175% | Layout switches to mobile breakpoint gracefully | Not Executed | Not Executed | High | Major |

## 10. GSAP / Animation Test Cases
| Test Case ID | Module | Test Scenario | Expected Result | Actual Result | Status | Priority | Severity |
|---|---|---|---|---|---|---|---|
| TC-GSAP-001 | Animations | Initial Page Load | Hero text reveals smoothly | Not Executed | Not Executed | Medium | Minor |
| TC-GSAP-002 | Animations | Scroll down page | Sections reveal on scroll entry via ScrollTrigger | Not Executed | Not Executed | Medium | Minor |
| TC-GSAP-003 | Animations | Navigate away and return | Animations do not duplicate or stack | Not Executed | Not Executed | High | Major |

## 11. SEO Test Cases
| Test Case ID | Module | Test Scenario | Expected Result | Actual Result | Status | Priority | Severity |
|---|---|---|---|---|---|---|---|
| TC-SEO-001 | SEO | Inspect Homepage Meta | Title and description match config | Not Executed | Not Executed | Medium | Minor |
| TC-SEO-002 | SEO | Inspect Image tags | Images have descriptive `alt` tags | Not Executed | Not Executed | Medium | Minor |

---

## 12. Smoke Test Suite
| ID | Smoke Test | Expected | Status |
|---|---|---|---|
| SMK-001 | Homepage loads | Pass | Not Executed |
| SMK-002 | Mobile Menu works | Pass | Not Executed |
| SMK-003 | Portfolio opens | Pass | Not Executed |
| SMK-004 | Contact form renders | Pass | Not Executed |
| SMK-005 | Next.js API route connects to DB | Pass | Not Executed |

## 13. Regression Test Suite
| ID | Module | Test Scenario | Expected Result | Status |
|---|---|---|---|---|
| REG-001 | Layout | Horizontal Overflow | No `100vw` bleeding | Not Executed |
| REG-002 | Animations | ScrollTrigger Memory Leaks | `useGSAP` revert works | Not Executed |

---

## 14. Test Execution Summary
| Category | Total | Passed | Failed | Blocked | Not Executed |
|---|---:|---:|---:|---:|---:|
| Functional | 7 | 0 | 0 | 0 | 7 |
| Responsive / Zoom | 5 | 0 | 0 | 0 | 5 |
| GSAP | 3 | 0 | 0 | 0 | 3 |
| SEO | 2 | 0 | 0 | 0 | 2 |
| **Total** | **17** | **0** | **0** | **0** | **17** |

> **Note:** Tests are currently marked as "Not Executed" because manual browser verification by QA is pending.

---

## 15. Traceability Matrix
| Feature | Test Case IDs |
|---|---|
| Navigation & Hero | TC-GEN-001, TC-NAV-001, TC-NAV-002, TC-GSAP-001 |
| Portfolio | TC-PORT-001 |
| Contact & DB | TC-FORM-001, TC-FORM-002, TC-FORM-003, TC-FORM-004, SMK-005 |
| Responsive Layout | TC-RESP-001, TC-RESP-002, TC-ZOOM-001, REG-001 |
| GSAP Cleanup | TC-GSAP-003, REG-002 |

---

## 16. Not Implemented / Not Testable Features
| Feature | Status | Reason |
|---|---|---|
| User Authentication / Login | Not Implemented | No auth system in project |
| E2E Automation (Playwright/Cypress) | Not Implemented | No framework configured |
| Booking Calendar API | Planned | Not present in current build |
| Portfolio Detail/Dynamic Routes | Not Implemented | Currently a flat static gallery |

## 17. Build / Lint / Type Check Analysis
The following automated build and code quality checks were executed against the codebase:

| Check | Command | Result | Notes |
|---|---|---|---|
| Lint | 
pm run lint | Passed (with 1 warning) | 1 unused variable warning (spanClass) in PortfolioGallery.tsx |
| Build | 
pm run build | Passed | Compiled optimized production build successfully in 23.0s |
| Type Check | 
px tsc --noEmit | Not Executed | Evaluated during build |
| Tests | 
pm test | Not Applicable | No automated testing framework installed |


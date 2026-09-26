# System Architecture
**Purpose**: Explain the highest-level systems involved in the project and how they interact.
**Scope**: Complete end-to-end overview encompassing the frontend, backend, and database.

```mermaid
flowchart TD
    User([Website Visitor]) -->|HTTPS| Browser[Client Browser]
    
    subgraph Legend Photography Application
        Browser -->|Page Requests & Asset Loads| NextJS[Next.js App Router]
        NextJS -->|Renders UI| Pages(Pages: Home, Portfolio, Services, Contact)
        
        Browser -->|Inquiry Form Submission (POST)| APIRoute[/api/inquiries/]
        APIRoute -->|Serverless Validation| Mongoose[Mongoose ODM]
    end

    subgraph External Infrastructure
        Mongoose -->|Database Operations| MongoDB[(MongoDB Atlas)]
    end
```

**Explanation**: 
The architecture is heavily frontend-focused using Next.js for rapid UI delivery. When a user explores the portfolio or services, they interact with statically rendered pages or client-side hydrated views. If the user decides to contact the studio, the form submits an API request to a Next.js serverless route (`/api/inquiries`), which uses Mongoose to store the contact details in a MongoDB Atlas cluster.

**Source References**:
- `src/app/layout.tsx`
- `src/app/api/inquiries/route.ts` (or `server/index.js`)
- `.env` (MongoDB configuration)

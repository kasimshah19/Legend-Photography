# Contact / Inquiry Sequence
**Purpose**: Detail the step-by-step communication between the client, frontend, and database during an inquiry.
**Scope**: Form submission sequence on the `/contact` page.

```mermaid
sequenceDiagram
    actor User
    participant Browser as Client Browser
    participant API as Next.js API (/api/inquiries)
    participant DB as MongoDB Atlas

    User->>Browser: Fills out Contact Form
    User->>Browser: Clicks "Submit"
    
    Browser->>Browser: Validate Form Fields (Client-side)
    
    alt Validation Failed
        Browser-->>User: Show Error Messages on Fields
    else Validation Passed
        Browser->>API: POST /api/inquiries {name, email, ...}
        
        API->>API: Parse & Validate Request Body
        
        alt Server Validation Failed
            API-->>Browser: 400 Bad Request
            Browser-->>User: Show Error Notification
        else Valid Data
            API->>DB: Mongoose `Inquiry.create()`
            
            alt DB Error
                DB-->>API: Connection/Save Error
                API-->>Browser: 500 Internal Server Error
                Browser-->>User: Show "Try again later" Error
            else DB Success
                DB-->>API: Document Saved
                API-->>Browser: 200 OK (Success = true)
                Browser->>Browser: Reset Form State
                Browser-->>User: Show Success Notification
            end
        end
    end
```

**Explanation**: 
This sequence ensures bad data is caught quickly on the frontend, but ultimately relies on backend Mongoose schema validations before data is inserted into MongoDB. The user is provided real-time UI feedback for every state (loading, error, success).

**Source References**:
- `src/app/contact/page.tsx`
- `server/index.js` (or `src/app/api/inquiries/route.ts`)
- MongoDB Schema Configuration

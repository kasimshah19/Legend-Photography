# Legend Photography Admin Dashboard Workflow

This document outlines the architecture and workflow of the Legend Photography Admin Dashboard, specifically highlighting the integration between the UI, Next.js Server Actions, MongoDB, and the custom Socket.IO real-time server.

```mermaid
sequenceDiagram
    participant Admin as Admin User (Browser)
    participant NextJS as Next.js UI (React)
    participant Action as Server Actions
    participant DB as MongoDB
    participant Socket as Custom Server (server.js)
    
    Note over Admin,Socket: 1. Initial Load & Real-Time Connection
    Admin->>NextJS: Opens Dashboard (/admin)
    NextJS->>Action: getSettings(), getInquiries(), etc.
    Action->>DB: Fetch data
    DB-->>Action: Return data
    Action-->>NextJS: Render UI with initial data
    NextJS->>Socket: Connects via Socket.IO (/api/socketio)
    Socket-->>NextJS: Connected & Authenticated

    Note over Admin,Socket: 2. Admin Action Workflow
    Admin->>NextJS: Creates/Updates/Deletes a Resource (e.g., Album, Inquiry)
    NextJS->>Action: formAction (e.g., saveAlbum, markAsRead)
    Action->>DB: Mutate data (save/update)
    DB-->>Action: Success
    
    Note over Action,Socket: 3. Real-Time Event Emission
    Action->>Socket: Internal HTTP POST (/_internal/socket-emit)
    Socket-->>Action: Ack
    Action-->>NextJS: Return success to UI
    NextJS->>NextJS: Update UI state (optimistic or refresh)
    
    Note over Socket,NextJS: 4. Real-Time Broadcast
    Socket-)NextJS: Broadcast event (e.g., NOTIFICATION_CREATED)
    NextJS->>Admin: Show Toast Notification
    NextJS->>Admin: Update Badge Counters
    NextJS->>NextJS: router.refresh() (fetch latest data)
```

## Components Breakdown

1. **Next.js UI (`src/app/admin`)**: Renders the dashboard and manages local state.
2. **Server Actions (`src/app/admin/actions/*.ts`)**: Handles database mutations securely on the server.
3. **MongoDB**: The single source of truth for all data.
4. **Custom Server (`server.js`)**: A custom Node.js server that wraps Next.js and runs the Socket.IO instance for real-time WebSocket connections.
5. **Socket Emitter (`src/lib/socketEmit.ts`)**: A utility used by Server Actions to trigger socket events via an internal HTTP endpoint on `server.js`.
6. **Realtime Listeners (`RealtimeEventHandler`, `NotificationsMenu`)**: Client components that listen for Socket.IO events and trigger UI updates/refreshes.

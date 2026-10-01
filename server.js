const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { jwtVerify } = require("jose");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const JWT_SECRET_KEY =
  process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production";
console.log("SERVER.JS JWT SECRET:", JWT_SECRET_KEY);
const encodedKey = new TextEncoder().encode(JWT_SECRET_KEY);

// Initialize the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Attach Socket.IO to the same HTTP server
  const io = new Server(httpServer, {
    path: "/api/socketio",
    addTrailingSlash: false,
    cors: {
      origin: dev
        ? ["http://localhost:3000", "http://127.0.0.1:3000"]
        : process.env.NEXT_PUBLIC_SITE_URL
        ? [process.env.NEXT_PUBLIC_SITE_URL]
        : [],
      methods: ["GET", "POST"],
      credentials: true,
    },
    // Connection limits
    maxHttpBufferSize: 1e6, // 1MB max payload
    pingTimeout: 30000,
    pingInterval: 25000,
  });

  // ── Authentication Middleware ──
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("UNAUTHORIZED: No token provided"));
      }

      const { payload } = await jwtVerify(token, encodedKey, {
        algorithms: ["HS256"],
      });

      if (!payload || !payload.userId) {
        return next(new Error("UNAUTHORIZED: Invalid token"));
      }

      // Attach verified user info to socket (from JWT, not client)
      socket.data.userId = payload.userId;
      socket.data.email = payload.email;
      socket.data.role = payload.role;

      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("UNAUTHORIZED: Token verification failed"));
    }
  });

  // ── Connection Handler ──
  io.on("connection", (socket) => {
    const { userId, email, role } = socket.data;
    console.log(`[Socket.IO] Admin connected: ${email} (${role}) — ${socket.id}`);

    // Join appropriate rooms based on verified role
    socket.join("admin:all");

    if (role === "SUPER_ADMIN") {
      socket.join("admin:superadmin");
    }

    // All roles that can see inquiries
    if (["SUPER_ADMIN", "ADMIN"].includes(role)) {
      socket.join("admin:inquiries");
    }

    // All roles can see portfolio events
    socket.join("admin:portfolio");
    socket.join("admin:notifications");

    // Broadcast presence to other admins
    socket.to("admin:all").emit("admin:presenceChanged", {
      id: userId,
      type: "connected",
      timestamp: new Date().toISOString(),
      metadata: { email, role },
    });

    socket.on("disconnect", (reason) => {
      console.log(`[Socket.IO] Admin disconnected: ${email} — ${reason}`);
      socket.to("admin:all").emit("admin:presenceChanged", {
        id: userId,
        type: "disconnected",
        timestamp: new Date().toISOString(),
        metadata: { email },
      });
    });
  });

  // ── Internal Emit API ──
  // Next.js Server Actions call this internal endpoint to broadcast events
  // This avoids importing socket.io directly in serverless-like contexts
  const originalListeners = httpServer.listeners("request").slice(0);

  httpServer.removeAllListeners("request");
  httpServer.on("request", (req, res) => {
    // Internal-only endpoint for server actions to emit events
    if (req.method === "POST" && req.url === "/_internal/socket-emit") {
      // Only accept requests from localhost
      const remoteIp = req.socket.remoteAddress;
      if (
        remoteIp !== "127.0.0.1" &&
        remoteIp !== "::1" &&
        remoteIp !== "::ffff:127.0.0.1"
      ) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }

      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          const { event, room, payload } = JSON.parse(body);
          if (!event || !payload) {
            res.writeHead(400);
            res.end("Missing event or payload");
            return;
          }

          if (room) {
            io.to(room).emit(event, payload);
          } else {
            io.to("admin:all").emit(event, payload);
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          console.error("[Socket emit error]", err);
          res.writeHead(500);
          res.end("Internal error");
        }
      });
      return;
    }

    // Pass all other requests to Next.js
    for (const listener of originalListeners) {
      listener.call(httpServer, req, res);
    }
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.IO server attached at /api/socketio`);
    });
});

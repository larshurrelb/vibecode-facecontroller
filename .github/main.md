// main.ts
import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { extname } from "https://deno.land/std@0.220.1/path/mod.ts";

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".riv": "application/octet-stream",
  ".js": "text/javascript",
  ".css": "text/css",
};

// Keep track of WebSocket connections
const connectedClients = new Set<WebSocket>();

let server: Deno.Server | null = null;

// Function to check WebSocket connections and restart server if needed
const checkConnections = async () => {
  connectedClients.forEach((socket) => {
    if (socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
      connectedClients.delete(socket);
      console.log("Removed disconnected client");
    }
  });

  // Restart server if no active connections
  if (connectedClients.size === 0 && server) {
    try {
      await server.shutdown();
      server = await serve(handler);
      console.log("Server restarted and ready for new connections");
    } catch (error) {
      console.error("Failed to restart server:", error);
    }
  }
};

// Start connection monitoring
const connectionMonitor = setInterval(checkConnections, 10000);

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  
  // Handle HTTP POST for face triggers
  if (url.pathname === "/api/trigger" && req.method === "POST") {
    try {
      const body = await req.json();
      const { key, action } = body;
      
      console.log(`HTTP trigger received: ${key} (${action || 'unknown'})`);
      
      // Broadcast to all WebSocket clients (for backwards compatibility)
      connectedClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(key);
        }
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        key, 
        action,
        clients: connectedClients.size 
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    } catch (error) {
      console.error("HTTP trigger error:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid request body" 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  
  // Handle WebSocket upgrade (backwards compatibility)
  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      connectedClients.add(socket);
      console.log("New client connected");
      // Add a heartbeat ping every 30 seconds
      const pingInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send("ping");
        } else {
          clearInterval(pingInterval);
        }
      }, 30000);
    };
    
    socket.onmessage = (event) => { 
      // Optionally ignore "pong" replies if sent back from clients
      if (event.data === "pong") return;
      // Broadcast the message to all other clients
      connectedClients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(event.data);
        }
      });
    };
    
    socket.onclose = () => {
      connectedClients.delete(socket);
      console.log("Client disconnected");
    };
    
    return response;
  }

  // Serve static files
  try {
    const filePath = url.pathname === '/' ? './index.html' : '.' + url.pathname;
    const content = await Deno.readFile(filePath);
    const extension = extname(filePath);
    const contentType = MIME_TYPES[extension] || "application/octet-stream";
    
    return new Response(content, {
      headers: { "Content-Type": contentType }
    });
  } catch (e) {
    return new Response("Not Found", { status: 404 });
  }
};

console.log("Server running...");
server = await serve(handler);

// Cleanup on server shutdown
addEventListener("unload", () => {
  clearInterval(connectionMonitor);
  connectedClients.forEach((socket) => socket.close());
  if (server) {
    server.shutdown();
  }
});
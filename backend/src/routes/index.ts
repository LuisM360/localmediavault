import { Hono } from "hono";
import { corsMiddleware, loggerMiddleware } from "../middleware/index.js";
import { serve } from "@hono/node-server";
import {
  getDrives,
  getDriveContents,
  getDirectoryContents,
} from "../controllers/directory.controller.js";

const app = new Hono();

// Middleware
app.use("*", loggerMiddleware);
app.use("*", corsMiddleware);

// Routes
app.get("/", (c) => c.json({ status: "Media Server API Running" }));

// Media Routes
const media = new Hono();

// Get available drives
media.get("/directories", getDrives);

// Get first level directories for a drive
media.get("/directories/:drive/scan", getDriveContents);

// Get subdirectories for a specific path
media.get("/directories/scan", getDirectoryContents);

app.route("/media", media);

// Start the server
serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

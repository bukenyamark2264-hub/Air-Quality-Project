/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // AirQo API Proxy to bypass CORS and hide API Key
  app.get("/api/airqo", async (req, res) => {
    try {
      const AIRQO_API_KEY = process.env.AIRQO_API_KEY || "6QXG13SE7Y8URC8T";
      // Added limit=1000 and recent=yes to get more active nodes
      const AIRQO_URL = `https://api.airqo.net/api/v2/devices/measurements?tenant=airqo&limit=1000&recent=yes&token=${AIRQO_API_KEY}`;

      console.log(`Fetching from AirQo API (Max 1000 nodes)...`);
      
      const response = await fetch(AIRQO_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${AIRQO_API_KEY}`,
          "x-api-key": AIRQO_API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`AirQo API responded with status: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Proxy Error:", error);
      res.status(500).json({ error: "Failed to fetch air quality data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

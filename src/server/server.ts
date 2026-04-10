import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import secretRoutes from "./routes/secret.route.js";

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);
const BASE_PATH = process.env.BASE_PATH || "/secret";

app.use(cors());
app.use(express.json());

// static
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API
app.use(`${BASE_PATH}/api`, secretRoutes);

// static files
app.use(BASE_PATH, express.static(path.join(__dirname, "../../dist")));

// SPA fallback
app.get(`${BASE_PATH}/*`, (_req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
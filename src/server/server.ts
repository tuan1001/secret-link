import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONFIG =====
const DIST_PATH = path.join(__dirname, "../../dist");

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== STATIC FILE =====
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
} else {
  console.warn("⚠️ dist folder not found. Run 'npm run build'");
}

// ===== STORE =====
interface SecretData {
  secret: string;
  password: string;
}

const store: Record<string, SecretData> = {};

// ===== HELPER: GET BASE URL =====
const getBaseUrl = (req: express.Request) => {
  // ưu tiên ENV nếu có
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL;
  }

  // fallback: auto detect
  return `${req.protocol}://${req.get("host")}`;
};

// ----------------------- API CREATE -----------------------
app.post("/api/create", (req, res) => {
  const { secret, password } = req.body;

  if (!secret || !password) {
    return res.status(400).json({ error: "Thiếu dữ liệu" });
  }

  const token = uuidv4();
  store[token] = { secret, password };

  const baseUrl = getBaseUrl(req);

  return res.json({
    link: `${baseUrl}/view/${token}`,
  });
});

// ----------------------- API VIEW -------------------------
app.post("/api/view/:token", (req, res) => {
  const { password } = req.body;
  const token = req.params.token;

  const data = store[token];

  if (!data) {
    return res.status(404).json({ error: "⛔ Expired or not found" });
  }

  if (data.password !== password) {
    return res.status(403).json({ error: "❌ Wrong password" });
  }

  const secret = data.secret;
  delete store[token];

  return res.json({ secret });
});

// ---------------------- SPA CATCH-ALL ---------------------
app.get(/^\/(?!api).*/, (_req, res) => {
  const indexPath = path.join(DIST_PATH, "index.html");

  if (!fs.existsSync(indexPath)) {
    return res.status(500).send("Build chưa được tạo. Chạy npm run build ❗");
  }

  res.sendFile(indexPath);
});

// ----------------------- START SERVER ---------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
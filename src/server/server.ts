import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"

dotenv.config(); // Load biến môi trường từ .env

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend (after build)
app.use(express.static(path.join(__dirname, "../../dist")));

// Catch-all for SPA (except /api routes)
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

app.use(cors({ origin: FRONTEND_URL }));
app.use(bodyParser.json());

interface SecretData {
  secret: string;
  password: string;
}

const store: Record<string, SecretData> = {};

// API tạo link
app.post("/api/create", (req, res) => {
  const { secret, password } = req.body;
  if (!secret || !password) {
    return res.status(400).json({ error: "Thiếu dữ liệu" });
  }

  const token = uuidv4();
  store[token] = { secret, password };

  res.json({ link: `${FRONTEND_URL}/view/${token}` });
});

// API xem link
app.post("/api/view/:token", (req, res) => {
  const { password } = req.body;
  const token = req.params.token;

  const data = store[token];
  if (!data) {
    return res.status(404).json({ error: "⛔ Expired date" });
  }

  if (data.password !== password) {
    return res.status(403).json({ error: "❌ Wrong password" });
  }

  const secret = data.secret;
  delete store[token]; // 1 lần duy nhất

  return res.json({ secret });
});

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});

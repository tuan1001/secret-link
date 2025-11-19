import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- DOMAIN CHÍNH Ở ĐÂY ---
const FRONTEND_URL = process.env.FRONTEND_URL || "https://secret.htit.com.vn";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend (after build)
app.use(express.static(path.join(__dirname, "../../dist")));

// Allow client to call API
app.use(cors());
app.use(bodyParser.json());

interface SecretData {
  secret: string;
  password: string;
}

const store: Record<string, SecretData> = {};

// ----------------------- API CREATE -----------------------
app.post("/api/create", (req, res) => {
  const { secret, password } = req.body;

  if (!secret || !password) {
    return res.status(400).json({ error: "Thiếu dữ liệu" });
  }

  const token = uuidv4();
  store[token] = { secret, password };

  // TRẢ VỀ LINK CHUẨN (KHÔNG BAO GIỜ LỖI DOMAIN)
  res.json({ link: `${FRONTEND_URL}/view/${token}` });
});

// ----------------------- API VIEW -------------------------
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

  delete store[token]; // xem 1 lần duy nhất

  return res.json({ secret });
});

// ---------------------- SPA CATCH-ALL ---------------------
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

// ----------------------- START SERVER ---------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

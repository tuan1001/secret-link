import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import secretRoutes from "./routes/secret.route.js";

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);

app.use(cors());
app.use(express.json());

// API
app.use("/api", secretRoutes);

// static
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../dist")));

app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
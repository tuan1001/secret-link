import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "dotenv/config";

const BASE_PATH = process.env.BASE_PATH || "/secret";
const basePath = BASE_PATH.endsWith("/") ? BASE_PATH : BASE_PATH + "/";

export default defineConfig(({ command }) => ({
  base: command === "build" ? basePath : "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        rewrite: (path) => `${BASE_PATH}${path}`,
      },
    },
  },
}));
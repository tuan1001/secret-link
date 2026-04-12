import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/secret/" : "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        rewrite: (path) => `/secret${path}`,
      },
    },
  },
}));
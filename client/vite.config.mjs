import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // critical: do NOT load PostCSS config; we use CLI CSS
  css: { postcss: {} }
});
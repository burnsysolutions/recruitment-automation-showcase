import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base, so the built site works from any folder (GitHub Pages serves it under the repo's name).
// Routes use the hash, so every page loads from the one index.html.
export default defineConfig({
  base: "./",
  plugins: [react()],
});

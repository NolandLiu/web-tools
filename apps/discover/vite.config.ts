import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "apps/discover",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../../dist-discover",
    emptyOutDir: true,
  },
});

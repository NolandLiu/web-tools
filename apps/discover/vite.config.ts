import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "apps/discover",
  plugins: [react()],
  build: {
    outDir: "../../dist-discover",
    emptyOutDir: true,
  },
});

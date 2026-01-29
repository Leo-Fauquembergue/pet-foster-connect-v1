import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@projet/shared-types": path.resolve(__dirname, "../../packages/shared-types/src/index.ts"),
    },
  },
});

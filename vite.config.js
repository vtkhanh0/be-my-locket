import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// Xóa: import { VitePWA } from "vite-plugin-pwa";
// Xóa: const manifestForPlugIn = { ... }

export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  server: {
    host: true,
  },
  plugins: [tailwindcss(), react(), visualizer()], // Xóa VitePWA(manifestForPlugIn)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          ui: ["lucide-react", "sonner", "react-icons", "react-toastify", "react-fast-marquee"],
          crop: ["react-easy-crop"],
          vendor: ["axios", "zustand", "dexie"],
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
});

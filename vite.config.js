import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // 자동 업데이트 설정
      injectRegister: "auto", // 자동 서비스 워커 등록
      strategies: "injectManifest", // injectManifest 전략 사용
      injectManifest: {
        swSrc: "public/service-worker.js",
        swDest: "dist/service-worker.js",
      },
      filename: "service-worker.js",
      manifest: {
        name: "Merge Blocks",
        short_name: "Merge Blocks",
        description: "Merge blocks and get high scores!",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        orientation: "portrait",
        icons: [
          {
            src: "/mergeblocks.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/mergeblocks.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        disableDevLogs: true,
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },
      includeAssets: ["mergeblocks.png", "robots.txt"],
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

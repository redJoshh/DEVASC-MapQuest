import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 127.0.0.1, not localhost: newer Node versions may resolve localhost
      // to IPv6 (::1) while Flask only listens on IPv4, which fails silently.
      "/api": "http://127.0.0.1:5000",
    },
  },
});

import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/visual-hive-demo-site/" : "/",
  preview: {
    host: "127.0.0.1"
  },
  server: {
    host: "127.0.0.1"
  }
});

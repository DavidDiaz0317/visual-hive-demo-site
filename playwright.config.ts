import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: [".visual-hive/generated/**/*.spec.ts"]
});

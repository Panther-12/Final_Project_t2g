import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:4200',
  },
  chromeWebSecurity: false,
  projectId: "e48bem",
});

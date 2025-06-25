import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests', 
  timeout: 30000,      
  use: {
    headless: true,    
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
  },
});

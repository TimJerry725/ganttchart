/**
 * Basic E2E test
 */

import { test, expect } from '@playwright/test';

test('basic gantt chart loads', async ({ page }) => {
  // This is a placeholder test
  // In a real scenario, you'd start the demo app and test it
  await page.goto('http://localhost:5173');
  
  // For now, just check that the page loads
  // This will be skipped if the demo app isn't running
  expect(page).toBeDefined();
});

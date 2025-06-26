import { test, expect } from '@playwright/test';

test('full stack search and graph rendering', async ({ page }) => {
  // 1. Aller sur la page frontend
  await page.goto('http://localhost:3000');

  // 2. Entrer une requête
  const input = page.getByPlaceholder('Ex: Local technique de piscine');
  await input.fill('solutions acoustiques de sonorisation');

  const start = Date.now();

  // 3. Intercepter la requête vers l’API backend
  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api/graph') && resp.status() === 200),
    page.getByRole('button', { name: 'Rechercher' }).click(),
  ]);

  // 4. Vérifie la réponse API
  const data = await response.json();
  expect(data).toHaveProperty('graph');
  expect(data.graph).toHaveProperty('nodes');
  expect(data.graph).toHaveProperty('edges');
  expect(data.graph.nodes.length).toBeGreaterThan(0);

  // 5. Vérifie que le graphe est bien visible (canvas dans Shadow DOM)
  const canvas = page.locator('result-graph').locator('canvas');
  await expect(canvas).toBeVisible({ timeout: 10000 });

  const end = Date.now();
  const duration = end - start;
  expect(duration).toBeLessThan(3000);

  // 6. Vérifie qu’au moins un canvas est bien rendu
  const canvasCount = await page.locator('result-graph').locator('.graph-container').locator('canvas').count();
  expect(canvasCount).toBeGreaterThan(0);
});

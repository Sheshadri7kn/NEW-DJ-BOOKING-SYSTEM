// tests/history.spec.js
import { test } from '@playwright/test';
import { HistoryPage } from '../pom/historyPage';

const email = 'shesha627@gmail.com';
const password = 'Cit@12345';

test.describe('History Module', () => {

  test('TC01 - History Page Loads', async ({ page }) => {
    const history = new HistoryPage(page);
    await history.login(email, password);
    await history.goToHistory();
    await history.expectHistoryPage();
  });

  test('TC03 - History UI visible', async ({ page }) => {
    const history = new HistoryPage(page);
    await history.login(email, password);
    await history.goToHistory();
    await history.expectHistoryUI();
  });

  test('TC04 - No duplicate history entries', async ({ page }) => {
    const history = new HistoryPage(page);
    await history.login(email, password);
    await history.goToHistory();
    await history.expectNoDuplicateHistory();
  });

  test('TC05 - Empty History Message', async ({ page }) => {
    const history = new HistoryPage(page);
    await history.login(email, password);
    await history.goToHistory();
    await history.expectEmptyHistoryMessage();
  });

  test('TC08 - Multiple history entries load', async ({ page }) => {
    const history = new HistoryPage(page);
    await history.login(email, password);
    await history.goToHistory();
    await history.expectMultipleEntries();
  });

  test('TC10 - History persists after refresh', async ({ page }) => {
    const history = new HistoryPage(page);
    await history.login(email, password);
    await history.goToHistory();
    await page.reload();
    await history.expectHistoryPersists();
  });

});
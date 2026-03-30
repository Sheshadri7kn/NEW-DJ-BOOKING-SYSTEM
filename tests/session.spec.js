import { expect, test } from '@playwright/test';

test('Create session and save login state', async ({ page }) => {

   await page.goto('https://daily-wage-book-1--vinayksgowda44.replit.app/');
    await page.getByRole('button', { name: 'Log In' }).click();
  await page.locator('input[name="email"]').fill('vinayksgowda123456@gmail.com');
  await page.locator('input[name="password"]').fill('123456');
  await page.getByRole('button', { name: 'Sign in' }).click();
   page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Welcome Back!');
    await dialog.accept();
  });
  await page.waitForLoadState('load');
  // Navigate to home to ensure session is active
  await page.goto('https://daily-wage-book-1--vinayksgowda44.replit.app/');
  await page.context().storageState({ path: 'storageState.json' });  
});
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/loginPage';

test.describe('Login Module - PulseBook', () => {

  test('TC01 - Login page loads', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test('TC02 - Email field visible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.emailInput).toBeVisible();
  });

  test('TC03 - Password field visible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('TC04 - Sign In button visible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.signInBtn).toBeVisible();
  });

  test('TC05 - Empty login shows validation messages', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.clickSignIn();
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('TC06 - Only email filled', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillEmail('test@test.com');
    await loginPage.clickSignIn();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('TC07 - Only password filled', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillPassword('Password@123');
    await loginPage.clickSignIn();
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
  });

  test('TC08 - Invalid email format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillEmail('abc');
    await loginPage.fillPassword('Password@123');
    await loginPage.clickSignIn();
    const validationMessage = await loginPage.getEmailValidationMessage();
    await expect(validationMessage).toContain('@');
  });

  test('TC09 - Wrong credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillEmail('wrong@test.com');
    await loginPage.fillPassword('wrong123');
    await loginPage.clickSignIn();
    await expect(page.getByText('Invalid credentials').first()).toBeVisible();
  });

  test('TC10 - Wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.clickCreateAccount();

    const inputs = page.locator('input');
    const email = `user${Date.now()}@test.com`;
    const password = 'Password@123';

    await inputs.nth(0).fill('Test User');
    await inputs.nth(1).fill(email);
    await inputs.nth(2).fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await page.getByRole('button', { name: 'Sign In' }).waitFor();

    await loginPage.fillEmail(email);
    await loginPage.fillPassword('wrong123');
    await loginPage.clickSignIn();
    await expect(page.getByText('Invalid credentials').first()).toBeVisible();
  });

  test('TC11 - Successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.clickCreateAccount();

    const inputs = page.locator('input');
    const email = `user${Date.now()}@test.com`;
    const password = 'Password@123';

    await inputs.nth(0).fill('Test User');
    await inputs.nth(1).fill(email);
    await inputs.nth(2).fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await page.getByRole('button', { name: 'Sign In' }).waitFor();

    await loginPage.fillEmail(email);
    await loginPage.fillPassword(password);
    await loginPage.clickSignIn();

    await page.waitForLoadState('networkidle');
    await expect(page.url()).not.toContain('login');
  });

  test('TC12 - Navigate to Register page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.clickCreateAccount();
    await expect(page.getByText('Create Account')).toBeVisible();
  });

  test('TC13 - Email with spaces', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillEmail('  test@test.com  ');
    await loginPage.fillPassword('Password@123');
    await loginPage.clickSignIn();
    await loginPage.emailInput.waitFor({ state: 'visible' });
    const validationMessage = await loginPage.getEmailValidationMessage();
    await expect(validationMessage).toBe('');
  });

  test('TC14 - Very long email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillEmail('a'.repeat(200) + '@test.com');
    await loginPage.fillPassword('Password@123');
    await loginPage.clickSignIn();
  });

  test('TC15 - Password is masked', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

});
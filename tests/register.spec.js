import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pom/registerPage';

test.describe('Register Module - Validation + Functional', () => {

  let registerPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.gotoRegister();
  });

  test('TC01 - Empty form submit', async () => {
    await registerPage.clickSignUp();
    await expect(registerPage.nameInput).toBeVisible();
  });

  test('TC02 - Only name filled', async () => {
    await registerPage.fillName('Alex');
    await registerPage.clickSignUp();
    await expect(registerPage.page.getByText('Please enter a valid email')).toBeVisible();
    await expect(registerPage.page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('TC03 - Only email filled', async () => {
    await registerPage.fillEmail('alex@test.com');
    await registerPage.clickSignUp();
    await expect(registerPage.page.getByText('Name is required')).toBeVisible();
    await expect(registerPage.page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('TC04 - Only password filled', async () => {
    await registerPage.fillPassword('Password@123');
    await registerPage.clickSignUp();
    await expect(registerPage.page.locator('p:has-text("Name is required")')).toBeVisible();
    await expect(registerPage.page.locator('p:has-text("Please enter a valid email")')).toBeVisible();
  });

  test('TC05 - Invalid email (missing @)', async () => {
    await registerPage.fillEmail('ales');
    await registerPage.clickSignUp();
    await expect(await registerPage.getEmailValidationMessage()).toContain('@');
  });

  test('TC06 - Invalid email (missing domain)', async () => {
    await registerPage.fillEmail('ales@');
    await registerPage.clickSignUp();
    await expect(await registerPage.getEmailValidationMessage()).toContain('following');
  });

  test('TC07 - Invalid email (no .com)', async () => {
    await registerPage.fillEmail('ales@gmail');
    await registerPage.clickSignUp();
    await expect(registerPage.page.locator('p:has-text("Please enter a valid email")')).toBeVisible();
  });

  test('TC08 - Password too short', async () => {
    await registerPage.fillPassword('123');
    await registerPage.clickSignUp();
    await expect(registerPage.page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('TC09 - Missing password only', async () => {
    await registerPage.fillName('Alex');
    await registerPage.fillEmail('alex@test.com');
    await registerPage.clickSignUp();
    await expect(registerPage.page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('TC10 - Email with spaces', async () => {
    await registerPage.fillEmail(' alex@gmail.com ');
    await registerPage.clickSignUp();
    await expect(registerPage.emailInput).toBeVisible();
  });

  test('TC11 - Very long name', async () => {
    await registerPage.fillName('A'.repeat(100));
    await registerPage.fillEmail(`user${Date.now()}@test.com`);
    await registerPage.fillPassword('Password@123');
    await registerPage.clickSignUp();
    await expect(registerPage.page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('TC12 - Password masked', async () => {
    await expect(registerPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC13 - Successful registration', async () => {
    await registerPage.fillName('TestUser');
    await registerPage.fillEmail(`user${Date.now()}@test.com`);
    await registerPage.fillPassword('Password@123');
    await registerPage.clickSignUp();
    await expect(registerPage.page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('TC14 - Navigate to login page', async () => {
    await registerPage.clickSignInLink();
    await expect(registerPage.page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

});
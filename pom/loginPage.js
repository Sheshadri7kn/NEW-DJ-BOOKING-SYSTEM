import { expect } from '@playwright/test';

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.baseURL = 'https://dj-booking-system--sheshadrikn96.replit.app/';
    this.emailInput = page.locator('input').nth(0);
    this.passwordInput = page.locator('input').nth(1);
    this.signInBtn = page.getByRole('button', { name: 'Sign In' });
    this.createAccountLink = page.getByText('Create one now');
  }

  async goto() {
    await this.page.goto(this.baseURL);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInBtn.click();
  }

  async clickCreateAccount() {
    await this.createAccountLink.click();
  }

  async getEmailValidationMessage() {
    return await this.emailInput.evaluate(e => e.validationMessage);
  }
}
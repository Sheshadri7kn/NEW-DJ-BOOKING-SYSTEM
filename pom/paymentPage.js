// pom/PaymentPage.js
import { expect } from '@playwright/test';

export class PaymentPage {
  constructor(page) {
    this.page = page;

    // Login selectors
    this.emailInput = page.getByRole('textbox', { name: 'dj@pulsebook.com' });
    this.passwordInput = page.getByRole('textbox', { name: '••••••••' });
    this.signInBtn = page.getByRole('button', { name: 'Sign In' });

    // Navigation
    this.bookingsLink = page.getByRole('link', { name: 'Bookings' });
    this.payNowButtons = page.getByRole('link', { name: 'Pay Now' });

    // Payment method labels
    this.creditCardLabel = page.locator('label').filter({ hasText: 'Credit Card' });
    this.debitCardLabel = page.locator('label').filter({ hasText: 'Debit Card' });
    this.payPalLabel = page.locator('label').filter({ hasText: 'PayPal' });

    // Payment fields
    this.cardholderInput = page.getByRole('textbox', { name: /John Smith/i });
    this.cardNumberInput = page.getByRole('textbox', { name: /0000/ });
    this.expiryInput = page.getByRole('textbox', { name: /MM\/YY/i });
    this.cvvInput = page.getByRole('textbox', { name: /•••|CVV/i });

    // Payment button and error messages
    this.payButton = page.getByRole('button', { name: 'Pay & Confirm Booking' });
    this.errorMsg = page.locator('p.text-destructive');
  }

  async login(email, password) {
    await this.page.goto('https://dj-booking-system--sheshadrikn96.replit.app/login');
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInBtn.click();
  }

  async goToPayment() {
    await this.bookingsLink.click();
    await this.payNowButtons.first().click();
    await this.page.waitForTimeout(1000);
  }

  async selectPayment(method) {
    switch (method.toLowerCase()) {
      case 'credit':
      case 'credit card':
        await this.creditCardLabel.click();
        break;
      case 'debit':
      case 'debit card':
        await this.debitCardLabel.click();
        break;
      case 'paypal':
        await this.payPalLabel.click();
        break;
      default:
        throw new Error(`Unknown payment method: ${method}`);
    }
  }

  async fillCardDetails({ name, number, expiry, cvv }) {
    if (name !== undefined) await this.cardholderInput.fill(name);
    if (number !== undefined) await this.cardNumberInput.fill(number);
    if (expiry !== undefined) await this.expiryInput.fill(expiry);
    if (cvv !== undefined) await this.cvvInput.fill(cvv);
  }

  async submitPayment() {
    await this.payButton.click();
  }

  async expectError(text) {
    await expect(this.errorMsg.filter({ hasText: text })).toBeVisible();
  }

  async expectPage(urlPart) {
    await expect(this.page).toHaveURL(new RegExp(urlPart));
  }
}
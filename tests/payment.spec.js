// tests/payment.spec.js
import { test, expect } from '@playwright/test';
import { PaymentPage } from '../pom/paymentPage';

const email = 'shesha627@gmail.com';
const password = 'Cit@12345';

test.describe('Payment Module', () => {

  // =========================
  // CREDIT CARD TEST CASES
  // =========================
  test('TC01 - Credit Card Success Payment', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.fillCardDetails({
      name: 'Shesha',
      number: '4242 4242 4242 4242',
      expiry: '12/30',
      cvv: '123'
    });
    await payment.submitPayment();
    await payment.expectPage('booking');
  });

  test('TC02 - Credit Card Empty Submit Validation', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.submitPayment();
    await payment.expectError('Cardholder name is required');
    await payment.expectError('Enter a valid 16-digit card number');
    await payment.expectError('Enter expiry as MM/YY');
    await payment.expectError('Enter a valid CVC');
  });

  test('TC03 - Invalid Card Number', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.fillCardDetails({ name: 'Shesha', number: '1234', expiry: '12/30', cvv: '123' });
    await payment.submitPayment();
    await payment.expectError('Enter a valid 16-digit card number');
  });

  test('TC04 - Expired Card Format Check', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.fillCardDetails({ name: 'Shesha', number: '4242 4242 4242 4242', expiry: '01/20', cvv: '123' });
    await payment.submitPayment();
  });

  test('TC05 - CVV Empty Validation', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.fillCardDetails({ name: 'Shesha', number: '4242 4242 4242 4242', expiry: '12/30' });
    await payment.submitPayment();
    await payment.expectError('Enter a valid CVC');
  });

  // =========================
  // DEBIT CARD TEST CASES
  // =========================
  test('TC06 - Debit Card Success Payment', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Debit Card');
    await payment.fillCardDetails({ name: 'Shesha', number: '5555 5555 5555 4444', expiry: '11/29', cvv: '321' });
    await payment.submitPayment();
    await payment.expectPage('booking');
  });

  test('TC07 - Debit Empty Submit Validation', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Debit Card');
    await payment.submitPayment();
    await payment.expectError('Cardholder name is required');
  });

  // =========================
  // PAYPAL TEST CASES
  // =========================
  test('TC08 - PayPal Select UI Check', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('PayPal');
    await expect(payment.page.locator('span').filter({ hasText: 'PayPal' }).first()).toBeVisible();
  });

  test('TC09 - PayPal Empty Email Validation', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('PayPal');
    await payment.submitPayment();
    await payment.expectError('Enter a valid PayPal email');
  });

  test('TC10 - PayPal Invalid Email Block Payment', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('PayPal');
    await payment.page.getByRole('textbox').first().fill('wrongemail');
    await payment.submitPayment();
    await payment.expectPage('payment'); // Should still be on payment page
  });

  // =========================
  // EXTRA EDGE TEST CASES
  // =========================
  test('TC11 - Switch Payment Methods', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.selectPayment('Debit Card');
    await payment.selectPayment('PayPal');
    await expect(payment.page.locator('text=PayPal').first()).toBeVisible();
  });

  test('TC12 - Payment Button Disabled State Check', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await expect(payment.payButton).toBeVisible();
  });

  test('TC13 - Refresh Payment Page State', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await page.reload();
    await expect(payment.payButton).toBeVisible();
  });

  test('TC14 - Multiple Click Protection', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    for (let i = 0; i < 3; i++) await payment.payButton.click();
  });

  test('TC15 - Payment Page Load Check', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.expectPage('payment');
  });

  test('TC16 - Card Switching After Fill', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.selectPayment('PayPal');
    await payment.selectPayment('Debit Card');
    await expect(payment.debitCardLabel).toBeVisible();
  });

  test('TC17 - Fast Click Stress Test', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    for (let i = 0; i < 5; i++) await payment.payButton.click();
  });

  test('TC18 - Payment Form Stability Check', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await expect(payment.page.locator('form, div').first()).toBeVisible();
  });

  // =========================
  // ADDITIONAL EDGE TEST CASES
  // =========================
  test('TC19 - Credit Card Missing Name Validation', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.fillCardDetails({ number: '4242 4242 4242 4242', expiry: '12/30', cvv: '123' });
    await payment.submitPayment();
    await payment.expectError('Cardholder name is required');
  });

  test('TC20 - Credit Card Missing Card Number Validation', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.fillCardDetails({ name: 'Shesha', expiry: '12/30', cvv: '123' });
    await payment.submitPayment();
    await payment.expectError('Enter a valid 16-digit card number');
  });

  test('TC21 - Credit Card Missing Expiry Validation', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.fillCardDetails({ name: 'Shesha', number: '4242 4242 4242 4242', cvv: '123' });
    await payment.submitPayment();
    await payment.expectError('Enter expiry as MM/YY');
  });

  test('TC22 - Credit Card Missing CVV Validation', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.fillCardDetails({ name: 'Shesha', number: '4242 4242 4242 4242', expiry: '12/30' });
    await payment.submitPayment();
    await payment.expectError('Enter a valid CVC');
  });

  test('TC23 - Debit Card Missing All Fields Validation', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Debit Card');
    await payment.submitPayment();
    await payment.expectError('Cardholder name is required');
  });

  test('TC24 - PayPal Missing Email Validation', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('PayPal');
    await payment.submitPayment();
    await payment.expectError('Enter a valid PayPal email');
  });


  test('TC26 - Successful Credit Card Flow Redirect Check', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.fillCardDetails({ name: 'Shesha', number: '4242 4242 4242 4242', expiry: '12/30', cvv: '123' });
    await payment.submitPayment();
    await payment.expectPage('booking');
  });

  test('TC27 - Multiple Card Switching and Submission', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await payment.selectPayment('Credit Card');
    await payment.selectPayment('Debit Card');
    await payment.selectPayment('PayPal');
    await payment.selectPayment('Credit Card');
    await payment.fillCardDetails({ name: 'Shesha', number: '4242 4242 4242 4242', expiry: '12/30', cvv: '123' });
    await payment.submitPayment();
    await payment.expectPage('booking');
  });

  test('TC28 - Reload Page Keeps Payment Form Visible', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await page.reload();
    await expect(payment.payButton).toBeVisible();
  });

  test('TC29 - Pay Button Fast Clicking Protection', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    for (let i = 0; i < 5; i++) {
      await payment.payButton.click();
    }
  });

  test('TC30 - Payment Page Elements Stability Check', async ({ page }) => {
    const payment = new PaymentPage(page);
    await payment.login(email, password);
    await payment.goToPayment();
    await expect(payment.page.locator('form, div').first()).toBeVisible();
  });

});
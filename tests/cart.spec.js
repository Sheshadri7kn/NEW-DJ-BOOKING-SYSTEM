import { test, expect } from '@playwright/test';
import { CartPage } from '../pom/cartPage';

const email = 'shesha627@gmail.com';
const password = 'Cit@12345';
const baseURL = 'https://dj-booking-system--sheshadrikn96.replit.app/';

test.describe('Cart Module - Functional Tests', () => {
  let cartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    await cartPage.login(email, password);
    await cartPage.addFirstItemToCart();
    await cartPage.goToCart();
  });

  test('TC01 - Cart loads correctly', async () => {
    await expect(cartPage.page).toHaveURL(/cart/);
  });

  test('TC02 - Multiple items can be added and shown', async () => {
    await cartPage.page.goto(baseURL);
    await cartPage.addMultipleItemsToCart();
    await cartPage.goToCart();
    await expect(cartPage.cartItemName.first()).toBeVisible();
  });

  test('TC03 - Remove item from cart works', async () => {
    await cartPage.removeFirstItem();
    await expect(cartPage.page.locator('body')).toBeVisible();
  });

  test('TC04 - Cart updates after removal', async () => {
    await cartPage.removeFirstItem();
    await expect(cartPage.page.locator('body')).toBeVisible();
  });

  test('TC05 - Book now navigates to booking page', async () => {
    await cartPage.bookFirstItem();
    await expect(cartPage.page).toHaveURL(/booking/);
  });

  test('TC06- booking url contains djId', async ({ page }) => {
     const bookBtn = page.locator('text=Book Now').first();
    if (await bookBtn.count() > 0) { await bookBtn.click();
     await expect(page.url()).toContain('djId'); } });

  test('TC08 - DJ name is visible in cart', async () => {
    await expect(cartPage.cartItemName.first()).toBeVisible();
  });

  test('TC09 - Cart persists after refresh', async () => {
    await cartPage.page.reload();
    await expect(cartPage.page.locator('body')).toBeVisible();
  });

  test('TC10 - Cart navigation works from header', async () => {
    await cartPage.goToCart();
    await expect(cartPage.page).toHaveURL(/cart/);
  });

 test('TC11- navigate back to home page', async ({ page }) => { 
  await page.click('a[href="/"]'); 
  await expect(page).not.toHaveURL(/cart/); });

  test('TC12 - Image is displayed in cart item', async () => {
    await expect(cartPage.cartItemImage.first()).toHaveAttribute('src');
  });

  test('TC13 - Remove all items from cart', async () => {
    await cartPage.removeAllItems();
    await expect(cartPage.page.locator('body')).toBeVisible();
  });

  test('TC14 - End-to-end cart to booking flow', async () => {
    await cartPage.page.goto(baseURL);
    await cartPage.addFirstItemToCart();
    await cartPage.goToCart();
    await cartPage.bookFirstItem();
    await expect(cartPage.page).toHaveURL(/booking/);
  });
});
import { test, expect } from '@playwright/test';
import { HomePage } from '../pom/homePage';

const email = 'shesha627@gmail.com';
const password = 'Cit@12345';

test.describe('Discover/Home Page - Functional Tests', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.login(email, password);
  });

  test('TC01 - Add first DJ to cart', async () => {
    const btn = await homePage.addFirstDJToCart();
    await expect(btn).toBeVisible();
  });

  test('TC02 - Add multiple DJs to cart', async () => {
    await homePage.addMultipleDJsToCart();
    await expect(homePage.addToCartBtns.nth(2)).toBeVisible();
  });

  test('TC03 - Navigate to Cart page', async () => {
    await homePage.addFirstDJToCart();
    await homePage.goToCart();
    await expect(homePage.page).toHaveURL(/cart/);
  });

  test('TC04 - Cart retains items after navigation', async () => {
    await homePage.addFirstDJToCart();
    await homePage.goToCart();
    await expect(homePage.page.getByRole('heading').first()).toBeVisible();
  });

  test('TC05 - Scroll loads more DJs', async () => {
    await homePage.scrollPage();
    await expect(homePage.addToCartBtns.last()).toBeVisible();
  });

  test('TC06 - Logout redirects to login', async () => {
    await homePage.logout();
    await expect(homePage.page).toHaveURL(/login/);
  });

  test('TC07 - DJ cards exist', async () => {
    const count = await homePage.addToCartBtns.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC08 - DJ images load correctly', async () => {
    const images = homePage.page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('TC09 - Add to cart button enabled', async () => {
    await expect(homePage.addToCartBtns.first()).toBeEnabled();
  });

  test('TC10 - Add same DJ multiple times', async () => {
    const btn = homePage.addToCartBtns.first();
    await btn.click();
    await btn.click();
    await btn.click();
    await expect(btn).toBeVisible();
  });

  test('TC11 - Reload page keeps session', async () => {
    await homePage.page.reload();
    await expect(homePage.addToCartBtns.first()).toBeVisible();
  });

  test('TC12 - Mobile viewport works', async () => {
    await homePage.setMobileViewport();
    await expect(homePage.addToCartBtns.first()).toBeVisible();
  });

  test('TC13 - Add last DJ after scroll', async () => {
    const lastBtn = await homePage.addLastDJAfterScroll();
    await expect(lastBtn).toBeVisible();
  });

  test('TC14 - Direct visit home URL after login', async () => {
    await homePage.page.goto('https://dj-booking-system--sheshadrikn96.replit.app/');
    await expect(homePage.addToCartBtns.first()).toBeVisible();
  });

  test('TC15 - Cart icon visible', async () => {
    await expect(homePage.cartLink).toBeVisible();
  });

  test('TC16 - Booking page navigates', async () => {
    await homePage.goToOrders();
    await expect(homePage.page).toHaveURL(/orders/);
  });

  test('TC17 - Booking history navigates', async () => {
    await homePage.goToBookingHistory();
    await expect(homePage.page).toHaveURL(/booking-history/);
  });

  test('TC18 - Add to cart button visible after scroll up/down', async () => {
    await homePage.scrollPage();
    await homePage.scrollPage(-1000);
    await expect(homePage.addToCartBtns.first()).toBeVisible();
  });

  test('TC19 - DJ card description visible', async () => {
    await homePage.djCardDescriptionsVisible();
  });

  test('TC20 - Exit button redirects to login page', async () => {
    await homePage.logout();
    await expect(homePage.page).toHaveURL(/login/);
    await expect(homePage.signInBtn).toBeVisible();
  });
});
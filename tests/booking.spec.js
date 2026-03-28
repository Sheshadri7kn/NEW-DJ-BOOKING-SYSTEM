import { test, expect } from '@playwright/test';
import { BookingPage } from '../pom/bookingPage';

const baseURL = 'https://dj-booking-system--sheshadrikn96.replit.app/';
const email = 'shesha627@gmail.com';
const password = 'Cit@12345';

test.describe('Booking Module - PulseBook Full Tests', () => {
  let booking;

  test.beforeEach(async ({ page }) => {
    booking = new BookingPage(page);
    await booking.login(baseURL, email, password);
    await booking.clearCart();
  });

  // ---------------- TEST CASES ----------------
  test('TC01 - Booking page loads from cart', async () => {
    await booking.addDJ();
    await booking.goToCart();
    await booking.openBooking();
    await expect(booking.page).toHaveURL(/booking/);
  });

  test('TC02 - Book without date shows error', async () => {
    await booking.addDJ();
    await booking.goToCart();
    await booking.book();
    await expect(booking.errorMsg).toContainText('Please select an event date');
  });

  test('TC03 - Book with valid future date', async () => {
    await booking.addDJ();
    await booking.goToCart();
    await booking.book(booking.getFutureDate(2));
    await expect(booking.errorMsg).toHaveCount(0);
  });

  test('TC04 - Book multiple DJs at once', async () => {
    await booking.addDJ(0);
    await booking.addDJ(1);
    await booking.goToCart();
    await booking.book(booking.getFutureDate(3));
    await expect(booking.page).toHaveURL(/booking/);
  });

  test('TC05 - Book same DJ twice', async () => {
    await booking.addDJ(0);
    await booking.addDJ(0);
    await booking.goToCart();
    await booking.book(booking.getFutureDate(2));
    await expect(booking.page).toHaveURL(/booking/);
  });

  test('TC06 - Cancel booking returns to cart', async () => {
    await booking.addDJ();
    await booking.goToCart();
    await booking.page.click('a[href="/cart"]');
    await expect(booking.page).toHaveURL(/cart/);
  });

  test('TC07 - Booking history shows recent booking', async () => {
    await booking.addDJ();
    await booking.goToCart();
    await booking.book(booking.getFutureDate(2));
    await booking.historyLink.click();
    await expect(booking.page.locator('h3').first()).toBeVisible();
  });


  test('TC09 - Booking confirmation shows DJ name and price', async () => {
    await booking.addDJ();
    await booking.goToCart();
    await booking.book(booking.getFutureDate(2));
    await expect(booking.price).toContainText('$');
    await expect(booking.djName.first()).toBeVisible();
  });

  test('TC10 - Logout redirects to login from booking', async () => {
    await booking.addDJ();
    await booking.goToCart();
    await booking.openBooking();
    await booking.logoutBtn.click();
    await expect(booking.page).toHaveURL(/login/);
  });

  test('TC11 - Add DJ after empty cart and book', async () => {
    await booking.addDJ();
    await booking.goToCart();
    await booking.book(booking.getFutureDate(2));
    await expect(booking.page).toHaveURL(/booking/);
  });

  test('TC12 - Scroll loads more DJs and booking works', async () => {
    await booking.scroll(2000);
    await booking.addDJ(2);
    await booking.goToCart();
    await booking.book(booking.getFutureDate(3));
    await expect(booking.page).toHaveURL(/booking/);
  });

  test('TC13 - Past date is blocked by input min validation', async () => {
    await booking.addDJ();
    await booking.goToCart();
    await booking.openBooking();
    await booking.dateInput.fill('2001-01-01');
    await booking.confirmBooking();
    await expect(booking.page).toHaveURL(/booking/);
  });

  test('TC14 - Sequential bookings of different DJs', async () => {
    await booking.addDJ(0);
    await booking.goToCart();
    await booking.book(booking.getFutureDate(2));

    await booking.page.goto(baseURL);
    await booking.addDJ(1);
    await booking.goToCart();
    await booking.book(booking.getFutureDate(3));

    await expect(booking.page).toHaveURL(/booking/);
  });

  test('TC15 - Booking with max number of DJs', async () => {
    const djCount = await booking.addToCartBtns.count();
    for (let i = 0; i < djCount; i++) {
      await booking.addDJ(i);
    }
    await booking.goToCart();
    await booking.book(booking.getFutureDate(5));
    await expect(booking.page).toHaveURL(/booking/);
  });
});
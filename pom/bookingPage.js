export class BookingPage {
  constructor(page) {
    this.page = page;

    // Login
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.signInBtn = page.locator('button:has-text("Sign In")');

    // Home / DJ list
    this.addToCartBtns = page.locator('button:has-text("Add to Cart")');

    // Cart
    this.cartLink = page.locator('a[href="/cart"]');
    this.removeBtns = page.locator('button:has-text("Remove")');

    // Booking
    this.bookNowBtn = page.locator('text=Book Now');
    this.dateInput = page.locator('input[type="date"]');
    this.confirmBookingBtn = page.locator('button:has-text("Confirm Booking")');

    // Navigation
    this.historyLink = page.locator('a[href="/booking-history"]');
    this.homeLink = page.locator('a[href="/"]');
    this.logoutBtn = page.getByRole('button', { name: /exit|logout/i });

    // Validation
    this.errorMsg = page.locator('p.text-destructive');

    // Booking result
    this.price = page.locator('p.text-3xl.font-bold.text-white');
    this.djName = page.locator('h3');
  }

  // ---------------- LOGIN ----------------
  async login(baseURL, email, password) {
    await this.page.goto(baseURL);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInBtn.click();

    await this.page.waitForSelector('button:has-text("Add to Cart")', {
      timeout: 60000,
    });
  }

  // ---------------- CART ----------------
  async addDJ(index = 0) {
    if ((await this.addToCartBtns.count()) > index) {
      await this.addToCartBtns.nth(index).click();
    }
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async clearCart() {
    const count = await this.removeBtns.count();
    for (let i = 0; i < count; i++) {
      await this.removeBtns.first().click();
    }
  }

  // ---------------- BOOKING ----------------
  async openBooking(index = 0) {
    await this.bookNowBtn.nth(index).click();
  }

  async selectDate(date) {
    if (date) {
      await this.dateInput.fill(date);
    }
  }

  async confirmBooking() {
    await this.confirmBookingBtn.click();
  }

  async book(date = null, index = 0) {
    await this.openBooking(index);
    await this.selectDate(date);
    await this.confirmBooking();
  }

  // ---------------- UTIL ----------------
  getFutureDate(days = 2) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  async scroll(y = 2000) {
    await this.page.mouse.wheel(0, y);
  }
}
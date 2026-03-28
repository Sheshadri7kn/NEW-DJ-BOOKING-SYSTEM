export class HomePage {
  constructor(page) {
    this.page = page;

    // Login selectors
    this.emailInput = page.getByRole('textbox', { name: 'dj@pulsebook.com' });
    this.passwordInput = page.getByRole('textbox', { name: '••••••••' });
    this.signInBtn = page.getByRole('button', { name: 'Sign In' });

    // Discover / DJ page selectors
    this.addToCartBtns = page.locator('button:has-text("Add to Cart")');
    this.cartLink = page.locator('a[href="/cart"]');
    this.ordersLink = page.locator('a[href="/orders"]');
    this.bookingHistoryLink = page.locator('a[href="/booking-history"]');
    this.logoutBtn = page.getByRole('button', { name: /exit|logout/i });
  }

  async login(email, password) {
    await this.page.goto('https://dj-booking-system--sheshadrikn96.replit.app/login');
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInBtn.click();
    await this.page.waitForSelector('button:has-text("Add to Cart")', { timeout: 20000 });
  }

  async addFirstDJToCart() {
    const firstBtn = this.addToCartBtns.first();
    await firstBtn.scrollIntoViewIfNeeded();
    await firstBtn.click();
    return firstBtn;
  }

  async addMultipleDJsToCart(indices = [0, 1, 2]) {
    for (const i of indices) {
      await this.addToCartBtns.nth(i).click();
    }
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async goToOrders() {
    await this.ordersLink.click();
  }

  async goToBookingHistory() {
    await this.bookingHistoryLink.click();
  }

  async logout() {
    await this.logoutBtn.click();
  }

  async scrollPage(amount = 2000) {
    await this.page.mouse.wheel(0, amount);
  }

  async setMobileViewport() {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async addLastDJAfterScroll() {
    await this.scrollPage(3000);
    const last = this.addToCartBtns.last();
    await last.click();
    return last;
  }

  async djCardDescriptionsVisible() {
    const cards = this.page.locator('div.p-5');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await cards.nth(i).locator('p').isVisible();
    }
  }
}
export class CartPage {
  constructor(page) {
    this.page = page;

    // Login selectors
    this.emailInput = page.getByRole('textbox', { name: 'dj@pulsebook.com' });
    this.passwordInput = page.getByRole('textbox', { name: '••••••••' });
    this.signInBtn = page.getByRole('button', { name: 'Sign In' });

    // Cart / discover selectors
    this.addToCartBtns = page.locator('button:has-text("Add to Cart")');
    this.cartLink = page.locator('a[href="/cart"]');
    this.bookNowBtns = page.locator('text=Book Now');
    this.removeBtns = page.locator('button[title="Remove from cart"]');
    this.cartItemName = page.locator('h3');
    this.cartItemImage = page.locator('img');
    this.homeLink = page.locator('a[href="/"]');
  }

  async login(email, password) {
    await this.page.goto('https://dj-booking-system--sheshadrikn96.replit.app/login');
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInBtn.click();
    await this.page.waitForSelector('button:has-text("Add to Cart")', { timeout: 30000 });
  }

  async addFirstItemToCart() {
    if ((await this.addToCartBtns.count()) > 0) {
      await this.addToCartBtns.first().click();
    }
  }

  async addMultipleItemsToCart(indices = [0, 1]) {
    for (const i of indices) {
      if ((await this.addToCartBtns.count()) > i) {
        await this.addToCartBtns.nth(i).click();
      }
    }
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async removeFirstItem() {
    if ((await this.removeBtns.count()) > 0) {
      await this.removeBtns.first().click();
    }
  }

  async removeAllItems() {
    let count = await this.removeBtns.count();
    while (count > 0) {
      await this.removeBtns.first().click();
      count = await this.removeBtns.count();
    }
  }

  async bookFirstItem() {
    if ((await this.bookNowBtns.count()) > 0) {
      await this.bookNowBtns.first().click();
    }
  }

  async navigateHome() {
    await this.homeLink.click();
  }
}
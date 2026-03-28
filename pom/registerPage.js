export class RegisterPage {
  constructor(page) {
    this.page = page;
    // Inputs
    this.nameInput = page.locator('input').nth(0);
    this.emailInput = page.locator('input').nth(1);
    this.passwordInput = page.locator('input').nth(2);

    // Buttons / Links
    this.signUpBtn = page.getByRole('button', { name: 'Sign Up' });
    this.signInLink = page.getByRole('link', { name: 'Sign in instead' });
  }

  async gotoRegister() {
    await this.page.goto('https://dj-booking-system--sheshadrikn96.replit.app/login');
    await this.page.getByRole('link', { name: 'Create one now' }).click();
    await this.signUpBtn.waitFor();
  }

  async fillName(name) {
    await this.nameInput.fill(name);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickSignUp() {
    await this.signUpBtn.click();
  }

  async clickSignInLink() {
    await this.signInLink.click();
  }

  async getEmailValidationMessage() {
    return await this.emailInput.evaluate(e => e.validationMessage);
  }
}
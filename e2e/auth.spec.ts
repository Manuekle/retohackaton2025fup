import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display login form", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: /iniciar sesión/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
  });

  test("should show validation errors for empty form", async ({ page }) => {
    await page.goto("/login");
    const submitButton = page.getByRole("button", { name: /entrar/i });
    await submitButton.click();

    // Wait for validation messages
    await expect(page.getByText(/email es requerido/i)).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/login");
    const registerLink = page.getByRole("link", { name: /regístrate/i });
    await registerLink.click();
    await expect(page).toHaveURL(/.*register/);
  });

  test("should display register form", async ({ page }) => {
    await page.goto("/register");
    await expect(
      page.getByRole("heading", { name: /registrarse/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/nombre/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
  });
});

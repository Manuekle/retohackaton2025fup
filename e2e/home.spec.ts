import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display the main title", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /reto hackaton 2025 fup/i }),
    ).toBeVisible();
  });

  test("should display the FUP logo", async ({ page }) => {
    await page.goto("/");
    const logo = page.locator('img[alt="Logo FUP"]');
    await expect(logo).toBeVisible();
  });

  test("should have a login button that navigates to login page", async ({
    page,
  }) => {
    await page.goto("/");
    const loginButton = page.getByRole("link", { name: /iniciar sesión/i });
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    await expect(page).toHaveURL(/.*login/);
  });

  test("should display sponsors carousel", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/nuestros sponsors/i)).toBeVisible();
  });
});

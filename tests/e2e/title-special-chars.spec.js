const { test, expect } = require("@playwright/test");
const { baseUrls } = require("./helpers/env");
const { brand } = require("./helpers/ui");

const specialTitle = "Grüße \"Tempo\" 'Österreich'";

test.describe("TITLE special characters", () => {
  test("page title supports umlauts and quotes", async ({ page }) => {
    await page.goto(`${baseUrls.standaloneTitle}/index.html`);
    await expect(page).toHaveTitle(specialTitle);
    await expect(brand(page)).toContainText(specialTitle);
  });
});

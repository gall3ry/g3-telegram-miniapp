import { Page } from "playwright";

export const getFromClipboard = async (page: Page) => {
  return await page.evaluate(() => {
    return navigator.clipboard.readText();
  });
};

import { Browser } from "playwright";
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";

chromium.use(stealth());
export const getNFTData = async (hash: string) => {
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const context = await browser.newContext({});
    const page = await context.newPage();

    await page.goto(`https://tonviewer.com/transaction/${hash}?section=trace`);
    await page.screenshot({ path: "g2 passed.png", fullPage: true });

    const owner = await page
      .locator(
        "xpath=//html/body/div[1]/div/div[3]/div/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[1]/div/div[2]/div[1]/div[2]/a"
      )
      .getAttribute("href");

    const nftAddress = await page
      .locator(
        "xpath=//html/body/div[1]/div/div[3]/div/div[1]/div[2]/div[2]/div[2]/div[2]/div/div[2]/div/div/div/div[1]/div/div[2]/div[1]/div[2]/a"
      )
      .getAttribute("href");

    if (!owner || !nftAddress) {
      throw new Error("Owner or NFT address not found");
    }

    return {
      owner: owner?.split("/").pop(),
      nftAddress: nftAddress?.split("/").pop(),
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (browser) {
      console.log("Closing browser");
      await browser.close();
    }
  }
};

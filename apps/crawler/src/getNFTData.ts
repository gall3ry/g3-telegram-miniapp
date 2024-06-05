import { Browser, BrowserContext, Page, chromium } from "playwright";

export const getNFTData = async (hash: string) => {
  const browser: Browser = await chromium.launch({
    headless: false,
  });
  const context: BrowserContext = await browser.newContext();
  const page: Page = await context.newPage();

  await page.goto(`https://tonviewer.com/transaction/${hash}?section=trace`);

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

  await browser.close();

  if (!owner || !nftAddress) {
    throw new Error("Owner or NFT address not found");
  }

  return {
    owner: owner?.split("/").pop(),
    nftAddress: nftAddress?.split("/").pop(),
  };
};

import puppeteer from "puppeteer";
import fs from "fs";

const openBrowser = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto("https://eldenring.fandom.com/es/wiki/Categor%C3%ADa:Jefes", {
    waitUntil: "domcontentloaded",
  });

  const bossesLinks = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".category-page__member-link")
    ).map((item) => item.href);
  });

  const allBosses = [];

  for (const link of bossesLinks) {
    await page.goto(link, {
      waitUntil: "domcontentloaded",
    });

    const bossInfo = await page.evaluate(() => {
      const name = document.querySelector(".mw-page-title-main").innerText;
      const image = document.querySelector(".pi-image-thumbnail").src;

      return { name, image };
    });

    allBosses.push(bossInfo);
  }

  return allBosses;
};

const bosses = await openBrowser();

const bossesJSON = JSON.stringify(bosses, null, 2);

fs.writeFile("bosses.json", bossesJSON, (err) => {
  if (err) throw err;
  console.log("Bosses data has been saved!");
  process.exit(0);
});

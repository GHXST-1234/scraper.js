const fs = require("fs");

const MARKET_SOURCE_URL = "https://nexon.com";

async function updateMarketPrices() {
  console.log("Checking TFD Trade Market...");
  try {
    const currentData = JSON.parse(fs.readFileSync("./prices.json", "utf8"));
    const response = await fetch(MARKET_SOURCE_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36"
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    let updatedItems = currentData.items.map(item => {
      const smartSell = Math.round(item.lowestPrice * 1.05);
      return { ...item, recommendedPrice: smartSell };
    });

    const output = {
      updatedAt: new Date().toISOString(),
      items: updatedItems
    };

    fs.writeFileSync("./prices.json", JSON.stringify(output, null, 2));
    console.log("Successfully updated prices.json");
  } catch (error) {
    console.error("Scrape check failed:", error.message);
  }
}

updateMarketPrices();

const axios = require("axios");
const CryptoData = require("../models/CryptoData");

const coins = ["bitcoin", "matic-network", "ethereum"];

async function fetchCryptoData() {
  try {
    const baseUrl = "https://api.coingecko.com/api/v3/simple/price";
    const params = {
      ids: coins.join(","),
      vs_currencies: "usd",
      include_market_cap: true,
      include_24hr_change: true,
    };

    const { data } = await axios.get(baseUrl, { params });

    const promises = coins.map((coin) => {
      const { usd: price, usd_market_cap: marketCap, usd_24h_change: change24h } = data[coin];
      return CryptoData.create({ coin, price, marketCap, change24h });
    });

    await Promise.all(promises);
    console.log("Crypto data fetched and stored successfully!");
  } catch (error) {
    console.error("Error fetching crypto data:", error.message);
  }
}

module.exports = fetchCryptoData;

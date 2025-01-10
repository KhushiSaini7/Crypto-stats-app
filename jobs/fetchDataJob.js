const axios = require("axios");
const CryptoData = require("../models/CryptoData");

const coins = ["bitcoin", "matic-network", "ethereum"];

async function fetchCryptoData() {
  try {
    // Construct the API URL with the required coins and vs_currencies
    const baseUrl = "https://api.coingecko.com/api/v3/simple/price";
    const params = {
      ids: coins.join(","), // Join coins array as comma-separated string
      vs_currencies: "usd",
      include_market_cap: true,
      include_24hr_change: true,
    };

    // Fetch data from CoinGecko API
    const { data } = await axios.get(baseUrl, { params });

    // Loop through the coins and store them in the database
    const promises = coins.map((coin) => {
      const { usd: price, usd_market_cap: marketCap, usd_24h_change: change24h } = data[coin];

      // Create a new document in the CryptoData collection
      return CryptoData.create({ coin, price, marketCap, change24h });
    });

    // Wait for all database insertions to complete
    await Promise.all(promises);

    console.log("Crypto data fetched and stored successfully!");
  } catch (error) {
    console.error("Error fetching crypto data:", error.message);
  }
}

module.exports = fetchCryptoData;

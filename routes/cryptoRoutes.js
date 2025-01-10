const express = require("express");
const CryptoData = require("../models/CryptoData");
const { calculateStandardDeviation } = require("../utils/fetchCryptoData");
const router = express.Router();

router.get("/stats", async (req, res) => {
  const { coin } = req.query;

  if (!coin) return res.status(400).json({ error: "Coin parameter is required." });

  try {
    const latestData = await CryptoData.findOne({ coin }).sort({ timestamp: -1 });
    if (!latestData) return res.status(404).json({ error: "No data found for the specified coin." });

    res.json({
      price: latestData.price,
      marketCap: latestData.marketCap,
      "24hChange": latestData.change24h,
    });
  } catch (error) {
    console.error("Error fetching stats:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/deviation", async (req, res) => {
  const { coin } = req.query;

  if (!coin) return res.status(400).json({ error: "Coin parameter is required." });

  try {
    const data = await CryptoData.find({ coin }).sort({ timestamp: -1 }).limit(100);
    if (data.length === 0) return res.status(404).json({ error: "No data found for the specified coin." });

    const prices = data.map((record) => record.price);
    const deviation = calculateStandardDeviation(prices);

    res.json({ deviation });
  } catch (error) {
    console.error("Error calculating deviation:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;

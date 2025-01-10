const mongoose = require("mongoose");

const cryptoDataSchema = new mongoose.Schema({
  coin: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  marketCap: { type: Number, required: true },
  change24h: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model("CryptoData", cryptoDataSchema);

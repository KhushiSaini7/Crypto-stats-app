require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const cryptoRoutes = require("./routes/cryptoRoutes");
const fetchCryptoData = require("./jobs/fetchDataJob");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", cryptoRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

cron.schedule("0 */2 * * *", () => {
  console.log("Running crypto fetch job...");
  fetchCryptoData();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  fetchCryptoData(); // Fetch initial data
});

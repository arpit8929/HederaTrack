require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5000;
const MIRROR_NODE_API = process.env.MIRROR_NODE_API;

// Fetch latest transactions
app.get("/transactions", async (req, res) => {
  try {
    const response = await axios.get(`${MIRROR_NODE_API}/transactions`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

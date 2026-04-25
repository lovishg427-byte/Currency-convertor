const cors = require("cors");
const express = require("express");
const axios = require("axios");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json()); // 🔥 required for POST

const USERS_FILE = "users.json";


// ======================
// 🔐 AUTH ROUTES
// ======================

// Signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ message: "All fields required" });
  }

  let users = [];

  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  }

  if (users.find(u => u.username === username)) {
    return res.json({ message: "User already exists" });
  }

  users.push({ username, password });

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ message: "Signup successful ✅" });
});


// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  let users = [];

  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  }

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    res.json({ success: true, message: "Login successful ✅" });
  } else {
    res.json({ success: false, message: "Invalid credentials ❌" });
  }
});


// ======================
// 💱 CURRENCY ROUTE
// ======================

app.get("/convert", async (req, res) => {
  const { from, to, amount } = req.query;

  try {
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    );

    const rate = response.data.rates[to];
    const result = rate * amount;

    res.json({
      from,
      to,
      amount,
      rate,
      result,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching exchange rate" });
  }
});


// ======================
// 🏠 DEFAULT ROUTE
// ======================

app.get("/", (req, res) => {
  res.send("Currency API + Auth is running 🚀");
});


// ======================
// 🚀 START SERVER
// ======================

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
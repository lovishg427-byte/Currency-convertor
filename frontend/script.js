// 🔐 Protect route
if (!localStorage.getItem("user")) {
  window.location.replace("login.html");
}

// 👋 Show username
const user = localStorage.getItem("user");
if (user) {
  const el = document.getElementById("welcomeUser");
  if (el) el.innerText = "👋 Welcome, " + user;
}

// ✅ Relative API (works on Render)
const API_URL = "/convert";

// 🌍 Currency list
const currencyList = [
  "USD","INR","EUR","GBP","JPY","AUD","CAD","CHF","CNY","SGD",
  "NZD","ZAR","AED","SAR","HKD","KRW","THB","MYR","IDR","BRL"
];

// 🔹 Load currencies
function loadCurrencies() {
  const from = document.getElementById("fromCurrency");
  const to = document.getElementById("toCurrency");

  from.innerHTML = "";
  to.innerHTML = "";

  currencyList.forEach(curr => {
    from.add(new Option(curr, curr));
    to.add(new Option(curr, curr));
  });

  from.value = "USD";
  to.value = "INR";
}

// 🔁 Convert
async function convert() {
  const amount = document.getElementById("amount").value;
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;

  const resultEl = document.getElementById("result");
  const rateEl = document.getElementById("rate");
  const timeEl = document.getElementById("time");
  const btn = document.getElementById("convertBtn");

  if (!amount || amount <= 0) {
    resultEl.innerText = "Enter valid amount";
    return;
  }

  if (from === to) {
    resultEl.innerText = "Same currency selected";
    return;
  }

  try {
    resultEl.innerText = "⏳ Converting...";
    btn.disabled = true;

    const res = await fetch(
      `${API_URL}?from=${from}&to=${to}&amount=${amount}`
    );

    // 🔥 FIX: handle bad responses
    if (!res.ok) {
      throw new Error("Server response not OK");
    }

    const data = await res.json();

    if (!data.result) {
      resultEl.innerText = "Invalid conversion";
      return;
    }

    const formatted = new Intl.NumberFormat().format(data.result);
    const now = new Date().toLocaleTimeString();

    resultEl.innerText = `${amount} ${from} = ${formatted} ${to}`;
    rateEl.innerText = `Rate: 1 ${from} = ${data.rate} ${to}`;
    timeEl.innerText = `Updated at: ${now}`;

    saveHistory(`${amount} ${from} → ${to} = ${formatted}`);
    loadHistory();

  } catch (err) {
    console.error("❌ Convert error:", err);
    resultEl.innerText = "❌ Server error";
  } finally {
    btn.disabled = false;
  }
}

// 🔁 Swap
function swap() {
  const from = document.getElementById("fromCurrency");
  const to = document.getElementById("toCurrency");

  [from.value, to.value] = [to.value, from.value];
  convert();
}

// 🧹 Clear
function clearAll() {
  document.getElementById("amount").value = "";
  document.getElementById("result").innerText = "";
  document.getElementById("rate").innerText = "";
  document.getElementById("time").innerText = "";
}

// 📜 History
function saveHistory(entry) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift(entry);
  localStorage.setItem("history", JSON.stringify(history.slice(0, 5)));
}

function loadHistory() {
  const historyEl = document.getElementById("history");
  let history = JSON.parse(localStorage.getItem("history")) || [];
  historyEl.innerHTML = history.map(item => `<p>${item}</p>`).join("");
}

// ⭐ Favorites
function addFavorite() {
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;

  let favs = JSON.parse(localStorage.getItem("favs")) || [];
  const pair = `${from} → ${to}`;

  if (!favs.includes(pair)) {
    favs.push(pair);
    localStorage.setItem("favs", JSON.stringify(favs));
    loadFavorites();
  }
}

function loadFavorites() {
  const favEl = document.getElementById("favorites");
  let favs = JSON.parse(localStorage.getItem("favs")) || [];
  favEl.innerHTML = favs.map(f => `<p>${f}</p>`).join("");
}

// 🌙 Theme
function toggleTheme() {
  document.body.classList.toggle("light");
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// 🚀 Init
loadCurrencies();
loadHistory();
loadFavorites();
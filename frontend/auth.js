const API = "";

// 🔐 Signup
async function signup() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  // 🛑 Validation
  if (!username || !password) {
    msg.innerText = "Please enter all fields";
    return;
  }

  try {
    msg.innerText = "Signing up...";

    const res = await fetch(`${API}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    msg.innerText = data.message;

  } catch (error) {
    console.error(error);
    msg.innerText = "❌ Server error. Try again.";
  }
}


// 🔐 Login
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  // 🛑 Validation
  if (!username || !password) {
    msg.innerText = "Please enter all fields";
    return;
  }

  try {
    msg.innerText = "Logging in...";

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", username);

      // ✅ Redirect
      window.location.href = "index.html";
    } else {
      msg.innerText = data.message || "Login failed";
    }

  } catch (error) {
    console.error(error);
    msg.innerText = "❌ Server not reachable";
  }
}
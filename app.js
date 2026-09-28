// -------------------------
// BACKEND URL
// -------------------------
const API = "https://gymtracker-backend-2.onrender.com/api";

// -------------------------
// HAMBURGER MENU TOGGLE
// -------------------------
const ham = document.getElementById("hamburger");
const menu = document.getElementById("sideMenu");

if (ham && menu) {
  ham.addEventListener("click", () => {
    menu.classList.toggle("open");
    ham.classList.toggle("active");
  });
}

// -------------------------
// LOGOUT
// -------------------------
function logout() {
  localStorage.removeItem("token");
  window.location = "index.html";
}

// -------------------------
// LOGIN (BACKEND → SUPABASE)
// -------------------------
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = loginUser.value;
  const password = loginPass.value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location = "dashboard.html";
  } else {
    alert("Invalid login");
  }
});

// -------------------------
// REGISTER (BACKEND → SUPABASE)
// -------------------------
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = regUser.value;
  const password = regPass.value;

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    alert("Account created! You can log in now.");
    showLogin();
  } else {
    alert("Registration failed.");
  }
});

// -------------------------
// ADD EXERCISE LOG
// -------------------------
document.getElementById("exerciseForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const selected = document.getElementById("exerciseSelect").value;
  const typed = document.getElementById("newExercise").value.trim();
  const name = typed !== "" ? typed : selected;

  if (!name) {
    alert("Choose an exercise or type a new one.");
    return;
  }

  const weight = document.getElementById("weight").value;
  const reps = document.getElementById("reps").value;

  const token = localStorage.getItem("token");

  await fetch(`${API}/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name, weight, reps })
  });

  document.getElementById("newExercise").value = "";
  loadWorkoutDates();
});

// -------------------------
// LOAD WORKOUT DATES
// -------------------------
async function loadWorkoutDates() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/dates`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const dates = await res.json();

  const list = document.getElementById("exerciseList");
  list.innerHTML = "";

  dates.forEach(day => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3 style="cursor:pointer; text-decoration:underline;"
          onclick="viewDay('${day.date}')">
          Workout: ${day.date}
      </h3>
    `;

    list.appendChild(div);
  });
}

// -------------------------
// VIEW ALL LOGS FOR A SPECIFIC DAY
// -------------------------
async function viewDay(date) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/day/${date}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const logs = await res.json();

  const list = document.getElementById("exerciseList");
  list.innerHTML = `<h2>Workout for ${date}</h2>`;

  logs.forEach(log => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${log.name}</h3>
      <p>${log.weight} lbs × ${log.reps} reps</p>
      <p>${log.created_at}</p>
    `;
    list.appendChild(div);
  });
}

// -------------------------
// OPTIONAL: Manual date selector
// -------------------------
async function viewSelectedDate() {
  const date = document.getElementById("viewDate").value;
  if (!date) return;
  viewDay(date);
}

// -------------------------
// INITIAL LOAD
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("dashboard.html")) {
    loadWorkoutDates();
  }
});

// -------------------------
// HAMBURGER MENU TOGGLE (SAFE FOR ALL PAGES)
// -------------------------
const ham = document.getElementById("hamburger");
if (ham) {
  ham.addEventListener("click", () => {
    const menu = document.getElementById("sideMenu");
    menu.style.right = menu.style.right === "0px" ? "-250px" : "0px";
  });
}

// Placeholder functions for menu items
function openPersonalBests() {
  alert("Personal Bests page coming soon!");
}

function openSettings() {
  alert("Settings page coming soon!");
}

function logout() {
  localStorage.removeItem("token");
  window.location = "index.html";
}



// -------------------------
// LOGIN
// -------------------------
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = loginUser.value;
  const password = loginPass.value;

  const res = await fetch("https://gymtracker-backend-2.onrender.com/api/login", {
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
// REGISTER
// -------------------------
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = regUser.value;
  const password = regPass.value;

  const res = await fetch("https://gymtracker-backend-2.onrender.com/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    alert("Account created! You can log in now.");
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

  await fetch("https://gymtracker-backend-2.onrender.com/api/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify({ name, weight, reps })
  });

  document.getElementById("newExercise").value = "";

  loadWorkoutDates(); // refresh dates instead of exercises
});



// -------------------------
// LOAD WORKOUT DATES
// -------------------------
async function loadWorkoutDates() {
  const res = await fetch("https://gymtracker-backend-2.onrender.com/api/dates", {
    headers: { "Authorization": localStorage.getItem("token") }
  });

  const dates = await res.json();

  const list = document.getElementById("exerciseList");
  list.innerHTML = "<h2>Workout Dates</h2>";

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
  const res = await fetch(`https://gymtracker-backend-2.onrender.com/api/day/${date}`, {
    headers: { "Authorization": localStorage.getItem("token") }
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
      <p>${log.timestamp}</p>
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
    loadWorkoutDates(); // load dates instead of exercises
  }
});

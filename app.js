// -------------------------
// SUPABASE CLIENT
// -------------------------
const supabase = supabase.createClient(
  "https://nregienioaozuetrnsof.supabase.co",
  "YOUR_ANON_KEY_HERE"
);

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

// Placeholder functions
function openPersonalBests() {
  alert("Personal Bests page coming soon!");
}

function openSettings() {
  alert("Settings page coming soon!");
}

async function logout() {
  await supabase.auth.signOut();
  localStorage.removeItem("token");
  window.location = "index.html";
}

// -------------------------
// LOGIN (SUPABASE AUTH)
// -------------------------
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginUser.value;
  const password = loginPass.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Invalid login");
    return;
  }

  const token = data.session.access_token;
  localStorage.setItem("token", token);

  window.location = "dashboard.html";
});

// -------------------------
// REGISTER (SUPABASE AUTH)
// -------------------------
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = regUser.value;
  const password = regPass.value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert("Registration failed.");
    return;
  }

  alert("Account created! You can log in now.");
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

  await fetch("https://gymtracker-backend-2.onrender.com/api/log", {
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

  const res = await fetch("https://gymtracker-backend-2.onrender.com/api/dates", {
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

  const res = await fetch(`https://gymtracker-backend-2.onrender.com/api/day/${date}`, {
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
    loadWorkoutDates();
  }
});

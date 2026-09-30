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

function openSettings() {
  window.location = "settings.html";
}

// -------------------------
// LOGOUT
// -------------------------
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
// REGISTER
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
  loadExercises();
});

// -------------------------
// LOAD EXERCISES
// -------------------------
async function loadExercises() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/exercises`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const exercises = await res.json();

  const select = document.getElementById("exerciseSelect");
  select.innerHTML = `<option value="">-- Select Exercise --</option>`;

  exercises.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

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

      <button class="deleteLog" data-id="${log.id}" style="
        margin-top: 10px;
        background: #c62828;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
      ">
        Delete
      </button>
    `;

    list.appendChild(div);
  });
}

// -------------------------
// DELETE WORKOUT LOG
// -------------------------
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("deleteLog")) {
    const id = e.target.dataset.id;
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/log/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.success) {
      e.target.parentElement.remove();
    } else {
      alert("Error deleting log");
    }
  }
});

// -------------------------
// LOAD USER SETTINGS (THEME)
// -------------------------
async function loadSettings() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch(`${API}/profile/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const settings = await res.json();

  // Apply button color
  if (settings.button_color) {
    document.documentElement.style.setProperty("--button-color", settings.button_color);

    // Apply to all buttons
    document.querySelectorAll("button").forEach(btn => {
      btn.style.backgroundColor = settings.button_color;
    });
  }

  // Apply background color
  if (settings.background_color) {
    document.body.style.background = settings.background_color;
  }
}

// -------------------------
// INITIAL LOAD
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("dashboard.html")) {
    loadExercises();
    loadWorkoutDates();
    loadSettings(); // THEME LOAD
  }
});

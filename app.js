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

  loadExercises();
});

// -------------------------
// LOAD EXERCISES
// -------------------------
async function loadExercises() {
  const res = await fetch("https://gymtracker-backend-2.onrender.com/api/exercises", {
    headers: { "Authorization": localStorage.getItem("token") }
  });

  const exercises = await res.json();

  // Populate dropdown
  const dropdown = document.getElementById("exerciseSelect");
  dropdown.innerHTML = `<option value="">-- Select Exercise --</option>`;

  exercises.forEach(ex => {
    const option = document.createElement("option");
    option.value = ex.name;
    option.textContent = ex.name;
    dropdown.appendChild(option);
  });

  // Populate exercise list
  const list = document.getElementById("exerciseList");
  list.innerHTML = "";

  exercises.forEach(ex => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${ex.name}</h3>

      <p onclick="viewDay('${ex.last_timestamp}')"
         style="cursor:pointer; text-decoration:underline;">
         Last logged: ${ex.last_weight} lbs × ${ex.last_reps} reps
      </p>

      <button onclick="viewHistory('${ex.name}')">View History</button>
    `;

    list.appendChild(div);
  });
}

// -------------------------
// VIEW FULL HISTORY FOR A LIFT
// -------------------------
async function viewHistory(name) {
  const res = await fetch(`https://gymtracker-backend-2.onrender.com/api/history/${name}`, {
    headers: { "Authorization": localStorage.getItem("token") }
  });

  const history = await res.json();

  const list = document.getElementById("exerciseList");
  list.innerHTML = `<h2>${name} History</h2>`;

  history.forEach(log => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p><strong>Date:</strong> ${log.timestamp}</p>
      <p><strong>Weight:</strong> ${log.weight} lbs</p>
      <p><strong>Reps:</strong> ${log.reps}</p>
    `;
    list.appendChild(div);
  });
}

// -------------------------
// VIEW ALL LOGS FOR A SPECIFIC DAY
// -------------------------
async function viewDay(timestamp) {
  const date = timestamp.split(" ")[0]; // YYYY-MM-DD

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
// INITIAL LOAD
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("dashboard.html")) {
    loadExercises();
  }
});

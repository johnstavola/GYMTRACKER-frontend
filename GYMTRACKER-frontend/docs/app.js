// -------------------------
// LOGIN
// -------------------------
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = loginUser.value;
  const password = loginPass.value;

  const res = await fetch("http://localhost:3000/api/login", {

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

  const res = await fetch("http://localhost:3000/api/register", {

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

  const name = document.getElementById("name").value;
  const weight = document.getElementById("weight").value;
  const reps = document.getElementById("reps").value;

  await fetch("http://localhost:3000/api/log", {

    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify({ name, weight, reps })
  });

  loadExercises();
});

// -------------------------
// LOAD EXERCISES
// -------------------------
async function loadExercises() {
  const res = await fetch("http://localhost:3000/api/exercises", {

    headers: { "Authorization": localStorage.getItem("token") }
  });

  const exercises = await res.json();

  const list = document.getElementById("exerciseList");
  list.innerHTML = "";

  exercises.forEach(ex => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${ex.name}</h3>
      <p>Last logged: ${ex.last_weight} lbs × ${ex.last_reps} reps</p>
    `;
    list.appendChild(div);
  });
}
// Load exercises immediately when dashboard opens
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("dashboard.html")) {
    loadExercises();
  }
});

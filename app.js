// -------------------------
// HAMBURGER MENU TOGGLE
// -------------------------
document.getElementById("hamburger")?.addEventListener("click", () => {
  const menu = document.getElementById("sideMenu");
  menu.style.right = menu.style.right === "0px" ? "-250px" : "0px";
});

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

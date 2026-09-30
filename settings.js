const API = "https://gymtracker-backend-2.onrender.com/api";

async function saveSettings() {
  const buttonColor = document.getElementById("buttonColor").value;
  const backgroundColor = document.getElementById("backgroundColor").value;

  const token = localStorage.getItem("token");

 await fetch(`${API}/profile/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ buttonColor, backgroundColor })
  });

  alert("Settings saved!");
}

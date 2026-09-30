async function saveSettings() {
  const buttonColor = document.getElementById("buttonColor").value;
  const backgroundColor = document.getElementById("backgroundColor").value;

  const token = localStorage.getItem("token");
  console.log("Token:", token);

  await fetch("https://gymtracker-backend-2.onrender.com/profile/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ buttonColor, backgroundColor })
  });

  alert("Settings saved!");
}

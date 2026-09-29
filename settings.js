async function saveSettings() {
  const token = localStorage.getItem("token");

  const buttonColor = document.getElementById("buttonColor").value;
  const backgroundColor = document.getElementById("backgroundColor").value;

  await fetch("/profile/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      button_color: buttonColor,
      background_color: backgroundColor
    })
  });

  alert("Settings saved!");
}

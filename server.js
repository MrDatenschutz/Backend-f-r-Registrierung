const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

// Startseite: register.html ausliefern
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

// Registrierung
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, error: "Benutzername und Passwort erforderlich" });
  }

  const stars = "*".repeat(password.length);
  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];

  const entry = `[${timestamp}] Benutzername: ${username} | Passwort: ${stars}\n`;

  fs.appendFile(path.join(__dirname, "users.txt"), entry, (err) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, error: "Fehler beim Speichern" });
    }

    res.json({ success: true });
  });
});

app.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

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

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const entry = `${username}:${password}`;

  fs.readFile(path.join(__dirname, "users.txt"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Fehler beim Lesen");
    }

    const lines = data.split("\n");
    const match = lines.find(line => line.includes(`Benutzername: ${username}`));

    if (match) {
      res.send("Login erfolgreich");
    } else {
      res.status(401).send("Benutzername oder Passwort falsch");
    }
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
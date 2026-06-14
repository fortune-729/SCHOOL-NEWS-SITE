const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const USERS_FILE = "users.json";

// ensure file exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]");
}

// REGISTER
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    let users = JSON.parse(fs.readFileSync(USERS_FILE));

    if (users.find(u => u.username === username)) {
        return res.send("User already exists. Go back and login.");
    }

    users.push({ username, password });

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    res.redirect("/login.html");
});

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    let users = JSON.parse(fs.readFileSync(USERS_FILE));

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (user) {
        res.redirect("/home.html");
    } else {
        res.send("Invalid credentials");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
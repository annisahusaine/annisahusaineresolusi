// Import modules
const express = require("express");
const session = require("express-session");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "pt_sejahtera_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pt_sejahtera",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected!");
});

// Routes

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to PT Sejahtera Management System!");
});

// Create a new fish stock
app.post("/pasokan", (req, res) => {
  const { jenis_ikan, jumlah } = req.body;
  const sql = "INSERT INTO pasokan (jenis_ikan, jumlah) VALUES (?, ?)";
  db.query(sql, [jenis_ikan, jumlah], (err, result) => {
    if (err) throw err;
    res.json({ message: "Pasokan berhasil ditambahkan", id: result.insertId });
  });
});

// Get all fish stock
app.get("/pasokan", (req, res) => {
  const sql = "SELECT * FROM pasokan";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update fish stock
app.put("/pasokan/:id", (req, res) => {
  const { id } = req.params;
  const { jumlah } = req.body;
  const sql = "UPDATE pasokan SET jumlah = ? WHERE id = ?";
  db.query(sql, [jumlah, id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Pasokan berhasil diperbarui" });
  });
});

// Delete fish stock
app.delete("/pasokan/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM pasokan WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Pasokan berhasil dihapus" });
  });
});

// Record a sale transaction
app.post("/transaksi", (req, res) => {
  const { jenis_ikan, jumlah_terjual, harga_total } = req.body;
  const sql =
    "INSERT INTO transaksi (jenis_ikan, jumlah_terjual, harga_total) VALUES (?, ?, ?)";
  db.query(sql, [jenis_ikan, jumlah_terjual, harga_total], (err, result) => {
    if (err) throw err;
    res.json({ message: "Transaksi berhasil dicatat", id: result.insertId });
  });
});

// Get all transactions
app.get("/transaksi", (req, res) => {
  const sql = "SELECT * FROM transaksi";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Session example
app.get("/session", (req, res) => {
  if (!req.session.username) {
    req.session.username = "admin";
    res.send("Session created for admin.");
  } else {
    res.send(`Welcome back, ${req.session.username}`);
  }
});

// Logout session
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.send("Logged out successfully.");
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

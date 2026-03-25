const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
pool.connect()
  .then(() => console.log("Database Connected Successfully"))
  .catch(err => console.log("Database Connection Error:", err));

// Create table automatically
pool.query(`
  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    message TEXT
  );
`)
.then(() => console.log("Table created"))
.catch(err => console.log(err));

app.get("/db-test", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");
    res.send("Database Working");
  } catch (err) {
    res.send("Database Error");
  }
});

// test route
app.get("/", (req, res) => {
  res.send("Server running");
});

// contact form route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await pool.query(
      "INSERT INTO messages(name,email,message) VALUES($1,$2,$3)",
      [name, email, message]
    );

    res.send("Message saved successfully");
  } catch (err) {
    console.log(err);
    res.send("Error saving message");
  }
});

// Render port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// api/index.js

const express = require("express");
const mysql = require("mysql2");

const app = express();

const dbConfig = require("../config/database");

// MySQL Connection Configuration
const connection = mysql.createConnection(dbConfig);

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Fetch all users
app.get("/api/users", (req, res) => {
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error fetching users" });
      throw error;
    }
    res.json(results);
  });
});

// Fetch all categories
app.get("/api/categories", (req, res) => {
  connection.query("SELECT * FROM categories", (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error fetching categories" });
      throw error;
    }
    res.json(results);
  });
});

// Fetch all products with user and category details
app.get("/api/products", (req, res) => {
  connection.query(
    `
    SELECT
      p.product_name AS ProductName,
      c.category_name AS Category,
      u.username AS CreatedBy,
      p.image AS Image
    FROM
      products p
    JOIN
      categories c ON p.category_id = c.category_id
    JOIN
      users u ON p.user_id = u.user_id;
  `,
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Error fetching products" });
        throw error;
      }
      res.json(results);
    }
  );
});

// Start the server
const PORT = 3000; // Or any port you prefer
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

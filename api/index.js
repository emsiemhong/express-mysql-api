// api/index.js
const cors = require("cors");
const express = require("express");
const mysql = require("mysql2");

const app = express();

var corsOptions = {
  credentials: true,
  origin: "http://localhost:4200",
};

app.use(cors(corsOptions));

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

// Route to get total count of users
app.get('/api/totalUsers', (req, res) => {
  connection.query('SELECT COUNT(*) AS total_users FROM users', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error fetching total users' });
      throw error;
    }
    res.json({ totalUsers: results[0].total_users });
  });
});

// Route to get total count of products
app.get('/api/totalProducts', (req, res) => {
  connection.query('SELECT COUNT(*) AS total_products FROM products', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error fetching total products' });
      throw error;
    }
    res.json({ totalProducts: results[0].total_products });
  });
});

// Route to get total count of categories
app.get('/api/totalCategories', (req, res) => {
  connection.query('SELECT COUNT(*) AS total_categories FROM categories', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error fetching total categories' });
      throw error;
    }
    res.json({ totalCategories: results[0].total_categories });
  });
});

// Route to get top product sales
app.get("/api/topProductSales", (req, res) => {
  connection.query(
    `
    SELECT
        p.product_id,
        p.product_name,
        SUM(s.sale_quantity) AS total_quantity_sold,
        SUM(s.sale_amount) AS total_sales_amount
    FROM
        products p
    JOIN
        sales s ON p.product_id = s.product_id
    GROUP BY
        p.product_id, p.product_name
    ORDER BY
        total_sales_amount DESC
    LIMIT 10;
  `,
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Error fetching top 10 product sales" });
        throw error;
      }
      res.json(results);
    }
  );
});

// Route to get sales amount by category for pie chart
app.get('/api/salesByCategory', (req, res) => {
  connection.query(
    `
    SELECT
        c.category_name,
        CAST(SUM(s.sale_amount) AS DECIMAL(10, 2)) AS total_sales_amount
    FROM
        categories c
    LEFT JOIN
        products p ON c.category_id = p.category_id
    LEFT JOIN
        sales s ON p.product_id = s.product_id
    GROUP BY
        c.category_name;
  `,
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Error fetching sales by category" });
        throw error;
      }
      res.json(results);
    }
  );
});

// Route to get sales trend by month for line chart
app.get('/api/salesByMonth', (req, res) => {
  connection.query(`
    SELECT
        CONCAT(SUBSTRING(MONTHNAME(s.sale_date), 1, 3)) AS sales_month,
        SUM(s.sale_amount) AS total_sales_amount
    FROM
        sales s
    GROUP BY
        sales_month
    ORDER BY
        MIN(s.sale_date);
  `, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error fetching sales by month' });
      throw error;
    }
    res.json(results);
  });
});

// Start the server
const PORT = 3000; // Or any port you prefer
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

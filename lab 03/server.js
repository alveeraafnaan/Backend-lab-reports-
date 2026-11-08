
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let db;

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Lab 03 REST API",
    endpoints: [
      "GET /books",
      "GET /books/:bookId",
      "POST /books",
      "PUT /books/:bookId",
      "DELETE /books/:bookId",
    ],
  });
});

// Get all books with search, sorting, pagination, and price filters
app.get("/books", async (req, res) => {
  try {
    const {
      search_q = "",
      order_by = "id",
      order = "ASC",
      limit = "10",
      offset = "0",
      min_price,
      max_price,
    } = req.query;

    const allowedColumns = ["id", "title", "author", "price", "pages"];

    if (!allowedColumns.includes(order_by)) {
      return res.status(400).json({
        message: "Invalid order_by value",
      });
    }

    const sortOrder = order.toUpperCase();

    if (!["ASC", "DESC"].includes(sortOrder)) {
      return res.status(400).json({
        message: "order must be ASC or DESC",
      });
    }

    const limitValue = Number(limit);
    const offsetValue = Number(offset);

    if (
      !Number.isInteger(limitValue) ||
      limitValue <= 0 ||
      !Number.isInteger(offsetValue) ||
      offsetValue < 0
    ) {
      return res.status(400).json({
        message: "limit must be positive and offset must be non-negative",
      });
    }

    if (
      (min_price !== undefined && !Number.isFinite(Number(min_price))) ||
      (max_price !== undefined && !Number.isFinite(Number(max_price)))
    ) {
      return res.status(400).json({
        message: "Price filters must be numeric",
      });
    }

    if (
      min_price !== undefined &&
      max_price !== undefined &&
      Number(min_price) > Number(max_price)
    ) {
      return res.status(400).json({
        message: "min_price cannot be greater than max_price",
      });
    }

    let sql = "SELECT * FROM book WHERE title LIKE ?";
    const params = [`%${search_q}%`];

    if (min_price !== undefined) {
      sql += " AND price >= ?";
      params.push(Number(min_price));
    }

    if (max_price !== undefined) {
      sql += " AND price <= ?";
      params.push(Number(max_price));
    }

    sql += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(limitValue, offsetValue);

    const books = await db.all(sql, params);

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get a book by ID
app.get("/books/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Create a new book
app.post("/books", async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;

    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof author !== "string" ||
      author.trim() === "" ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price))
    ) {
      return res.status(400).json({
        message: "title, author, and a numeric price are required",
      });
    }

    if (
      pages !== undefined &&
      (!Number.isInteger(Number(pages)) || Number(pages) < 0)
    ) {
      return res.status(400).json({
        message: "pages must be a non-negative integer",
      });
    }

    const result = await db.run(
      `INSERT INTO book (title, author, price, pages)
       VALUES (?, ?, ?, ?)`,
      [
        title.trim(),
        author.trim(),
        Number(price),
        pages === undefined ? null : Number(pages),
      ]
    );

    const newBook = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [result.lastID]
    );

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Update a book
app.put("/books/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, price, pages } = req.body;

    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof author !== "string" ||
      author.trim() === "" ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price))
    ) {
      return res.status(400).json({
        message: "title, author, and a numeric price are required",
      });
    }

    if (
      pages !== undefined &&
      (!Number.isInteger(Number(pages)) || Number(pages) < 0)
    ) {
      return res.status(400).json({
        message: "pages must be a non-negative integer",
      });
    }

    const result = await db.run(
      `UPDATE book
       SET title = ?, author = ?, price = ?, pages = ?
       WHERE id = ?`,
      [
        title.trim(),
        author.trim(),
        Number(price),
        pages === undefined ? null : Number(pages),
        bookId,
      ]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const updatedBook = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Delete a book
app.delete("/books/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    const result = await db.run(
      "DELETE FROM book WHERE id = ?",
      [bookId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Initialize database and start server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, "database.db"),
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price REAL NOT NULL,
        pages INTEGER
      )
    `);

    const books = await db.all("SELECT * FROM book");

    if (books.length === 0) {
      const sampleBooks = [
        ["Harry Potter", "J.K. Rowling", 500, 350],
        ["The Hobbit", "J.R.R. Tolkien", 400, 310],
        ["Wings of Fire", "A.P.J. Abdul Kalam", 300, 250],
      ];

      for (const book of sampleBooks) {
        await db.run(
          `INSERT INTO book (title, author, price, pages)
           VALUES (?, ?, ?, ?)`,
          book
        );
      }
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Database error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

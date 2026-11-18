
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "allu_lab04_jwt_secret_key";

app.use(express.json());

let db;

// ==========================================
// DATABASE INITIALIZATION
// ==========================================

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, "database.db"),
      driver: sqlite3.Database,
    });

    // Create book table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price REAL NOT NULL,
        pages INTEGER
      )
    `);

    // Create user table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `);
    // Check existing user table columns
const userColumns = await db.all("PRAGMA table_info(user)");

const hasNameColumn = userColumns.some(
  (column) => column.name === "name"
);

if (!hasNameColumn) {
  await db.exec("ALTER TABLE user ADD COLUMN name TEXT");
}
    // Check whether pages column exists
const bookColumns = await db.all("PRAGMA table_info(book)");

const hasPagesColumn = bookColumns.some(
  (column) => column.name === "pages"
);

// Add pages column if it does not exist
if (!hasPagesColumn) {
  await db.exec("ALTER TABLE book ADD COLUMN pages INTEGER");
}

    // Insert sample books if the table is empty
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
    console.error("Database initialization error:", error.message);
    process.exit(1);
  }
};

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Welcome to Backend Development Fundamentals - Lab 04",
    studentDetails: {
      name: "Alveera Afnaan",
      registrationNumber: "252U1R1237",
      college: "Aurora Deemed-to-be-University",
      faculty: "Mr Yugandhar Gurjalwar",
    },
    endpoints: [
      "POST /register/",
      "POST /login/",
      "GET /books/",
      "GET /books/:bookId/",
      "POST /books/",
      "PUT /books/:bookId/",
      "DELETE /books/:bookId/",
    ],
  });
});

// ==========================================
// USER REGISTRATION - POST /register/
// ==========================================

app.post("/register/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    if (
      !username ||
      !name ||
      !password ||
      typeof username !== "string" ||
      typeof name !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Username, name, and password are required",
      });
    }

    const trimmedUsername = username.trim();
    const trimmedName = name.trim();

    if (!trimmedUsername || !trimmedName || !password.trim()) {
      return res.status(400).json({
        message: "Username, name, and password cannot be empty",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Check whether username already exists
    const existingUser = await db.get(
      "SELECT * FROM user WHERE username = ?",
      [trimmedUsername]
    );

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in database
    await db.run(
      `INSERT INTO user (username, name, password)
       VALUES (?, ?, ?)`,
      [trimmedUsername, trimmedName, hashedPassword]
    );

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    next(error);
  }
});

// ==========================================
// USER LOGIN - POST /login/
// ==========================================

app.post("/login/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (
      !username ||
      !password ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      return res.status(400).json({
        message: "Username and password cannot be empty",
      });
    }

    // Find user in database
    const dbUser = await db.get(
      "SELECT * FROM user WHERE username = ?",
      [trimmedUsername]
    );

    if (!dbUser) {
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    // Compare entered password with hashed password
    const isPasswordMatched = await bcrypt.compare(
      password,
      dbUser.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // Create JWT with username only
    const payload = {
      username: dbUser.username,
    };

    const jwtToken = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      jwt_token: jwtToken,
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// VALIDATE BOOK REQUEST BODY
// ==========================================

const validateBookBody = (body) => {
  const { title, author, price, pages } = body;

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
    return "title, author, and a numeric price are required";
  }

  if (Number(price) < 0) {
    return "price must be a non-negative number";
  }

  if (
    pages !== undefined &&
    (!Number.isInteger(Number(pages)) || Number(pages) < 0)
  ) {
    return "pages must be a non-negative integer";
  }

  return null;
};

// ==========================================
// GET ALL BOOKS
// ==========================================

app.get("/books", async (req, res, next) => {
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

    const allowedColumns = [
      "id",
      "title",
      "author",
      "price",
      "pages",
    ];

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
        message: "Invalid limit or offset",
      });
    }

    if (
      (min_price !== undefined &&
        !Number.isFinite(Number(min_price))) ||
      (max_price !== undefined &&
        !Number.isFinite(Number(max_price)))
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
    next(error);
  }
});

// ==========================================
// GET BOOK BY ID
// ==========================================

app.get("/books/:bookId", async (req, res, next) => {
  try {
    const bookId = Number(req.params.bookId);

    if (!Number.isInteger(bookId) || bookId <= 0) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

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
    next(error);
  }
});

// ==========================================
// CREATE BOOK
// ==========================================

app.post("/books", async (req, res, next) => {
  try {
    const validationError = validateBookBody(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const { title, author, price, pages } = req.body;

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
    next(error);
  }
});

// ==========================================
// UPDATE BOOK
// ==========================================

app.put("/books/:bookId", async (req, res, next) => {
  try {
    const bookId = Number(req.params.bookId);

    if (!Number.isInteger(bookId) || bookId <= 0) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    const existingBook = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );

    if (!existingBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const validationError = validateBookBody(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const { title, author, price, pages } = req.body;

    await db.run(
      `UPDATE book
       SET title = ?, author = ?, price = ?, pages = ?
       WHERE id = ?`,
      [
        title.trim(),
        author.trim(),
        Number(price),
        pages === undefined ? existingBook.pages : Number(pages),
        bookId,
      ]
    );

    const updatedBook = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );

    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// DELETE BOOK
// ==========================================

app.delete("/books/:bookId", async (req, res, next) => {
  try {
    const bookId = Number(req.params.bookId);

    if (!Number.isInteger(bookId) || bookId <= 0) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

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
    next(error);
  }
});

// ==========================================
// 404 UNKNOWN ROUTE
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
  console.error("Server error:", error.message);

  res.status(500).json({
    message: "Internal server error",
  });
});

// Start server after database initialization
initializeDBAndServer();

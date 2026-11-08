
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Middleware to read JSON request bodies
app.use(express.json());

// Database file path
const dbPath = path.join(__dirname, "database.db");

let db;

app.get("/books/", async (request, response) => {
  try {
    const books = await db.all("SELECT * FROM book");

    response.json(books);
  } catch (error) {
    response.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  try {
    const book = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );

    if (book === undefined) {
      response.status(404).json({
        error: "Book not found",
      });
    } else {
      response.json(book);
    }
  } catch (error) {
    response.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;

  if (
    title === undefined ||
    author === undefined ||
    price === undefined ||
    pages === undefined ||
    title === "" ||
    author === ""
  ) {
    response.status(400).json({
      error: "All fields are required: title, author, price, pages",
    });
    return;
  }

  try {
    const result = await db.run(
      `INSERT INTO book (title, author, price, pages)
       VALUES (?, ?, ?, ?)`,
      [title, author, price, pages]
    );

    response.status(201).json({
      message: "Book added successfully",
      bookId: result.lastID,
    });
  } catch (error) {
    response.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price, pages } = request.body;

  if (
    title === undefined ||
    author === undefined ||
    price === undefined ||
    pages === undefined ||
    title === "" ||
    author === ""
  ) {
    response.status(400).json({
      error: "All fields are required: title, author, price, pages",
    });
    return;
  }

  try {
    const result = await db.run(
      `UPDATE book
       SET title = ?, author = ?, price = ?, pages = ?
       WHERE id = ?`,
      [title, author, price, pages, bookId]
    );

    if (result.changes === 0) {
      response.status(404).json({
        error: "Book not found",
      });
    } else {
      response.json({
        message: "Book updated successfully",
      });
    }
  } catch (error) {
    response.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  try {
    const result = await db.run(
      "DELETE FROM book WHERE id = ?",
      [bookId]
    );

    if (result.changes === 0) {
      response.status(404).json({
        error: "Book not found",
      });
    } else {
      response.json({
        message: "Book deleted successfully",
      });
    }
  } catch (error) {
    response.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// Initialize database and start server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("Connected to SQLite database successfully!");

    // Create book table
    await db.run(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      );
    `);

    console.log("Book table created successfully!");

    // Check whether sample books already exist
    const result = await db.get(
      "SELECT COUNT(*) AS count FROM book"
    );

    // Insert sample data only when the table is empty
    if (result.count === 0) {
      const books = [
        ["The Great Gatsby", "F. Scott Fitzgerald", 350, 180],
        ["To Kill a Mockingbird", "Harper Lee", 400, 281],
        ["1984", "George Orwell", 300, 328],
        ["Pride and Prejudice", "Jane Austen", 280, 432],
        ["The Alchemist", "Paulo Coelho", 250, 197],
        ["Sapiens", "Yuval Noah Harari", 550, 498],
        ["The Lean Startup", "Eric Ries", 480, 336],
        ["Deep Work", "Cal Newport", 420, 304],
        ["Rich Dad Poor Dad", "Robert Kiyosaki", 350, 336],
        ["The Psychology of Money", "Morgan Housel", 400, 256],
      ];

      for (const book of books) {
        await db.run(
          `INSERT INTO book (title, author, price, pages)
           VALUES (?, ?, ?, ?)`,
          book
        );
      }

      console.log("10 sample books inserted successfully!");
    }

    // Start server only after database initialization
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Database initialization failed: ${error.message}`);
    process.exit(1);
  }
};

// Home route
app.get("/", (request, response) => {
  response.json({
    message: "Welcome to Lab 02 - SQLite Database and CRUD Routes!",
    student: "T Alveera Afnaan",
    registrationNumber: "252U1R1237",
    lab: "Lab 02 - SQLite Database and CRUD Routes",
    endpoints: [
      "GET /books/",
      "GET /books/:bookId/",
      "POST /books/",
      "PUT /books/:bookId/",
      "DELETE /books/:bookId/",
    ],
  });
});

// Start database and server
initializeDBAndServer();

# Lab 02 - SQLite Database and CRUD Operations Using Express.js

## Aim
To develop a REST API using Express.js and SQLite to perform CRUD operations on a Book database.

## Technologies Used
- Node.js
- Express.js
- SQLite
- JavaScript
- Postman

## Project Structure

```text
lab 02/
├── server.js
├── package.json
├── package-lock.json
├── database.db
└── screenshots/
    ├── get-single-book.png
    ├── post-book.png
    └── put-book.png
```

## Installation and Execution

1. Install Node.js.
2. Open the project folder in VS Code.
3. Install the dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

5. The server runs on port 3000 by default.

## API Endpoints

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Displays the welcome message |
| GET | `/books/` | Retrieves all books |
| GET | `/books/:bookId/` | Retrieves a book by ID |
| POST | `/books/` | Adds a new book |
| PUT | `/books/:bookId/` | Updates a book by ID |
| DELETE | `/books/:bookId/` | Deletes a book by ID |

## Database Structure

The `book` table contains the following columns:

| Column | Data Type |
|---|---|
| id | INTEGER |
| title | TEXT |
| author | TEXT |
| price | INTEGER |
| pages | INTEGER |

The database is initialized when the server starts. If the table is empty, sample book records are inserted.

## Sample API Requests

### 1. Get All Books

```http
GET /books/
```

Retrieves all books stored in the database.

### 2. Get a Book by ID

```http
GET /books/1/
```

Retrieves the book with ID 1.

### 3. Add a New Book

```http
POST /books/
Content-Type: application/json
```

Request body:

```json
{
  "title": "Learning Node.js",
  "author": "John Smith",
  "price": 450,
  "pages": 300
}
```

### 4. Update a Book

```http
PUT /books/1/
Content-Type: application/json
```

Request body:

```json
{
  "title": "Advanced Node.js",
  "author": "John Smith",
  "price": 550,
  "pages": 350
}
```

### 5. Delete a Book

```http
DELETE /books/1/
```

Deletes the book with ID 1.

## Features

- Creates and initializes an SQLite database.
- Performs CRUD operations using REST API endpoints.
- Uses parameterized SQL queries.
- Validates request data.
- Returns appropriate HTTP status codes.
- Handles records that do not exist.

## Testing

The API endpoints are tested using Postman.

Screenshots of API responses are included in the `screenshots` folder.

## Result

Successfully developed an Express.js REST API integrated with an SQLite database to perform Create, Read, Update, and Delete operations on book records.

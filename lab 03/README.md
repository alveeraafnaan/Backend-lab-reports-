# Lab 03 – REST API Development

## Overview
This lab demonstrates the development of a REST API using Node.js, Express.js and SQLite.

The API performs CRUD operations on a book database.

## Technologies Used
- Node.js
- Express.js
- SQLite
- JavaScript
- Postman

## Database Structure

| Column | Type |
|---|---|
| id | INTEGER |
| title | TEXT |
| author | TEXT |
| price | INTEGER |
| pages | INTEGER |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Retrieve all books |
| GET | `/books/:bookId` | Retrieve a book by ID |
| POST | `/books` | Add a new book |
| PUT | `/books/:bookId` | Update a book |
| DELETE | `/books/:bookId` | Delete a book |

## Testing

All five CRUD endpoints were tested successfully using Postman.

Screenshots of the API responses are available in the `screenshots` folder.

## How to Run

1. Install Node.js.
2. Open the project folder.
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
node server.js
```

5. Open Postman and test the endpoints using:

`http://localhost:3000`

## Author

**Alveera Afnaan**

Backend Development Laboratory

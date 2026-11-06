
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to Backend Development Lab 01!");
});

// About route
app.get("/about", (req, res) => {
    res.json({
        message: "This is Lab 01",
        technology: "Node.js and Express"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

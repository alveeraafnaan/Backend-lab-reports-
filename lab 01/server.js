
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

// Time route
app.get("/time", (req, res) => {
    const currentTime = new Date().toLocaleTimeString();

    res.json({
        message: "Current server time",
        time: currentTime
    });
});

// 404 route
app.use((req, res) => {
    res.status(404).json({
        error: "404 Not Found",
        message: "The requested route does not exist."
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

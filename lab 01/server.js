
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Backend Development Fundamentals Lab 1!",
        student: "T Alveera Afnaan",
        lab: "Lab 1 - Node.js and Express Server"
    });
});

// About route
app.get("/about", (req, res) => {
    res.json({
        name: "T Alveera Afnaan",
        registrationNumber: "252U1R1237",
        section: "CSE-2E 211",
        course: "Backend Development Fundamentals",
        college: "Aurora Deemed-to-be-University"
    });
});

// Time route
app.get("/time", (req, res) => {
    const currentDateTime = new Date();

    res.json({
        currentDateTime: currentDateTime.toString(),
        isoFormat: currentDateTime.toISOString(),
        message: "This is the current server date and time."
    });
});

// 404 middleware
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        message: `The route '${req.originalUrl}' does not exist on this server.`,
        statusCode: 404
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

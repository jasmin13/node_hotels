const express = require("express");
const app = express();
const db = require("./db");
require("dotenv").config();

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Middleware Functions
const logRequest = (req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()} ] Request made to : ${req.originalUrl}`
  );
  next(); // Move to next request
};

// Apply middleware to all routes
app.use(logRequest);

app.get("/", (req, res) => {
  res.send("Welcome to our Hotel");
});

// Import the routers file
const personRoutes = require("./routes/personRoutes");
const menuItemRoutes = require("./routes/menuItemRoutes");

// Use the routers
app.use("/person", personRoutes);
app.use("/menu", menuItemRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

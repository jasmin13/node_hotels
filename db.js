const mongoose = require("mongoose");

// Define the MongoDB connection url
//const mongoUrl = "mongodb://localhost:27017/hotels"; // Replace 'database' with your database
const mongoUrl =
  "mongodb+srv://jasmin13:jasmin13@cluster0.nplgw.mongodb.net/hotels?retryWrites=true&w=majority"; // Replace 'database' with your database

// Replace 'database' with your database

// Connect to the MongoDB database
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Default event listeners for database connections
db.on("connected", () => {
  console.log("Successfully connected to MongoDB database");
});

db.on("error", (error) => {
  console.log("Error connecting to MongoDB database: ", error);
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB database");
});

// Export the database connection
module.exports = db;

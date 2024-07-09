const express = require("express");
const router = express.Router();
const Person = require("./../models/Person");
const {jwtAuthMiddleware, generateToken} = require("./../jwt");

// Post routes to add person
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; // assuming the request body contains the person data

    const newPerson = new Person(data); // create a new person document using mongoose model

    // Save the new person in the database
    const response = await newPerson.save();
    console.log("data saved");

    const payload = {
      id: response.id,
      username: response.username
    }

    console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("Token is :", token);
    res.status(200).json({response: response, token: token});
  } catch (error) {
    console.log("Error saving person:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Login routes

router.post("/login", async (req, res) => {
  try {

    // Extract username and password from request body
    const {username, password} = req.body; 

    // Find the user by username
    const user = await Person.findOne({ username: username });

    // If user does not exist or password doesn't match then return error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate token
    const payload = {
      id: user.id,
      username: user.username
    }

    const token = generateToken(payload);

    // Return token as response
    res.status(200).json({ token: token });
  } catch (error) {
    console.log("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Profile routes
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    // Get user data from token
    const userData = req.user;
    console.log("User data: ", userData);

    const userId = userData.id; // Get user id from token
    const response = await Person.findById(userId);

    console.log("response fetched");
    res.status(200).json(response);
  } catch (error) {
    console.log("Error getting profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get person data from the database
router.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const data = await Person.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (error) {
    console.log("Error saving person:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get person work type from database
router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType;
    if (workType == "chef" || workType == "waiter" || workType == "manager") {
      const response = await Person.find({ work: workType });
      console.log("response fetched");
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "Invalid work type" });
    }
  } catch (error) {
    console.log("Error getting worktype:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update person data in database

router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id; // Extract id from URL parameter
    const updatePersonData = req.body; // get person data from body

    const response = await Person.findByIdAndUpdate(
      personId,
      updatePersonData,
      {
        new: true, // Return updated person
        runValidators: true, // Run mongoose validations
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }

    console.log("data updated");
    res.status(200).json(response);
  } catch (error) {
    console.log("Error updating person:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete person data from database
router.delete("/:id", async (req, res) => {
  try {
    const personId = req.params.id; // Extract id from URL parameter
    const response = await Person.findByIdAndDelete(personId);
    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }
    console.log("data deleted");
    res.status(200).json({ message: "Person deleted successfully" });
  } catch (error) {
    console.log("Error deleting person:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

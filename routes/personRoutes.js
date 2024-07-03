const express = require("express");
const router = express.Router();
const Person = require("./../models/Person");

// Post routes to add person
router.post("/", async (req, res) => {
  try {
    const data = req.body; // assuming the request body contains the person data

    const newPerson = new Person(data); // create a new person document using mongoose model

    // Save the new person in the database
    const response = await newPerson.save();
    console.log("data saved");
    res.status(200).json(response);
  } catch (error) {
    console.log("Error saving person:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get person data from the database
router.get("/", async (req, res) => {
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

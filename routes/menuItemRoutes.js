const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// Post routes to add Menu Items to the database
router.post("/", async (req, res) => {
  try {
    const data = req.body; // assuming the request body contains the menu data

    const newMenu = new MenuItem(data); // create a new menu document using mongoose model

    // Save the new menu item in the database
    const response = await newMenu.save();
    console.log("data saved");
    res.status(200).json(response);
  } catch (error) {
    console.log("Error saving menu:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Menu Item data from the database
router.get("/", async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (error) {
    console.log("Error saving menu item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get menu taste type from database
router.get("/:taste", async (req, res) => {
  try {
    const tasteType = req.params.taste;
    if (tasteType == "spicy" || tasteType == "sweet" || tasteType == "sour") {
      const response = await MenuItem.find({ taste: tasteType });
      console.log("response fetched");
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "Invalid taste type" });
    }
  } catch (error) {
    console.log("Error getting tasteType:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update menu item in database
router.put("/:id", async (req, res) => {
  try {
    const menuId = req.params.id; // Extract id from URL parameter
    const data = req.body;
    const response = await MenuItem.findByIdAndUpdate(menuId, data);
    if (!response) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    console.log("data updated");
    res.status(200).json({ message: "Menu item updated successfully" });
  } catch (error) {
    console.log("Error updating menu item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete menu item from database
router.delete("/:id", async (req, res) => {
  try {
    const menuId = req.params.id; // Extract id from URL parameter
    const response = await MenuItem.findByIdAndDelete(menuId);
    if (!response) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    console.log("data deleted");
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.log("Error deleting menu item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Comment for testing purposes
module.exports = router;

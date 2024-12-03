const RestaurantList = require("../models/restaurantlist");
require("dotenv").config();

exports.createlistFile = async (req, res) => {
  const { restaurantName, address, logourl, headerimage } = req.body;
  try {
    const restaurantlist = await RestaurantList.create({
      restaurantName,
      address,
      logourl,
      headerimage,
    });
    await restaurantlist.save();
    res.status(201).json({ message: "Created restaurants list" });
  } catch (error) {
    console.log(error);
  }
};

exports.getAlllist = async (req, res) => {
  try {
    const restaurantlists = await RestaurantList.find(); // Retrieve all documents from the Event collection
    res.status(200).json(restaurantlists); // Send the restaurantlists as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch restaurant lists" });
  }
};

exports.updatelistFile = async (req, res) => {
  const { id } = req.params; // Get ID from URL params
  const updates = req.body; // Get the fields to update from the request body

  try {
    const updatedRestaurant = await RestaurantList.findByIdAndUpdate(
      id,
      updates,
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(updatedRestaurant); // Send the updated restaurant data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update restaurant details" });
  }
};

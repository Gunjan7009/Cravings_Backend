const Popularfood = require("../models/popularfood");
require("dotenv").config();

exports.createlistFile = async (req, res) => {
  const { popularfoodname, no_of_restaurant, foodurl } = req.body;
  try {
    const popularfoods = await Popularfood.create({
      popularfoodname,
      no_of_restaurant,
      foodurl,
    });
    await popularfoods.save();
    res.status(201).json({ message: "Created popular food list" });
  } catch (error) {
    console.log(error);
  }
};

exports.getAlllist = async (req, res) => {
  try {
    const popularfoods = await Popularfood.find();
    res.status(200).json(popularfoods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch popular food lists" });
  }
};

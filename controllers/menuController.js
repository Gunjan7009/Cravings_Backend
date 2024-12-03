const Menu = require("../models/menu");
require("dotenv").config();

exports.Addfood = async (req, res) => {
  const { Dish_name, description, category, price, imageUrl } = req.body;
  try {
    const menufoods = await Menu.create({
      Dish_name,
      description,
      category,
      price,
      imageUrl,
    });
    await menufoods.save();
    res.status(201).json({ message: "Created Menu items" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create Menu items" });
  }
};

exports.Receivefood = async (req, res) => {
  try {
    const menufoods = await Menu.find();
    res.status(200).json(menufoods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch Menu items" });
  }
};

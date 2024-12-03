const Offerscards = require("../models/offerCards");
require("dotenv").config();

exports.addOffers = async (req, res) => {
  const { offercardrestaurant, category, offercardimgurl } = req.body;
  try {
    const offersdetails = await Offerscards.create({
      offercardrestaurant,
      category,
      offercardimgurl,
    });
    await offersdetails.save();
    res.status(201).json({ message: "Offer cards created" });
  } catch (error) {
    console.log("error in adding details", error);
  }
};

exports.getOffers = async (req, res) => {
  try {
    const offersdetails = await Offerscards.find();
    res.status(200).json(offersdetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch deals details" });
  }
};

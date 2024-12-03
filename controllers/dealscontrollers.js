const Dealscards = require("../models/dealCards");
require("dotenv").config();

exports.addDeals = async (req, res) => {
  const { dealcardname, dealcardrestaurant, dealcardimgurl } = req.body;
  try {
    const dealsdetails = await Dealscards.create({
      dealcardname,
      dealcardrestaurant,
      dealcardimgurl,
    });
    await dealsdetails.save();
    res.status(201).json({ message: "Deal cards created"});
  } 
  catch (error) {
    console.log("error in adding details", error);
  }
};


exports.getDeals = async (req,res) =>{
    try {
        const dealsdetails = await Dealscards.find();
        res.status(200).json(dealsdetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch deals details" });  
    }
};

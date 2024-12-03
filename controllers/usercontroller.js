const User = require("../models/User");
const mongoose = require("mongoose");

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile", error);
    res.status(500).json({ message: "Error in fetching user" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const { name, email, gender, addresses } = req.body; // Extract `addresses` from `req.body`
    console.log("received data:", req.body);

    if (!name && !email && !gender && (!addresses || !addresses[0]?.country)) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one change",
      });
    }
    console.log("received data:", req.body);
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (gender) updateFields.gender = gender;
    if (addresses && addresses[0]?.country) {
      // Ensure `user.addresses` exists and has at least one entry
      const userAddresses = user.addresses || [{}];
      if (!userAddresses[0]) {
        userAddresses[0] = {}; // Initialize the first address if it doesn't exist
      }
      userAddresses[0].country = addresses[0].country; // Update the first address's country
      updateFields.addresses = userAddresses; // Add the updated addresses array to `updateFields`
    }

    console.log("updated fields:", updateFields);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};
exports.updatingUser = async (req, res) => {
  const userId = req.user.id;
  const updates = req.body; // General profile details (e.g., name, phone)

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

exports.addCards = async (req, res) => {
  const userId = req.user.id;
 
  const { _id, cardNumber, expiration, cvc, cardHolderName } = req.body; // Card details from the frontend
  console.log(_id);
  try {
    const user = await User.findById(userId);
    const cardIndex = user.cards.findIndex(card => card._id.toString() === _id);
    console.log("Cards in DB:", user.cards);
console.log("Payload ID:", _id);
console.log("Matching Card Index:", cardIndex);


    if(cardIndex != -1){
        user.cards[cardIndex] = { ...user.cards[cardIndex], cardNumber, expiration, cvc, cardHolderName };
    }
    else{
        user.cards.push({ cardNumber, expiration, cvc, cardHolderName 
        })
    }
    // const updatedUser = await User.findByIdAndUpdate(
    //   userId,
    //   { $push: { cards: newCard } },
    //   { new: true }
    // );
    await user.save();
    res.json({
      success: true,
      message: cardIndex !== -1 ? "Card updated successfully" : "Card added successfully",
      user,
    });
  } catch (error) {
    console.error("Error adding card:", error);
    res.status(500).json({ success: false, message: "Error adding card", error: error.message });
  }
};

exports.addAddress = async (req, res) => {
  const userId = req.user.id; // Extracted from the authentication middleware
  const newAddress = req.body; // Address details from the frontend

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: newAddress } },
      { new: true }
    );
    res.json({
      success: true,
      message: "Address added successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding address" });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch users" });
  }
};

exports.deleteCards = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cardNumber } = req.body;

    if (!cardNumber || cardNumber.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid card numbers to delete",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          cards: {
            cardNumber: { $in: cardNumber },
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cards deleted successfully",
      remainingCards: updatedUser.cards,
    });
  } 
  catch (error) 
  {
    console.error("Error deleting cards:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    
  }
};

exports.addOrUpdateAddress = async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID
  const { _id, label, addressLine, city, state, zipCode, country, phone } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the address with the provided _id already exists
    const addressIndex = user.addresses.findIndex(address => address._id.toString() === _id);

    if (addressIndex !== -1) {
      // Update the existing address
      user.addresses[addressIndex] = { 
        ...user.addresses[addressIndex], 
        label, 
        addressLine, 
        city, 
        state, 
        zipCode, 
        country,
        phone
      };
    } else {
      // Add a new address
      user.addresses.push({ label, addressLine, city, state, zipCode, country, phone });
    }

    await user.save();

    res.json({
      success: true,
      message: addressIndex !== -1 ? "Address updated successfully" : "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error adding/updating address:", error);
    res.status(500).json({ success: false, message: "Error adding/updating address", error: error.message });
  }
};


exports.deleteAddress = async (req, res) => {
  const userId = req.user.id;
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ success: false, message: "Address ID is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.addresses = user.addresses.filter(address => address._id.toString() !== _id);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ success: false, message: "Error deleting address", error: error.message });
  }
};

exports.getAddresses = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ success: false, message: "Error fetching addresses", error: error.message });
  }
};

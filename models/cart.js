const mongoose = require("mongoose");
require("dotenv").config();

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
      Dish_name: String, // Add Dish_name from Menu
      price: Number, // Add price from Menu
      imageUrl: String, // Add imageUrl from Menu
      quantity: { type: Number, default: 1 },
    },
  ],
  subtotal: { type: Number, default: 0 },
  totalToPay: { type: Number, default: 0 },
  sharedLinkId: { type: String, unique: true }, // Unique ID for the shared link
  // isShared: { type: Boolean, default: false }, // Flag to track sharing
  // sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Optional: List of users with access
});

// Method to add an item to the cart
cartSchema.methods.addItem = async function (menuId, menuDetails) {
  const { price, Dish_name, imageUrl } = menuDetails;

  const existingItemIndex = this.items.findIndex(
    (item) => item.productId.toString() === menuId
  );

  if (existingItemIndex >= 0) {
    // If item exists, increment its quantity
    this.items[existingItemIndex].quantity += 1;
  } else {
    // If item doesn't exist, add a new item with menu details
    this.items.push({
      productId: menuId,
      Dish_name,
      price,
      imageUrl,
      quantity: 1,
    });
  }

  // Recalculate the subtotal
  this.subtotal += price;
  this.totalToPay = this.subtotal; // Assuming no additional charges
  await this.save(); // Save the updated cart
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;

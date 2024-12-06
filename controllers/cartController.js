const Cart = require("../models/cart");
const Menu = require("../models/menu");
const { v4: uuidv4 } = require("uuid");

// Add item to the cart
exports.addItem = async (req, res) => {
  const { productId, sharedLinkId } = req.body;
  const userId = req.user.id; // Get the user ID from `authMiddleware`
  try {
    console.log("Adding Product ID:", productId);
    let cart;
    if (sharedLinkId) {
      cart = await Cart.findOne({ sharedLinkId });
    } else if (userId) {
      cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, sharedLinkId: uuidv4() });
        await cart.save(); // Save the new cart to the database
      }
    } else {
      return res
        .status(400)
        .json({ message: "User ID or shared link required" });
    }

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = await Menu.findById(productId);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("Found Product:", product);
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId,
        Dish_name: product.Dish_name,
        price: parseFloat(product.price),
        imageUrl: product.imageUrl,
        quantity: 1,
      });
    }

    // Calculate subtotal
    // const updatedItems = await Promise.all(
    //   cart.items.map(async (item) => {
    //     const productDetails = await Menu.findById(item.productId);
    //     return productDetails.price * item.quantity;
    //   })
    // );
    // cart.subtotal = updatedItems.reduce((acc, curr) => acc + curr, 0);
    // cart.totalToPay = cart.subtotal;
    cart.subtotal = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    cart.totalToPay = cart.subtotal;

    console.log("Cart Items Before Save:", cart.items);
    await cart.save();
    console.log("Cart Saved Successfully");
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// Remove item from the cart
exports.removeItem = async (req, res) => {
  const { productId, sharedLinkId } = req.body;
  const userId = req.user?.id;
  try {
    let cart;
    if (sharedLinkId) {
      cart = await Cart.findOne({ sharedLinkId });
    } else {
      cart = await Cart.findOne({ userId });
    }

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }

      // Calculate subtotal
      // const updatedItems = await Promise.all(
      //   cart.items.map(async (item) => {
      //     const productDetails = await Menu.findById(item.productId);
      //     return productDetails.price * item.quantity;
      //   })
      // );
      // cart.subtotal = updatedItems.reduce((acc, curr) => acc + curr, 0);
      // cart.totalToPay = cart.subtotal;
      cart.subtotal = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      cart.totalToPay = cart.subtotal;
      await cart.save();
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing from cart" });
  }
};

// Clear the cart
exports.clearCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      cart.subtotal = 0;
      cart.totalToPay = 0;
      await cart.save();
    }
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error clearing cart" });
  }
};

// Get cart details
exports.getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.json({ items: [], subtotal: 0, totalToPay: 0 });

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart details" });
  }
};

exports.shareCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Generate unique shared link ID
    if (!cart.sharedLinkId) {
      cart.sharedLinkId = uuidv4();
      // cart.isShared = true;
      await cart.save();
    }
    const sharedLinkId = cart.sharedLinkId;
    const sharedLink = `${process.env.FRONTEND_URL}/shared-cart/${cart.sharedLinkId}`;
    res.status(200).json({ sharedLinkId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sharing cart" });
  }
};

exports.getSharedCart = async (req, res) => {
  const { sharedLinkId } = req.params;
  try {
    const cart = await Cart.findOne({ sharedLinkId }).populate(
      "items.productId"
    );
    if (!cart)
      return res.status(404).json({ message: "Shared cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching shared cart" });
  }
};

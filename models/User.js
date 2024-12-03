const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: "Anonymous" },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, default: "000-000-0000" },
    password: { type: String, required: true },
    gender: { type: String, default: "Prefer not to say" },
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        label: { type: String, default: "Home" },
        addressLine: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipCode: { type: String, default: "" },
        country: { type: String, default: "India" },
        phone: { type: String, required: true },
      },
    ],
    cards: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        cardNumber: { type: String, default: "" },
        expiration: { type: String, default: "" },
        cvc: {
          type: String,
          validate: {
            validator: function (v) {
              return /^\d{3}$/.test(v); // Ensure exactly 3 digits
            },
            message: (props) => `${props.value} is not a valid CVC. Must be exactly 3 digits.`,
          },
          default: "",
        },
        cardHolderName: { type: String, default: "" }
      },
    ],
    token: { type: String, default: null },
    activationToken: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  console.log("Hashed Password before saving:", this.password); // Add this line
  next();
});

// Compare passwords for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log("Candidate Password:", candidatePassword); // Log the candidate password
  console.log("Stored Hashed Password:", this.password); // Log the stored hashed password
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;

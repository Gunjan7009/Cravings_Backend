const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
// const { sendEmail } = require('../utils/email');
const generateToken = require('../utils/generateToken');


// const generateActivationToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10m' });
// };


const registerUser = async (req, res) => {
  console.log('Received registration request:', req.body);
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
}
  try {
      const user = await User.create({ name, email, phone, password, addresses: [], cards: [] });
      
      // Generate activation token
    //   const activationToken = generateActivationToken(user._id);
    //   user.activationToken = activationToken;
      await user.save();

    //   const activationLink = `https://online-event-management-backend.onrender.com/activate/${activationToken}`;
    //   await sendEmail(req.body.email, 'Activate your account Registration Successful, Welcome to our service!', `Click this link to activate your account: ${activationLink}`);

    //   console.log('Sending registration email to:', req.body.email);
      // await sendEmail(req.body.email, );
    //   console.log('Registration email sent successfully');

      res.status(201).json({ success: true, message: "User registered." });
  } catch (err) {
      console.log('Error in registration:', err);
     
          res.status(500).json({success: false, message: "Error registering user"  });
      
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt:', { email });

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "User not found" });
      console.log('User found:', { email: user.email });
      console.log('Hashed password in DB:', user.password);

      const isMatch = await user.comparePassword(password); // plain text password from login

      if (isMatch) {
          console.log('Password matches');
      } else {
          console.log('Password does not match');
      }
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      // Generate JWT token (for session management) This is where you would issue the JWT token
      

      const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
      });
    user.token =token;
      await user.save();

      // Set the token in HttpOnly cookie
      // res.cookie('jwtToken', token, {
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === 'production',  // Use secure in production
      //     sameSite: 'Lax',
      //     maxAge: 24 * 60 * 60 * 1000, // Prevent CSRF
      // });

      // For simplicity, returning user info
      res.json({ token: token, user: { _id: user._id, name: user.name }, isLoggedIn: true });

  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
};



const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "User not found" });

      // Generate a new reset token
      const resetToken = generateToken(user.id);
      
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
      console.log('Token saved in DB:', resetToken);
      console.log('Token expires at:', user.resetPasswordExpires);
      await user.save();

    //   const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    //   await sendEmail(email, 'Reset your password', `Click this link to reset your password: ${resetLink}`);

      res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
      console.error("Error during forgot password:", err);
      res.status(500).json({ error: "Internal server error" });
  }
};


const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
      // Log the token received for debugging
      console.log('Token received:', token);

      // Find user by token and check if token hasn't expired
      const user = await User.findOne({
          resetPasswordToken: token,  // Make sure this matches exactly
          resetPasswordExpires: { $gt: Date.now() }  // Ensure time check is correct
          
      });

    


      if (!user) {
          console.log('User not found or token expired');
          return res.status(400).json({ error: "Invalid or expired token" });
      }

      // Log user for debugging
      console.log('User found:', user);

     // Hash the new password and save it
  //    const hashedPassword = await bcrypt.hash(newPassword, 10);
  //    console.log('Hashed new password:', hashedPassword);
     user.password = newPassword;

      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.json({ message: "Password has been reset. You can now log in with your new password." });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
};


const logoutUser = async (req, res) => {
    try {
      const userId = req.user.id; // Extracted from auth middleware
    await User.findByIdAndUpdate(userId, { token: null });
      // Clear the JWT token from the cookie
      res.clearCookie('jwtToken'
      //   , {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production', // Make sure this works in production
      //   sameSite: 'None' // Prevent CSRF attacks
      // }
    );
      console.log("Logout successful");
      // Return a success response
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      console.error('Error logging out:', err);
      return res.status(500).json({ error: 'Failed to log out' });
    }
  };


module.exports = {
  registerUser,
  // activateUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
};


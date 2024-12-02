const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
// Signup
exports.signup = async (req, res) => {
  const { name, email, password, designation } = req.body;

  try {
    console.log('Request body:', req.body); // Debugging incoming data

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists:', userExists); // Debug existing user
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully'); // Debug hashing step

    // Create a new user
    const user = new User({ name, email, password: hashedPassword, designation });
    await user.save();
    console.log('User saved successfully:', user); // Debug saved user

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body; // Plain text password from request
  console.log("Password Entered by User:", password);

  try {
    // Database se user dhundhna
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User Found:", user.email);
    console.log("Hashed Password from DB:", user.password);

    // Password compare karna
    const isMatch = await bcrypt.compare(password, user.password); // Correct comparison
    console.log('Password Match:', isMatch);


    // JWT token generate karna
    const payload = {
      id: user._id,  // User ka ID
      email: user.email,
      designation: user.designation, // Agar designation bhi store karna ho
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated Token:', token);

    // Token ko cookie me set karna
res.cookie('token', token, {
  httpOnly: true, // Secure against XSS attacks
  maxAge: 3600000, // 1 hour
  sameSite: 'strict', // Cross-site request forgery se bachne ke liye
});

    // Token ko client ko bhejna
    res.status(200).json({
      message: 'Login successful',
      token,  // Client ko token bhejna
      user: {
        id: user._id,
        name: user.name, // Include user name
        email: user.email,
        designation: user.designation,
      }
    }
  );
  }
  catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get User by Email (New Function)
exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' });
    }

    res.status(200).json({ message: 'User found', user });
  } catch (error) {
    console.error('Get User Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate JWT token
    const resetToken = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: '30m' } // Token expiration (15 minutes)
    );

    // Create reset link
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    // Send email with Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.PASSWORD, // Your email password
      },
    });

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `You can reset your password using the following link: ${resetURL}`,
      html: `<p>Click here to reset your password: <a href="${resetURL}">${resetURL}</a></p>`,
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending password reset email' });
  }
};

//Reset-Password

exports.resetPassword = async (req, res) => {
  const { token } = req.params; // JWT token from URL
  const { password } = req.body;

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the password
    user.password = await bcrypt.hash(password, 10); // Hash new password
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token expired. Request a new password reset.' });
    }
    res.status(500).json({ message: 'Error resetting password' });
  }
};
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Logic for sending email
    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (error) {
    console.error('Forgot Password Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

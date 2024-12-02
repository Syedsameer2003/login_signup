const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Environment variables load karein
dotenv.config();

// Database connect karein
connectDB();

const app = express();
app.use(express.json()); // JSON parsing middleware
app.use(cors()); // Enable CORS

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Server start karein
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 

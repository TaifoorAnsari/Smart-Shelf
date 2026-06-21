// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware to allow data transfer
app.use(cors());
app.use(express.json());

// Connect to MongoDB Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" Successfully connected to MongoDB"))
  .catch((err) => console.error(" Database connection error:", err));

// Test route to ensure server is working
app.get('/', (req, res) => {
  res.send('SmartShelf Backend Engine is Running!');
});

//link our item routes
const itemRoutes = require('./routes/itemRoutes');
app.use('/api/items', itemRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is flying on port ${PORT}`);
});

require('./services/cronService');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logRoutes = require('./routes/temp');


const app = express();

// Middleware to enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Connect to MongoDB
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mount all log-related API routes
app.use('/api/logs', logRoutes);

// Start the server
app.listen(5001, () => console.log('LoopLog backend running on port 5001'));

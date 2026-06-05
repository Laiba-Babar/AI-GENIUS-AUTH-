const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AI-GENIUS-AUTH Server running on port ${PORT}`);
});
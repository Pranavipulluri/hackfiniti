const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // Required for Socket.IO
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { initializeSocket } = require('./config/socket'); // Import Socket.IO setup

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000' // Allow requests from frontend
}));
app.use(express.json()); // Body parser for JSON

// --- API Routes ---
app.get('/api', (req, res) => {
  res.send('Cultural Quest API Running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
// Add other routes here (profiles, messages, resources, reviews, admin etc.)
// app.use('/api/profiles', require('./routes/profileRoutes')); // Example
// app.use('/api/messages', require('./routes/messageRoutes')); // Example


// --- Error Handler Middleware (Should be last) ---
app.use(errorHandler);

// --- Server Setup ---
const PORT = process.env.PORT || 5001;

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = initializeSocket(server); // Initialize Socket.IO

server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process (optional)
  // server.close(() => process.exit(1));
});

module.exports = { app, io }; // Export io if needed elsewhere
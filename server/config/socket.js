const { Server } = require("socket.io");

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000", // Allow connection from client
      methods: ["GET", "POST"]
    }
  });

  console.log("Socket.IO initialized");

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // --- Basic Socket Event Handlers ---

    // Example: Join a room (e.g., user joins their own notification room or a chat room)
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    // Example: Handle sending a private message
    socket.on('sendMessage', ({ recipientId, senderId, content }) => {
      console.log(`Message from ${senderId} to ${recipientId}: ${content}`);
      // Here you would:
      // 1. Save the message to the database (Message model)
      // 2. Emit the message to the recipient's room/socket if they are online
      // io.to(recipientId).emit('receiveMessage', { senderId, content, timestamp: new Date() }); // Use a unique room per user
      // You might need a way to map userId to socket.id or use user-specific rooms
      socket.to(recipientId).emit('receiveMessage', { senderId, content, timestamp: new Date() }); // Simplified: Assumes room name is recipientId
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Add any cleanup logic if needed (e.g., update user online status)
    });

    // --- Add more event handlers as needed ---
    // E.g., typing indicators, read receipts, notifications

  });

  return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};


module.exports = { initializeSocket, getIO };
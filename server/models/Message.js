const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversationId: { // Link messages to a conversation
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation', // Assuming a Conversation model exists
    // Alternatively, could just use sender/receiver and query dynamically
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: { // Good for direct filtering/notification logic
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  readStatus: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', MessageSchema);

// You would likely also need a Conversation model:
/*
const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  updatedAt: { // To sort conversations by recent activity
    type: Date,
    default: Date.now
  }
}, { timestamps: { createdAt: true } }); // Adds createdAt automatically

module.exports = mongoose.model('Conversation', ConversationSchema);
*/
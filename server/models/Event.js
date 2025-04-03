const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add an event title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    location: { // Could be more structured (address, city, coordinates)
        type: String,
        required: [true, 'Please add a location'],
    },
    dateTime: {
        type: Date,
        required: [true, 'Please add a date and time'],
    },
    category: {
        type: String, // e.g., 'Food', 'Music', 'Workshop', 'Meetup'
        trim: true,
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    maxAttendees: { // Optional limit
        type: Number,
    },
    imageUrl: { // Optional image for the event
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update `updatedAt` field before saving
EventSchema.pre('save', function(next) {
  if (this.isModified()) { // Only update if modified to avoid unnecessary updates
      this.updatedAt = Date.now();
  }
  next();
});


module.exports = mongoose.model('Event', EventSchema);
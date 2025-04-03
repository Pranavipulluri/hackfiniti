const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const LanguageSchema = new mongoose.Schema({
    language: { type: String, required: true },
    proficiency: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'],
        default: 'Beginner'
    }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false, // Don't return password by default
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    profilePicture: {
        type: String, // URL to the picture
        default: 'default_avatar.png', // Add a default avatar path/url
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    interests: [String],
    languages: [LanguageSchema],
    isHost: {
        type: Boolean,
        default: false,
    },
    isExchangee: {
        type: Boolean,
        default: false,
    },
    location: { // Could be more structured (city, country)
        type: String,
        trim: true,
    },
    isAdmin: { // For Admin Panel feature
        type: Boolean,
        default: false,
    },
    // Add fields for matching criteria if needed (e.g., program, university)
    // Add references to reviews, events etc. if needed
    // reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    // You might add 'lastSeen' or 'isOnline' for presence features
});

// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Middleware to update `updatedAt` field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


// Method to compare entered password with hashed password in DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
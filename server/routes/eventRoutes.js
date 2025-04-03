const express = require('express');
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    attendEvent, // RSVP
    unattendEvent // Cancel RSVP
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply 'protect' middleware to all routes in this file
router.use(protect);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', createEvent);

// @route   GET /api/events
// @desc    Get all events (Add filtering/pagination later)
// @access  Private
router.get('/', getAllEvents);

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Private
router.get('/:id', getEventById);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (Only creator or admin)
router.put('/:id', updateEvent); // Authorization check inside controller

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (Only creator or admin)
router.delete('/:id', deleteEvent); // Authorization check inside controller

// @route   POST /api/events/:id/attend
// @desc    RSVP to an event
// @access  Private
router.post('/:id/attend', attendEvent);

// @route   DELETE /api/events/:id/attend
// @desc    Cancel RSVP to an event
// @access  Private
router.delete('/:id/attend', unattendEvent);


module.exports = router;
const Event = require('./models/Event');
const User = require('./models/User'); // If needed for checks
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
exports.createEvent = asyncHandler(async (req, res, next) => {
    // Add creator field from logged-in user
    req.body.creator = req.user.id;

    const { title, description, location, dateTime, category, maxAttendees, imageUrl } = req.body;

    // Basic validation
    if (!title || !description || !location || !dateTime) {
        res.status(400);
        throw new Error('Please provide title, description, location, and dateTime for the event');
    }

    const event = await Event.create(req.body);

    res.status(201).json({
        success: true,
        data: event
    });
});

// @desc    Get all events
// @route   GET /api/events
// @access  Private
exports.getAllEvents = asyncHandler(async (req, res, next) => {
    // TODO: Add filtering (by category, date range, location) and pagination
    const events = await Event.find().populate('creator', 'username firstName lastName profilePicture').sort({ dateTime: 1 }); // Sort by upcoming date

    res.status(200).json({
        success: true,
        count: events.length,
        data: events
    });
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Private
exports.getEventById = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id)
                            .populate('creator', 'username firstName lastName profilePicture') // Populate creator details
                            .populate('attendees', 'username firstName lastName profilePicture'); // Populate attendee details

    if (!event) {
        res.status(404);
        throw new Error(`Event not found with id of ${req.params.id}`);
    }

    res.status(200).json({
        success: true,
        data: event
    });
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Creator or Admin only)
exports.updateEvent = asyncHandler(async (req, res, next) => {
    let event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error(`Event not found with id of ${req.params.id}`);
    }

    // Check if logged-in user is the creator or an admin
    if (event.creator.toString() !== req.user.id && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized to update this event');
    }

    // Prevent creator field from being updated directly
    delete req.body.creator;
    // Prevent attendees field from being updated directly via this route
    delete req.body.attendees;

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Return the updated document
        runValidators: true // Run Mongoose validators on update
    }).populate('creator', 'username firstName lastName profilePicture'); // Re-populate creator after update

    // Manually trigger pre-save hook for updatedAt if needed, or handle in schema/findByIdAndUpdate options
    event.updatedAt = Date.now();
    await event.save({ validateBeforeSave: false }); // Save again just to update timestamp if needed


    res.status(200).json({
        success: true,
        data: event
    });
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Creator or Admin only)
exports.deleteEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error(`Event not found with id of ${req.params.id}`);
    }

    // Check if logged-in user is the creator or an admin
    if (event.creator.toString() !== req.user.id && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized to delete this event');
    }

    await event.remove(); // Or event.deleteOne()

    res.status(200).json({
        success: true,
        data: {} // Indicate successful deletion
    });
});

// @desc    RSVP to an event
// @route   POST /api/events/:id/attend
// @access  Private
exports.attendEvent = asyncHandler(async (req, res, next) => {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
        res.status(404);
        throw new Error(`Event not found with id of ${eventId}`);
    }

    // Check if max attendees reached (if applicable)
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
         // Check if user is already an attendee before throwing error
         if (!event.attendees.includes(userId)) {
            res.status(400);
            throw new Error('Event is full');
         }
    }

    // Check if user is already attending
    if (event.attendees.includes(userId)) {
        res.status(400);
        throw new Error('You are already attending this event');
    }

    // Add user to attendees list
    event.attendees.push(userId);
    await event.save();

    // Optionally, you could also add the event to the user's attendedEvents list in the User model

    res.status(200).json({
        success: true,
        data: event.attendees // Return updated list
    });
});

// @desc    Cancel RSVP to an event
// @route   DELETE /api/events/:id/attend
// @access  Private
exports.unattendEvent = asyncHandler(async (req, res, next) => {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
        res.status(404);
        throw new Error(`Event not found with id of ${eventId}`);
    }

    // Check if user is actually attending
    if (!event.attendees.includes(userId)) {
        res.status(400);
        throw new Error('You are not attending this event');
    }

    // Remove user from attendees list
    event.attendees = event.attendees.filter(attendeeId => attendeeId.toString() !== userId);
    await event.save();

     // Optionally, remove the event from the user's attendedEvents list in the User model

    res.status(200).json({
        success: true,
        data: event.attendees // Return updated list
    });
});
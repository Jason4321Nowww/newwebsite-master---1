const Event = require('../models/Event');

// for not-loggedIn users
const getPublicEvents = async (req, res) => {
  try {
    const events = await Event.find({ visibilityLevel: 0, isActive: true }).populate('attendees.user', 'username roleLevel');
    return res.status(200).json(events);
  } catch (error) {
    console.error('Public events error:', error);
    return res.status(500).json({ message: 'Failed to fetch public events' });
  }
};


// Admin-only: Get all events regardless of role
const getAllEventsForAdmin = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true });
    res.json(events);
  } catch (err) {
    console.error('Admin fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch all events for admin' });
  }
};
// get evetns
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error('Admin fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch all events for admin' });
  }
};


// Create Event
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      isMandatory,
      eventDate,
      repeat,
      visibilityLevel,
      eventLocation
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageUrl = `/uploads/events/${req.file.filename}`;

    const event = new Event({
      title,
      description,
      isMandatory,
      eventDate,
      repeat,
      visibilityLevel,
      eventLocation,
      image: imageUrl,
      date: eventDate, // for backwards compatibility if needed
    });

    await event.save();

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    console.error('Create Event Error:', err);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

//update Event
const updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      isMandatory,
      eventDate,
      repeat,
      eventLocation,
      visibilityLevel
    } = req.body;

    const updatedData = {
      title,
      description,
      isMandatory,
      eventDate,
      repeat,
      eventLocation,
      visibilityLevel,
      date: eventDate // Optional: keep old compatibility
    };

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // If new image uploaded, replace old one
    if (req.file) {
       updatedData.image = `/uploads/events/${req.file.filename}`; 
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updatedData, {
      new: true
    });

    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });

  } catch (err) {
    console.error('Update Event Error:', err);
    res.status(500).json({ message: 'Failed to update event' });
  }
};


// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
   return    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};

// Attend/Unattend
const  toggleAttendance = async (req, res) => {
  const { eventId, attend, anonymous } = req.body;
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const userId = req.user?.id;

  if (attend) {
    // Add attendee
    if (!event.attendees.some(a => a.user?.toString() === userId?.toString())) {
      event.attendees.push({
        user: userId || null,
        isAnonymous: !userId || anonymous,
      });
    }
  } else {
    // Remove attendee
    event.attendees = event.attendees.filter(a =>
      userId ? a.user?.toString() !== userId.toString() : !a.isAnonymous
    );
  }

  await event.save();
  res.json({ attendees: event.attendees.length });
};


module.exports = {getEvents,
  getPublicEvents,   getAllEventsForAdmin, createEvent, updateEvent, deleteEvent, toggleAttendance}

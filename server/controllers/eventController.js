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
// Get events filtered by user's role and location (eventType-based)
// eventType:
//   oeffentlich        → everyone
//   nationalversammlung→ all logged-in users
//   lokalversammlung   → roles 4,5,6 + location
//   regionalversammlung→ roles 3,4,5,6 + location
//   rv_zusammenkunft   → roles 1,2,3 (no location filter)
//   lv_zusammenkunft   → roles 3,4 + location
//   vorstand           → roles 0,1,2
//   vorsitzende        → roles 0,1
//   admin              → role 0 only
const getEvents = async (req, res) => {
  try {
    let query = { isActive: true };

    if (!req.user) {
      query.eventType = 'oeffentlich';
    } else {
      const roleLevel = req.user.roleLevel;
      const userLocation = req.user.userLocation || '';

      if (roleLevel === 0) {
        // Admin: sees all events — no additional filter
      } else {
        const locationMatch = [
          { eventLocation: '' },
          { eventLocation: null },
          { eventLocation: { $exists: false } },
          { eventLocation: userLocation },
        ];

        const conditions = [
          { eventType: 'oeffentlich' },
          { eventType: 'nationalversammlung' },
        ];

        if (roleLevel === 1) {
          conditions.push({ eventType: 'vorsitzende' });
          conditions.push({ eventType: 'vorstand' });
          conditions.push({ eventType: 'rv_zusammenkunft' });
        } else if (roleLevel === 2) {
          conditions.push({ eventType: 'vorstand' });
          conditions.push({ eventType: 'rv_zusammenkunft' });
        } else if (roleLevel === 3) {
          conditions.push({ eventType: 'rv_zusammenkunft' });
          conditions.push({ $and: [{ eventType: 'lv_zusammenkunft' }, { $or: locationMatch }] });
          conditions.push({ $and: [{ eventType: 'regionalversammlung' }, { $or: locationMatch }] });
        } else if (roleLevel === 4) {
          conditions.push({ $and: [{ eventType: 'lv_zusammenkunft' }, { $or: locationMatch }] });
          conditions.push({ $and: [{ eventType: 'regionalversammlung' }, { $or: locationMatch }] });
          conditions.push({ $and: [{ eventType: 'lokalversammlung' }, { $or: locationMatch }] });
        } else if (roleLevel === 5) {
          conditions.push({ $and: [{ eventType: 'regionalversammlung' }, { $or: locationMatch }] });
          conditions.push({ $and: [{ eventType: 'lokalversammlung' }, { $or: locationMatch }] });
        } else if (roleLevel === 6) {
          conditions.push({ $and: [{ eventType: 'lokalversammlung' }, { $or: locationMatch }] });
        }

        query.$or = conditions;
      }
    }

    const events = await Event.find(query);
    res.json(events);
  } catch (err) {
    console.error('Events fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};


// Create Event
const createEvent = async (req, res) => {
  try {
    const {
      title, title_it, title_fr, title_en,
      description, description_it, description_fr, description_en,
      isMandatory,
      eventDate,
      repeat,
      repeatEveryWeeks,
      eventType,
      eventLocation
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageUrl = `/uploads/events/${req.file.filename}`;

    const event = new Event({
      title, title_it, title_fr, title_en,
      description, description_it, description_fr, description_en,
      isMandatory,
      eventDate,
      repeat,
      repeatEveryWeeks: Number(repeatEveryWeeks) || 0,
      eventType: eventType || 'oeffentlich',
      eventLocation,
      image: imageUrl,
      date: eventDate,
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
      title, title_it, title_fr, title_en,
      description, description_it, description_fr, description_en,
      isMandatory,
      eventDate,
      repeat,
      repeatEveryWeeks,
      eventType,
      eventLocation,
    } = req.body;

    const updatedData = {
      title, title_it, title_fr, title_en,
      description, description_it, description_fr, description_en,
      isMandatory,
      eventDate,
      repeat,
      repeatEveryWeeks: Number(repeatEveryWeeks) || 0,
      eventType: eventType || 'oeffentlich',
      eventLocation,
      date: eventDate,
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

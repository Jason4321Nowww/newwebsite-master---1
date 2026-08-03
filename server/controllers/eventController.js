const Event = require('../models/Event');

// Strip tracking fields (ip, visitorId) from attendees before sending to client
const sanitiseEvent = (eventObj, userId, visitorId) => {
  const isAttending = eventObj.attendees.some(a =>
    (userId    && a.user?.toString() === userId) ||
    (visitorId && a.visitorId === visitorId)
    // IP intentionally excluded: shared NAT IPs would mark every user on the
    // same network as attending whenever one person joins
  );
  return {
    ...eventObj,
    attendeesCount: eventObj.attendees.length,
    isAttending,
    attendees: eventObj.attendees.map(a => ({
      user:        a.user,
      isAnonymous: a.isAnonymous,
    })),
  };
};

// for not-loggedIn users
const getPublicEvents = async (req, res) => {
  try {
    const visitorId = req.headers['x-visitor-id'] || null;
    const clientIp  = req.ip;
    const events    = await Event.find({ visibilityLevel: 0, isActive: true })
      .populate('attendees.user', 'username roleLevel');
    return res.status(200).json(
      events.map(e => sanitiseEvent(e.toObject({ virtuals: true }), null, visitorId))
    );
  } catch (error) {
    console.error('Public events error:', error);
    return res.status(500).json({ message: 'Failed to fetch public events' });
  }
};

// Admin-only: Get all events regardless of role (includes tracking fields for admin visibility)
const getAllEventsForAdmin = async (_req, res) => {
  try {
    const events = await Event.find({ isActive: true })
        .populate('attendees.user', 'username roleLevel')
        .sort({ eventDate: 1 });
    res.json(events);
  } catch (err) {
    console.error('Admin fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch all events for admin' });
  }
};

const getEvents = async (req, res) => {
  try {
    let query = { isActive: true };

    if (!req.user) {
      query.eventType = 'oeffentlich';
    } else {
      const { roleLevel } = req.user;
      const loc          = req.user.userLocation || {};
      const userKanton   = typeof loc === 'object' ? (loc.kantonCode || '') : '';
      const userGemeinde = typeof loc === 'object' ? (loc.gemeinde   || '') : '';

      if (roleLevel === 0) {
        // Superadmin: sees all events
      } else {
        const conditions = [{ eventType: 'oeffentlich' }];
        conditions.push({ eventType: 'intern' }); // all logged-in users (incl. roleLevel 7+8)
        if (roleLevel === 1) conditions.push({ eventType: 'vorsitzende' });
        if (roleLevel <= 3)  conditions.push({ eventType: 'vorstand' });
        if (roleLevel <= 6)  conditions.push({ eventType: 'nationalversammlung' });
        if (roleLevel <= 4)  conditions.push({ eventType: 'rv_zusammenkunft' });

        if (roleLevel <= 3) {
          conditions.push({ eventType: 'regionalversammlung' });
        } else if (roleLevel <= 7 && userKanton) {
          conditions.push({ eventType: 'regionalversammlung', 'eventLocation.kantonCode': userKanton });
        }

        if (roleLevel <= 3) {
          conditions.push({ eventType: 'lokalversammlung' });
        } else if (roleLevel <= 7 && userGemeinde) {
          conditions.push({ eventType: 'lokalversammlung', 'eventLocation.gemeinde': userGemeinde });
        }

        if (roleLevel <= 3) {
          conditions.push({ eventType: 'lv_zusammenkunft' });
        } else if (roleLevel === 4 && userKanton) {
          conditions.push({ eventType: 'lv_zusammenkunft', 'eventLocation.kantonCode': userKanton });
        } else if (roleLevel === 5 && userGemeinde) {
          conditions.push({ eventType: 'lv_zusammenkunft', 'eventLocation.gemeinde': userGemeinde });
        }

        query.$or = conditions;
      }
    }

    const userId    = req.user?.id?.toString() || null;
    const visitorId = req.headers['x-visitor-id'] || null;
    const clientIp  = req.ip;

    const events = await Event.find(query);
    res.json(events.map(e => sanitiseEvent(e.toObject({ virtuals: true }), userId, visitorId)));
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
      isMandatory, eventDate, repeat, repeatEndDate, eventType,
      eventLocation: eventLocationRaw
    } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    let eventLocation = { kantonCode: '', bezirk: '', gemeinde: '' };
    try { if (eventLocationRaw) eventLocation = JSON.parse(eventLocationRaw); } catch {}

    const event = new Event({
      title, title_it, title_fr, title_en,
      description, description_it, description_fr, description_en,
      isMandatory,
      eventDate,
      repeat,
      repeatEndDate: repeatEndDate || null,
      eventType: eventType || 'oeffentlich',
      eventLocation,
      image: `/uploads/events/${req.file.filename}`,
      date: eventDate,
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    console.error('Create Event Error:', err);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const {
      title, title_it, title_fr, title_en,
      description, description_it, description_fr, description_en,
      isMandatory, eventDate, repeat, repeatEndDate, eventType,
      eventLocation: eventLocationRaw,
    } = req.body;

    let eventLocation = { kantonCode: '', bezirk: '', gemeinde: '' };
    try { if (eventLocationRaw) eventLocation = JSON.parse(eventLocationRaw); } catch {}

    const updatedData = {
      title, title_it, title_fr, title_en,
      description, description_it, description_fr, description_en,
      isMandatory, eventDate, repeat,
      repeatEndDate: repeatEndDate || null,
      eventType: eventType || 'oeffentlich',
      eventLocation,
      date: eventDate,
    };

    if (!await Event.findById(req.params.id)) return res.status(404).json({ message: 'Event not found' });

    if (req.file) updatedData.image = `/uploads/events/${req.file.filename}`;

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (err) {
    console.error('Update Event Error:', err);
    res.status(500).json({ message: 'Failed to update event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};

// Attend/Unattend
// Uniqueness: logged-in users by userId; guests by visitorId OR IP
const toggleAttendance = async (req, res) => {
  try {
    const { eventId, attend, anonymous, visitorId } = req.body;
    const userId   = req.user?.id?.toString() || null;
    const clientIp = req.ip;

    let updated;

    if (attend) {
      // Build uniqueness condition — reject if any matching identifier already present
      let condition;
      if (userId) {
        condition = { _id: eventId, 'attendees.user': { $ne: userId } };
      } else {
        // For guests: block by visitorId OR by IP (but only against other anonymous records,
        // not against logged-in users who happen to share the same NAT IP)
        condition = {
          _id: eventId,
          $nor: [
            ...(visitorId ? [{ attendees: { $elemMatch: { visitorId } } }] : []),
            { attendees: { $elemMatch: { ip: clientIp, user: null } } },
          ],
        };
      }

      const newAttendee = {
        user:        userId || null,
        isAnonymous: !userId || !!anonymous,
        visitorId:   visitorId || null,
        ip:          clientIp,
      };

      updated = await Event.findOneAndUpdate(
        condition,
        { $push: { attendees: newAttendee } },
        { new: true }
      );

      // Condition didn't match — already attending, just return current count
      if (!updated) updated = await Event.findById(eventId);
    } else {
      // Remove this specific attendee
      let pullFilter;
      if (userId) {
        pullFilter = { user: userId };
      } else if (visitorId) {
        pullFilter = { visitorId };
      } else {
        pullFilter = { ip: clientIp, user: null };
      }

      updated = await Event.findByIdAndUpdate(
        eventId,
        { $pull: { attendees: pullFilter } },
        { new: true }
      );
    }

    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.json({ attendees: updated.attendees.length });
  } catch (err) {
    console.error('toggleAttendance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEvents, getPublicEvents, getAllEventsForAdmin,
  createEvent, updateEvent, deleteEvent, toggleAttendance,
};

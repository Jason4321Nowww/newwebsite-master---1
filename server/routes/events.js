const express = require('express');
const router = express.Router();
const { optionalAuthMiddleware } = require('../middlewares/authMiddleware');
const {getEvents,       getPublicEvents,
   getAllEventsForAdmin, createEvent, updateEvent, deleteEvent, toggleAttendance} = require('../controllers/eventController');
const uploadEvent = require('../middlewares/uploadEvent');

router.get('/admin', getAllEventsForAdmin); // Show events by role
// router.get('/', authMiddleware, getEvents); // Show events by role
router.post('/', uploadEvent.single('image') ,createEvent); // Create event
router.put('/:id', uploadEvent.single('image'), updateEvent);
router.delete('/:id',  deleteEvent);
router.post('/attend', optionalAuthMiddleware, toggleAttendance); // Attend/unattend
router.get('/public', getPublicEvents); // no login needed

router.get('/events', optionalAuthMiddleware, getEvents); // role-filtered


module.exports = router;

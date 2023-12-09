const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsInRadius,
} = require('../controllers/events');
const router = express.Router();

router.route('/radius/:lat/:long/:distance').get(getEventsInRadius);

router.route('/').get(getEvents).post(createEvent);
router.route('/:id').get(getEvent).put(updateEvent).delete(deleteEvent);

module.exports = router;

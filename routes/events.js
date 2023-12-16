const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsInRadius,
  eventUploadPhoto,
} = require('../controllers/events');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.route('/radius/:lat/:long/:distance').get(getEventsInRadius);

router
  .route('/')
  .get(getEvents)
  .post(protect, authorize('organization', 'admin'), createEvent);
router
  .route('/:id')
  .get(getEvent)
  .put(protect, authorize('organization', 'admin'), updateEvent)
  .delete(protect, authorize('organization', 'admin'), deleteEvent);

router
  .route('/:id/photo')
  .put(protect, authorize('organization', 'admin'), eventUploadPhoto);

module.exports = router;

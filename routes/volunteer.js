const express = require('express');
const { sendRequest, requestStatus } = require('../controllers/volunteer');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.route('/sendrequest').post(protect, sendRequest);
router
  .route('/:id')
  .put(protect, authorize('organization', 'admin'), requestStatus);

module.exports = router;

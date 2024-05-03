const express = require('express');
const {
  createForum,
  updateForum,
  deleteForum,
  getForumData,
  getForumDataList,
} = require('../controllers/forum');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(protect, authorize('organization', 'admin'), createForum);
router
  .route('/:id')
  .get(protect, authorize('organization', 'admin'), getForumData)
  .put(protect, authorize('organization', 'admin'), updateForum)
  .delete(protect, authorize('organization', 'admin'), deleteForum);

router.route('/forumList').get(protect, getForumDataList);

module.exports = router;

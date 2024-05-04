const express = require('express');
const {
  createPost,
  updatePost,
  deletePost,
  getPostDataList,
} = require('../controllers/posts');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.route('/').post(protect, authorize('organization', 'admin'), createPost);
router
  .route('/:id')
  .get(protect, getPostDataList)
  .put(protect, authorize('organization', 'admin'), updatePost)
  .delete(protect, authorize('organization', 'admin'), deletePost);

module.exports = router;

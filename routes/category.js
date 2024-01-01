const express = require('express');
const {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getCategory)
  .post(protect, authorize('organization', 'admin'), createCategory);

router
  .route('/:id')
  .put(protect, authorize('organization', 'admin'), updateCategory)
  .delete(protect, authorize('organization', 'admin'), deleteCategory);

module.exports = router;

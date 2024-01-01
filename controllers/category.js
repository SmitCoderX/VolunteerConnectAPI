const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');

//  @desc   Create new Category
//  @route  POST /api/v1/category
//  @access Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const create = await Category.create(req.body);
  res.status(201).json({
    success: true,
    data: create,
  });
});

//  @desc   Update Category
//  @route  PUT /api/v1/category/:id
//  @access Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  if (!category) {
    return next(
      new ErrorResponse(`Category does not Exist ${req.params.id}`, 404)
    );
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: category,
  });
});

//  @desc   Delete Category
//  @route  DELETE /api/v1/category/:id
//  @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category does not Exist ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: [],
  });
});

// @desc    Get CategoryList
// @route   GET /api/v1/category
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.find();

  res.status(200).json({
    success: true,
    data: category,
  });
});

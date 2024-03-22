const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Forum = require('../models/Forum');

// @desc    Create new Forum
// @route   POST /api/v1/forum
// @access  Private
exports.createForum = asyncHandler(async (req, res, next) => {
  const create = await Forum.create(req.body);
  res.status(200).json({
    success: true,
    data: create,
  });
});

// @desc    Update Forum
// @route   PUT /api/v1/forum/:id
// @access  Private
exports.updateForum = asyncHandler(async (req, res, next) => {
  let forum = await Forum.findById(req.params.id);
  if (!forum) {
    return next(
      new ErrorResponse(`Forum does not Exist ${req.params.id}`, 404)
    );
  }

  forum = await Forum.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: forum,
  });
});

// @desc    Delete Forum
// @route   DELETE /api/v1/forum/:id
// @access  Private
exports.deleteForum = asyncHandler(async (req, res, next) => {
  const forum = await Forum.findByIdAndDelete(req.params.id);
  if (!forum) {
    return next(
      new ErrorResponse(`Forum Does not Exist ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: [],
  });
});

// @desc    Get Forum Data
// @route   GET /api/v1/forum/:id
// @access  Private
exports.getForumData = asyncHandler(async (req, res, next) => {
  const forum = await Forum.findById(req.params.id);

  if (!forum) {
    return next(
      new ErrorResponse(`Forum not Found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: forum,
  });
});

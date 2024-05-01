const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Posts = require('../models/Posts');
const Forum = require('../models/Forum');

// @desc    Create new Post
// @route   POST /api/v1/post
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  const create = await Posts.create(req.body);
  let forum = await Forum.findById(req.body.forumId);
  forum = await Forum.findOneAndUpdate(
    { _id: req.body.forumId },
    { $push: { posts: create.id } }
  );

  res.status(200).json({
    success: true,
    data: create,
  });
});

// @desc    Update Posts
// @route   PUT /api/v1/post/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Posts.findById(req.params.id);
  if (!post) {
    return next(new ErrorResponse(`Post does not Exist ${req.params.id}`, 404));
  }

  forum = await Posts.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Delete Post
// @route   DELETE /api/v1/post/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  let post = await Posts.findById(req.params.id);
  let forum = await Forum.findById(post.forumId);
  forum = await Forum.findOneAndUpdate(
    { _id: post.forumId },
    { $pull: { posts: req.params.id } }
  );
  post = await Posts.findByIdAndDelete(req.params.id);
  if (!post) {
    return next(new ErrorResponse(`Post Does not Exist ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: [],
  });
});

// @desc    Get Posts Data List By ForumId
// @route   GET /api/v1/post/:id
// @access  Private
exports.getPostDataList = asyncHandler(async (req, res, next) => {
  const posts = await Posts.find({ forumId: req.params.id });

  if (!posts) {
    return next(
      new ErrorResponse(`User not Found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: posts,
  });
});

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/Users');

//  @desc   Register User
//  @route  GET /api/v1/auth/register
//  @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, name, email, role, password } = req.body;

  // Create User
  const user = await User.create({ username, name, email, role, password });

  // Create Token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token: token,
  });
});

//  @desc   Login User
//  @route  POST /api/v1/auth/user/login
//  @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;

  // Validate Email and Username and password
  if ((!!email && !!username) || (!!email && !!username) || !password) {
    return next(
      new ErrorResponse('Please Provide an email or Username and Password', 400)
    );
  }

  // Check for the user
  const user = await User.findOne(email ? { email } : { username }).select(
    '+password'
  );

  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  // Create Token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token: token,
  });
});

//  @desc   Get Current Loggedin User
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

//  @desc   Get User Data
// @route   GET /api/v1/auth/user/:id
// @access  Private
exports.getUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not Found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

//  @desc   Register User
//  @route  POST /api/v1/auth/register
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

//  @desc     Forgot Password
//  @route    POST /api/v1/auth/forgotpassword
//  @access   Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get Reset Token
  const resetToken = user.getResetPasswordToken();
  await user.save({
    validateBeforeSave: false,
  });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset Token',
      message,
    });

    res.status(200).json({
      success: true,
      message: 'Email Sent',
    });
  } catch (error) {
    console.error(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be send', 500));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

//  @desc   Reset Password
// @route   GET /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Create Token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token: token,
  });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id).select('+password');

  // Check Current Password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  // Create Token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token: token,
  });
});

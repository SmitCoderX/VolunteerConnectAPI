const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please Add a username'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please Add a Name'],
  },
  photos: {
    type: String,
    default: 'no-photo.jpg',
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please use a valid URL with HTTP or HTTPS',
    ],
    required: [true, 'Please Add an Email'],
    unique: true,
  },
  role: {
    type: String,
    enum: ['volunteer', 'organization'],
    default: 'volunteer',
  },
  password: {
    type: String,
    required: [true, 'Please Add a Password'],
    minlength: 6,
    select: false,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please Add a Phone Number'],
    unique: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt Password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Set Profile Picture from multiavatar
UserSchema.pre('save', async function (next) {
  this.photos = `https://api.multiavatar.com/${this.username}.png?apiKey=dBi8f4ezwYg07V`;
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match User entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  // Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash Token and set to resetPasswordToken Field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);

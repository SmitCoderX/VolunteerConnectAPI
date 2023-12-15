const express = require('express');
const {
  register,
  getUserData,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/user/:id', protect, getUserData);
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
module.exports = router;

const express = require('express');
const { register, getUserData, login } = require('../controllers/auth');

const router = express.Router();

router.get('/user/:id', getUserData);
router.post('/register', register);
router.post('/login', login);

module.exports = router;

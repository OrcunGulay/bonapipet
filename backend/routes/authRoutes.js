const express = require('express');
const router = express.Router();
const { login, logout, verify } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/verify', authMiddleware, verify);

module.exports = router;

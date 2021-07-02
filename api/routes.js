const express = require('express');

const authController = require('./controllers/auth');

const router = express.Router();

router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.get('/auth/token', authController.token);

module.exports = router;

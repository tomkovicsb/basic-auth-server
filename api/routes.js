const express = require('express');

const authController = require('./controllers/auth');
const userController = require('./controllers/user');

const isAuthenticated = require('./middlewares/isAuthenticated');
const isObjectId = require('./middlewares/isObjectId');
const responseCache = require('./middlewares/responseCache');

const router = express.Router();

router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.get('/auth/token', authController.token);

router.get('/user', [isAuthenticated, responseCache('userCache')], userController.getUser);
router.get('/user/:userId', [isObjectId(['userId']), responseCache('profileCache')], userController.getPublicProfile);
router.post('/user', [isAuthenticated], userController.updateUser);


module.exports = router;

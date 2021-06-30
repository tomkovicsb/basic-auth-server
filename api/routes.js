const express = require('express');

const router = express.Router();

router.post('/auth/login');
router.post('/auth/register');
router.get('/auth/token');
router.post('/user/:userId');
router.get('/user/:userId');

module.exports = router;

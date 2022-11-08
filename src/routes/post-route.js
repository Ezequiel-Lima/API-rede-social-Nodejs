'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/post-controller');
const authService = require('../services/auth-service');

router.get('/', controller.get);
router.post('/', controller.post);
router.patch('/:id', controller.patch);

module.exports = router;
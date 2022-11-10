'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/empresa-controller');
const authService = require('../services/auth-service');

router.get('/', controller.get);
router.post('/', controller.post);
router.patch('/:id', authService.authorize, controller.patch);
router.put('/:id', authService.authorize, controller.put);
router.post('/authenticate', controller.authenticate);
router.post('/refresh-token', authService.authorize, controller.refreshToken);

module.exports = router;
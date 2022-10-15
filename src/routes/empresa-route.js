'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/empresa-controller');

router.get('/', controller.get);
router.post('/', controller.post);
router.patch('/:id', controller.patch);
router.put('/:id', controller.put);

module.exports = router;
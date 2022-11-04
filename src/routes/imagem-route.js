'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/imagem-controller');

router.get('/', controller.get);
router.post('/', controller.post);
router.patch('/:id', controller.patch);

module.exports = router;
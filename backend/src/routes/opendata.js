const express = require('express');
const router = express.Router();
const openDataController = require('../controllers/openDataController');

router.get('/', openDataController.getData);

module.exports = router;
const express = require('express');
const router = express.Router();
const proximiteController = require('../controllers/proximiteController');

router.get('/:lat/:lng', proximiteController.getProximiteData);

module.exports = router;
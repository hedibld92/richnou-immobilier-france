const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, searchController.getSavedSearches);
router.post('/', verifyToken, searchController.saveSearch);
router.delete('/:id', verifyToken, searchController.deleteSearch);

module.exports = router;
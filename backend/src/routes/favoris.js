const express = require('express');
const router = express.Router();
const favorisController = require('../controllers/favorisController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, favorisController.getFavoris);
router.post('/', verifyToken, favorisController.addFavori);
router.delete('/:id', verifyToken, favorisController.removeFavori);

module.exports = router;  
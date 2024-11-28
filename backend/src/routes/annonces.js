const express = require('express');
const router = express.Router();
const annonceController = require('../controllers/annonceController');
const { verifyToken } = require('../middleware/auth');

// Routes publiques
router.get('/', annonceController.getAllAnnonces);
router.get('/:id', annonceController.getAnnonceById);

// Routes protégées
router.post('/', verifyToken, annonceController.createAnnonce);
router.put('/:id', verifyToken, annonceController.updateAnnonce);
router.delete('/:id', verifyToken, annonceController.deleteAnnonce);

module.exports = router;
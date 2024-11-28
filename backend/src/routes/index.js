const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const annoncesRoutes = require('./annonces');
const authRoutes = require('./auth');
const searchRoutes = require('./search');
const favorisRoutes = require('./favoris');
const proximityRoutes = require('./proximity');

// Routes publiques
router.use('/auth', authRoutes);

// Routes protégées
router.use(auth.verifyToken);
router.use('/annonces', annoncesRoutes);
router.use('/search', searchRoutes);
router.use('/favoris', favorisRoutes);
router.use('/proximity', proximityRoutes);

module.exports = router;
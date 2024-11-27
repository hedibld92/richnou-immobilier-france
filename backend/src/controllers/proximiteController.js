const OpenDataService = require('../services/openDataService');

exports.getProximiteData = async (req, res) => {
    try {
        const { lat, lng } = req.params;
        const radius = req.query.radius || 1000;

        // Exécution parallèle des requêtes
        const [ecoles, commerces, transports] = await Promise.all([
            OpenDataService.getEtablissementsScolaires(lat, lng, radius),
            OpenDataService.getCommerces(lat, lng, radius),
            OpenDataService.getTransports(lat, lng)
        ]);

        res.json({
            ecoles,
            commerces,
            transports
        });
    } catch (error) {
        console.error('Erreur proximité:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des données de proximité' });
    }
};
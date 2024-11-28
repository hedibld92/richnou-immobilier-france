const proximityService = require('../services/proximityService');

exports.getProximityServices = async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ message: 'Adresse requise' });
    }

    const services = await proximityService.getAllProximityServices(address);
    res.json(services);
  } catch (error) {
    console.error('Erreur controller proximité:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des services de proximité' });
  }
};
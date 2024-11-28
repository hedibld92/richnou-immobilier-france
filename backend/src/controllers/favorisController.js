const Favoris = require('../models/Favoris');

// Définir le contrôleur comme un objet
const favorisController = {
  // Méthode pour récupérer tous les favoris
  getFavoris: async (req, res) => {
    try {
      const favoris = await Favoris.find({ userId: req.user.userId })
        .populate('annonceId'); // Si vous voulez les détails de l'annonce
      res.json(favoris);
    } catch (error) {
      res.status(500).json({ 
        message: "Erreur lors de la récupération des favoris", 
        error: error.message 
      });
    }
  },

  // Méthode pour ajouter un favori
  addFavori: async (req, res) => {
    try {
      const newFavori = new Favoris({
        userId: req.user.userId,
        annonceId: req.body.annonceId
      });
      await newFavori.save();
      res.status(201).json(newFavori);
    } catch (error) {
      res.status(500).json({ 
        message: "Erreur lors de l'ajout aux favoris", 
        error: error.message 
      });
    }
  },

  // Méthode pour supprimer un favori
  removeFavori: async (req, res) => {
    try {
      const result = await Favoris.findOneAndDelete({ 
        _id: req.params.id, 
        userId: req.user.userId 
      });
      if (!result) {
        return res.status(404).json({ message: "Favori non trouvé" });
      }
      res.json({ message: "Favori supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ 
        message: "Erreur lors de la suppression du favori", 
        error: error.message 
      });
    }
  }
};

module.exports = favorisController;
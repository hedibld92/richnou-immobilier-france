const Annonce = require('../models/annonce');

const annonceController = {
  getAllAnnonces: async (req, res) => {
    try {
      const annonces = await Annonce.find();
      res.json(annonces);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des annonces", error: error.message });
    }
  },

  getAnnonceById: async (req, res) => {
    try {
      const annonce = await Annonce.findById(req.params.id);
      if (!annonce) {
        return res.status(404).json({ message: "Annonce non trouvée" });
      }
      res.json(annonce);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération de l'annonce", error: error.message });
    }
  },

  createAnnonce: async (req, res) => {
    try {
      const newAnnonce = new Annonce(req.body);
      await newAnnonce.save();
      res.status(201).json(newAnnonce);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création de l'annonce", error: error.message });
    }
  },

  updateAnnonce: async (req, res) => {
    try {
      const annonce = await Annonce.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!annonce) {
        return res.status(404).json({ message: "Annonce non trouvée" });
      }
      res.json(annonce);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'annonce", error: error.message });
    }
  },

  deleteAnnonce: async (req, res) => {
    try {
      const annonce = await Annonce.findByIdAndDelete(req.params.id);
      if (!annonce) {
        return res.status(404).json({ message: "Annonce non trouvée" });
      }
      res.json({ message: "Annonce supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression de l'annonce", error: error.message });
    }
  }
};

module.exports = annonceController;
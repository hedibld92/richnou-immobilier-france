const Annonce = require('../models/annonce');

const annonceController = {
  createAnnonce: async (req, res) => {
    try {
      console.log('Données reçues:', req.body);
      console.log('Fichiers reçus:', req.files);

      // Création de l'objet annonce
      const annonceData = {
        titre: req.body.titre,
        type: req.body.type,
        prix: Number(req.body.prix),
        ville: req.body.ville,
        description: req.body.description,
        images: req.files ? req.files.map(file => `/uploads/annonces/${file.filename}`) : [],
        caracteristiques: req.body.caracteristiques ? JSON.parse(req.body.caracteristiques) : []
      };

      console.log('Données à sauvegarder:', annonceData);

      // Création et sauvegarde de l'annonce
      const annonce = new Annonce(annonceData);
      const savedAnnonce = await annonce.save();

      console.log('Annonce sauvegardée:', savedAnnonce);

      // Renvoyer l'annonce créée
      res.status(201).json({
        _id: savedAnnonce._id,
        titre: savedAnnonce.titre,
        type: savedAnnonce.type,
        prix: savedAnnonce.prix,
        ville: savedAnnonce.ville,
        description: savedAnnonce.description,
        images: savedAnnonce.images,
        caracteristiques: savedAnnonce.caracteristiques,
        createdAt: savedAnnonce.createdAt
      });

    } catch (error) {
      console.error('Erreur détaillée:', error);
      res.status(500).json({ 
        message: "Erreur lors de la création de l'annonce", 
        error: error.message
      });
    }
  },

  getAllAnnonces: async (req, res) => {
    try {
      const annonces = await Annonce.find().sort({ createdAt: -1 });
      res.json(annonces);
    } catch (error) {
      res.status(500).json({ 
        message: "Erreur lors de la récupération des annonces",
        error: error.message 
      });
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
      res.status(500).json({ 
        message: "Erreur lors de la récupération de l'annonce",
        error: error.message 
      });
    }
  },

  searchAnnonces: async (req, res) => {
    try {
      const query = {};
      
      if (req.query.ville) {
        query.ville = new RegExp(req.query.ville, 'i');
      }
      if (req.query.type) {
        query.type = req.query.type;
      }
      if (req.query.prixMax) {
        query.prix = { $lte: Number(req.query.prixMax) };
      }

      const annonces = await Annonce.find(query).sort({ createdAt: -1 });
      res.json(annonces);
    } catch (error) {
      res.status(500).json({ 
        message: "Erreur lors de la recherche d'annonces",
        error: error.message 
      });
    }
  },

  deleteAnnonce: async (req, res) => {
    try {
      const annonce = await Annonce.findById(req.params.id);
      
      if (!annonce) {
        return res.status(404).json({ message: "Annonce non trouvée" });
      }
  
      // Supprimer les images associées
      if (annonce.images && annonce.images.length > 0) {
        const fs = require('fs');
        const path = require('path');
        
        annonce.images.forEach(imagePath => {
          const fullPath = path.join(__dirname, '../../', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
  
      // Supprimer l'annonce de la base de données
      await Annonce.findByIdAndDelete(req.params.id);
      
      res.json({ message: "Annonce supprimée avec succès" });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      res.status(500).json({ 
        message: "Erreur lors de la suppression de l'annonce",
        error: error.message 
      });
    }
  }
};



module.exports = annonceController;
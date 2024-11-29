const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const annonceController = require('../controllers/annonceController'); 
const Annonce = require('../models/annonce');


const uploadDir = path.join(__dirname, '../../uploads/annonces');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

router.put('/:id', upload.array('images'), async (req, res) => {
    try {
      const annonceId = req.params.id;
      const updateData = {
        titre: req.body.titre,
        description: req.body.description,
        prix: req.body.prix,
        ville: req.body.ville,
        type: req.body.type
      };
  
      
      if (req.files && req.files.length > 0) {
        const newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
        updateData.images = newImagePaths;
      }
  
      const updatedAnnonce = await Annonce.findByIdAndUpdate(
        annonceId,
        updateData,
        { new: true }
      );
  
      if (!updatedAnnonce) {
        return res.status(404).json({ message: "Annonce non trouvée" });
      }
  
      res.json(updatedAnnonce);
    } catch (error) {
      console.error('Erreur lors de la modification de l\'annonce:', error);
      res.status(500).json({ message: "Erreur lors de la modification de l'annonce" });
    }
  });

// Routes
router.post('/', upload.array('images', 5), (req, res, next) => {
  console.log('Route POST /api/annonces appelée');
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  next();
}, annonceController.createAnnonce);

router.get('/', annonceController.getAllAnnonces);
router.get('/search', annonceController.searchAnnonces);
router.get('/:id', annonceController.getAnnonceById);
router.delete('/:id', annonceController.deleteAnnonce);

module.exports = router;
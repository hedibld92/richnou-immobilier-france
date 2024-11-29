const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
    
  titre: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['chateau', 'manoir', 'villa', 'hotel-particulier', 'loft']
  },
  prix: {
    type: Number,
    required: true
  },
  ville: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  surface: { type: Number, required: true },
  pieces: { type: Number, required: true }, 
  images: [{
    type: String
  }],
  caracteristiques: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Annonce', annonceSchema);
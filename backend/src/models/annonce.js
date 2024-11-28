const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  localisation: {
    type: String,
    required: true
  },
  surface: {
    type: Number,
    required: true
  },
  pieces: {
    type: Number,
    required: true
  },
  images: [{
    type: String
  }],
  dateCreation: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Annonce', annonceSchema);
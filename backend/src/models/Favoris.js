const mongoose = require('mongoose');

const favorisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  annonceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Annonce',
    required: true
  },
  dateAjout: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Favoris', favorisSchema);
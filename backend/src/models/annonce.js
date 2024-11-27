const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
    reference: {
        type: String,
        required: true,
        unique: true,
        default: () => Math.random().toString(36).substring(2, 8).toUpperCase()
    },
    titre: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['chateau', 'manoir', 'hotel-particulier', 'villa', 'loft']
    },
    description: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },
    adresse: {
        ville: {
            type: String,
            required: true
        },
        codePostal: {
            type: String,
            required: true
        },
        rue: String
    },
    photos: [String],
    caracteristiques: [String],
    statut: {
        type: String,
        enum: ['disponible', 'vendu', 'option'],
        default: 'disponible'
    },
    dateCreation: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Annonce', annonceSchema);
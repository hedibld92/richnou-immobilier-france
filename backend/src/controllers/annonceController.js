const Annonce = require('../models/annonce');

exports.getAnnonces = async (req, res) => {
    try {
        const annonces = await Annonce.find();
        res.json(annonces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createAnnonce = async (req, res) => {
    try {
        const annonce = new Annonce(req.body);
        const nouvelleAnnonce = await annonce.save();
        res.status(201).json(nouvelleAnnonce);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAnnonceById = async (req, res) => {
    try {
        const annonce = await Annonce.findById(req.params.id);
        if (annonce) {
            res.json(annonce);
        } else {
            res.status(404).json({ message: 'Annonce non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAnnonce = async (req, res) => {
    try {
        const annonce = await Annonce.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(annonce);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteAnnonce = async (req, res) => {
    try {
        await Annonce.findByIdAndDelete(req.params.id);
        res.json({ message: 'Annonce supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchAnnonces = async (req, res) => {
    try {
        const { type, ville, prix_min, prix_max } = req.query;
        let query = {};

        if (type) query.type = type;
        if (ville) query['adresse.ville'] = new RegExp(ville, 'i');
        if (prix_min || prix_max) {
            query.prix = {};
            if (prix_min) query.prix.$gte = Number(prix_min);
            if (prix_max) query.prix.$lte = Number(prix_max);
        }

        const annonces = await Annonce.find(query);
        res.json(annonces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Search = require('../models/Search');

exports.getSavedSearches = async (req, res) => {
  try {
    const searches = await Search.find({ userId: req.user.userId });
    res.json(searches);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des recherches", error: error.message });
  }
};

exports.saveSearch = async (req, res) => {
  try {
    const newSearch = new Search({
      ...req.body,
      userId: req.user.userId
    });
    await newSearch.save();
    res.status(201).json(newSearch);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la sauvegarde de la recherche", error: error.message });
  }
};

exports.deleteSearch = async (req, res) => {
  try {
    await Search.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: "Recherche supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la recherche", error: error.message });
  }
};
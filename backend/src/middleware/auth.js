const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ message: "Un token est requis pour l'authentification" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

exports.checkVendeur = (req, res, next) => {
  if (req.user && req.user.role === 'vendeur') {
    next();
  } else {
    res.status(403).json({ message: "Accès réservé aux vendeurs" });
  }
};
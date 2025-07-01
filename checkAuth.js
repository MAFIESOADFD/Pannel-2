// checkAuth.js

module.exports = function(req, res, next) {
  // Verifică dacă cererea are header-ul 'Authorization' cu o valoare fixă (exemplu)
  const authHeader = req.headers['authorization'];

  if (authHeader === 'Bearer secret-token-ul-tau') {
    // E autorizat
    next(); // continuă execuția rutei
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const express = require('express');
const app = express();

app.use(express.static('public')); // Servește fișierele din folderul 'public'

// alte rute API, middleware, autentificare, etc.

app.listen(3000, () => {
  console.log('Serverul rulează pe portul 3000');
});

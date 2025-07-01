const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const checkAuth = require('./checkAuth'); // dacă ai un middleware de autentificare

app.use(bodyParser.json());

// rutele tale
app.post('/api/delete', checkAuth, (req, res) => {
  // logică aici
  res.send('OK');
});

// pornește serverul
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);

  app.get('/', (req, res) => {
  res.send('Serverul este pornit și funcționează corect!');
});


const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'secret-key-david',
  resave: false,
  saveUninitialized: false,
}));

// Date utilizatori
// Parole simple
const users = {
  admin: { password: 'staffp4k', role: 'Admin' },
  invitat: { password: 'viewp4k', role: 'Invitat' },
};

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if(users[username] && users[username].password === password){
    req.session.user = { username, role: users[username].role };
    res.json({ success: true, role: users[username].role });
  } else {
    res.json({ success: false, message: 'Username sau parola incorectă' });
  }
});

// Logout
app.post('/logout', (req,res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Middleware verificare autentificare
function checkAuth(req, res, next){
  if(req.session.user){
    next();
  } else {
    res.status(401).json({ message: 'Nu ești autentificat!' });
  }
}

// Salvează sancțiuni în JSON
const DATA_FILE = path.join(__dirname, 'data.json');

// Încarcă datele
function loadData(){
  if(!fs.existsSync(DATA_FILE)) return { adminJail: [], ban: [], mute: [], avertismente: [] };
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// Salvează date
function saveData(data){
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Endpoint pentru a adăuga o sancțiune
app.post('/api/add', checkAuth, (req,res) => {
  const { category, entry } = req.body; 
  if(!['adminJail','ban','mute','avertismente'].includes(category)){
    return res.status(400).json({ message: 'Categorie invalidă' });
  }
  const data = loadData();
  data[category].push(entry);
  saveData(data);
  res.json({ success: true });
});

// Endpoint pentru a primi toate sancțiunile
app.get('/api/data', checkAuth, (req,res) => {
  const data = loadData();
  res.json({ success: true, data });
});

// Porneste serverul
app.listen(PORT, () => {
  console.log(`Server pornit la http://localhost:${PORT}`);
});

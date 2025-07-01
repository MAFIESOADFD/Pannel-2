let currentCategory = 'adminJail';
let userRole = null;

const loginForm = document.getElementById('login-form');
const panel = document.getElementById('panel');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const loginError = document.getElementById('login-error');
const roleInfo = document.getElementById('role-info');
const sidebarButtons = document.querySelectorAll('.cat-btn');
const formContainer = document.getElementById('form-container');
const tableContainer = document.getElementById('table-container');

// Funcție pentru schimbare tab / categorie
function setCategory(cat){
  currentCategory = cat;
  sidebarButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  renderForm();
  loadData();
}

// Login
btnLogin.onclick = async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if(!username || !password){
    loginError.textContent = 'Completează toate câmpurile';
    return;
  }

  const res = await fetch('/login', {
    method:'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();

  if(data.success){
    userRole = data.role;
    loginForm.classList.add('hidden');
    panel.classList.remove('hidden');
    roleInfo.textContent = `Ești logat ca: ${username} (${userRole})`;
    setCategory('adminJail');
  } else {
    loginError.textContent = data.message;
  }
};

// Logout
btnLogout.onclick = async () => {
  await fetch('/logout', { method:'POST' });
  userRole = null;
  loginForm.classList.remove('hidden');
  panel.classList.add('hidden');
  clearForm();
  clearTable();
};

// Sidebar buttons
sidebarButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    setCategory(btn.dataset.cat);
  });
});

// Render formular în funcție de categorie
function renderForm(){
  if(userRole === 'viewer'){
    formContainer.innerHTML = `<p>Nu ai permisiunea să adaugi sancțiuni.</p>`;
    return;
  }

  let html = '';
  if(currentCategory === 'adminJail'){
    html = `
      <h3>Adaugă Admin Jail</h3>
      <input id="id" placeholder="ID" />
      <input id="nume" placeholder="Nume" />
      <input id="sanctiune" placeholder="Sancțiune (număr)" type="number" />
      <input id="motiv" placeholder="Motiv" />
      <input id="totalCP" placeholder="Total CP (număr)" type="number" />
      <label><input type="checkbox" id="warn" disabled /> Warn (auto dacă > 200)</label>
      <button id="submit-btn">Adaugă</button>
    `;
  } else if(currentCategory === 'ban'){
    html = `
      <h3>Adaugă Ban</h3>
      <select id="tipBan">
        <option value="temporar">Ban temporar</option>
        <option value="permanent">Ban permanent</option>
      </select>
      <input id="id" placeholder="ID" />
      <input id="nume" placeholder="Nume" />
      <input id="motiv" placeholder="Motiv" />
      <input id="durata" placeholder="Durată (zile)" type="number" />
      <label><input type="checkbox" id="dreptPlata" /> Drept de plată (doar permanent)</label>
      <button id="submit-btn">Adaugă</button>
    `;
  } else if(currentCategory === 'mute'){
    html = `
      <h3>Adaugă Mute</h3>
      <input id="id" placeholder="ID" />
      <input id="nume" placeholder="Nume" />
      <input id="motiv" placeholder="Motiv" />
      <input id="durata" placeholder="Durată (zile)" type="number" />
      <button id="submit-btn">Adaugă</button>
    `;
  } else if(currentCategory === 'avertismente'){
    html = `
      <h3>Adaugă Avertisment Verbal</h3>
      <input id="id" placeholder="ID" />
      <input id="nume" placeholder="Nume" />
      <input id="motiv" placeholder="Motiv" />
      <button id="submit-btn">Adaugă</button>
    `;
  }
  formContainer.innerHTML = html;

  // Eveniment buton adaugare
  const submitBtn = document.getElementById('submit-btn');
  if(submitBtn){
    submitBtn.onclick = onSubmit;
  }

  // Actualizează warn automat pentru Admin Jail
  if(currentCategory === 'adminJail'){
    const totalCPInput = document.getElementById('totalCP');
    const warnCheckbox = document.getElementById('warn');
    totalCPInput.addEventListener('input', () => {
      const val = parseInt(totalCPInput.value);
      if(val > 200){
        warnCheckbox.checked = true;
      } else {
        warnCheckbox.checked = false;
      }
    });
  }
}

// Trimite date către backend
async function onSubmit(){
  let entry = {};
  if(currentCategory === 'adminJail'){
    const id = document.getElementById('id').value.trim();
    const nume = document.getElementById('nume').value.trim();
    const sanctiune = document.getElementById('sanctiune').value.trim();
    const motiv = document.getElementById('motiv').value.trim();
    const totalCP = document.getElementById('totalCP').value.trim();
    const warn = document.getElementById('warn').checked;

    if(!id || !nume || !sanctiune || !motiv || !totalCP){
      alert('Completează toate câmpurile!');
      return;
    }

    entry = { id, nume, sanctiune: `${sanctiune} [${motiv}]`, totalCP: parseInt(totalCP), warn };
  } else if(currentCategory === 'ban'){
    const tipBan = document.getElementById('tipBan').value;
    const id = document.getElementById('id').value.trim();
    const nume = document.getElementById('nume').value.trim();
    const motiv = document.getElementById('motiv').value.trim();
    const durata = document.getElementById('durata').value.trim();
    const dreptPlata = document.getElementById('dreptPlata').checked;

    if(!id || !nume || !motiv || (tipBan === 'temporar' && !durata)){
      alert('Completează toate câmpurile!');
      return;
    }

    entry = { tipBan, id, nume, motiv, durata: durata ? parseInt(durata) : null, dreptPlata };
  } else if(currentCategory === 'mute'){
    const id = document.getElementById('id').value.trim();
    const nume = document.getElementById('nume').value.trim();
    const motiv = document.getElementById('motiv').value.trim();
    const durata = document.getElementById('durata').value.trim();

    if(!id || !nume || !motiv || !durata){
      alert('Completează toate câmpurile!');
      return;
    }
    entry = { id, nume, motiv, durata: parseInt(durata) };
  } else if(currentCategory === 'avertismente'){
    const id = document.getElementById('id').value.trim();
    const nume = document.getElementById('nume').value.trim();
    const motiv = document.getElementById('motiv').value.trim();

    if(!id || !nume || !motiv){
      alert('Completează toate câmpurile!');
      return;
    }
    entry = { id, nume, motiv };
  }

  // Trimite la backend
  const res = await fetch('/api/add', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ category: currentCategory, entry }),
  });

  const data = await res.json();
  if(data.success){
    alert('Sancțiune adăugată cu succes!');
    clearForm();
    loadData();
  } else {
    alert('Eroare la adăugare!');
  }
}

// Încarcă și afișează datele
async function loadData(){
  const res = await fetch('/api/data');
  const data = await res.json();
  if(!data.success) {
    tableContainer.innerHTML = '<p>Eroare la încărcarea datelor.</p>';
    return;
  }

  const allData = data.data[currentCategory];
  if(allData.length === 0){
    tableContainer.innerHTML = '<p>Nu există date în această categorie.</p>';
    return;
  }

  // Construiește tabelul după categorie
  let tableHtml = '<table><thead><tr>';
  if(currentCategory === 'adminJail'){
    tableHtml += '<th>ID</th><th>Nume</th><th>Sancțiune [Motiv]</th><th>Total CP</th><th>Warn</th>';
  } else if(currentCategory === 'ban'){
    tableHtml += '<th>Tip Ban</th><th>ID</th><th>Nume</th><th>Motiv</th><th>Durată</th><th>Drept de plată</th>';
  } else if(currentCategory === 'mute'){
    tableHtml += '<th>ID</th><th>Nume</th><th>Motiv</th><th>Durată</th>';
  } else if(currentCategory === 'avertismente'){
    tableHtml += '<th>ID</th><th>Nume</th><th>Motiv</th>';
  }
  tableHtml += '</tr></thead><tbody>';

  allData.forEach(item => {
    tableHtml += '<tr>';
    if(currentCategory === 'adminJail'){
      tableHtml += `<td>${item.id}</td><td>${item.nume}</td><td>${item.sanctiune}</td><td>${item.totalCP}</td><td>${item.warn ? 'Da' : 'Nu'}</td>`;
    } else if(currentCategory === 'ban'){
      tableHtml += `<td>${item.tipBan}</td><td>${item.id}</td><td>${item.nume}</td><td>${item.motiv}</td><td>${item.durata ?? '-'}</td><td>${item.dreptPlata ? 'Da' : 'Nu'}</td>`;
    } else if(currentCategory === 'mute'){
      tableHtml += `<td>${item.id}</td><td>${item.nume}</td><td>${item.motiv}</td><td>${item.durata}</td>`;
    } else if(currentCategory === 'avertismente'){
      tableHtml += `<td>${item.id}</td><td>${item.nume}</td><td>${item.motiv}</td>`;
    }
    tableHtml += '</tr>';
  });
  tableHtml += '</tbody></table>';

  tableContainer.innerHTML = tableHtml;
}

function clearForm(){
  formContainer.innerHTML = '';
}

function clearTable(){
  tableContainer.innerHTML = '';
}

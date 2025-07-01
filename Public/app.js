document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const panel = document.getElementById('panel');
  const btnLogin = document.getElementById('btn-login');
  const btnLogout = document.getElementById('btn-logout');
  const loginError = document.getElementById('login-error');

  // Login
  btnLogin.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.success) {
      loginForm.classList.add('hidden');
      panel.classList.remove('hidden');
      loginError.textContent = '';
      loadSanctions();
    } else {
      loginError.textContent = data.message || 'Eroare la login';
    }
  });

  // Logout
  btnLogout.addEventListener('click', async () => {
    await fetch('/logout', { method: 'POST' });
    panel.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });

  // Încarcă sancțiuni și afișează în tabel
  async function loadSanctions() {
    const res = await fetch('/api/data');
    if (res.status === 401) {
      alert('Nu ești autentificat!');
      panel.classList.add('hidden');
      loginForm.classList.remove('hidden');
      return;
    }
    const json = await res.json();
    if (json.success) {
      const data = json.data;
      const container = document.getElementById('table-container');
      container.innerHTML = '';

      for (const cat in data) {
        const title = document.createElement('h4');
        title.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        container.appendChild(title);

        if (data[cat].length === 0) {
          container.appendChild(document.createTextNode('Nicio sancțiune'));
          continue;
        }

        const ul = document.createElement('ul');
        data[cat].forEach(item => {
          const li = document.createElement('li');
          li.textContent = JSON.stringify(item);
          ul.appendChild(li);
        });
        container.appendChild(ul);
      }
    }
  }
});

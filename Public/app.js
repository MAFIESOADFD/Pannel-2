function loadSanctions() {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => renderTable(data, selectedCategory));
}

let selectedCategory = 'adminJail'; // default

function changeCategory(category) {
  selectedCategory = category;
  loadSanctions();
}

function renderTable(data, category) {
  const tableContainer = document.getElementById('table-container');
  const entries = data[category];

  if (!entries.length) {
    tableContainer.innerHTML = "<p>Nu există sancțiuni în această categorie.</p>";
    return;
  }

  const headers = Object.keys(entries[0]).filter(key => {
    return !(category === "adminJail" && key === "Sanctiune");
  });

  let html = `
    <table>
      <thead>
        <tr>
          ${headers.map(k => `<th>${k}</th>`).join('')}
          <th>Acțiuni</th>
        </tr>
      </thead>
      <tbody>
        ${entries.map((entry, index) => `
          <tr>
            ${headers.map(k => `<td>${entry[k]}</td>`).join('')}
            <td><button onclick="deleteSanction('${category}', ${index})">🗑️ Șterge</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  tableContainer.innerHTML = html;
}

function deleteSanction(category, index) {
  if (!confirm('Ești sigur că vrei să ștergi această sancțiune?')) return;

  fetch('/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, index })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Sancțiunea a fost ștearsă.');
        loadSanctions();
      } else {
        alert('Eroare la ștergere.');
      }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSanctions();
});

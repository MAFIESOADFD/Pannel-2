app.post('/api/delete', checkAuth, (req, res) => {
  const { category, index } = req.body;
  const data = loadData();

  if (!data[category]) {
    return res.status(400).json({ success: false, message: 'Categorie invalidă' });
  }

  if (index < 0 || index >= data[category].length) {
    return res.status(400).json({ success: false, message: 'Index invalid' });
  }

  data[category].splice(index, 1);
  saveData(data);

  res.json({ success: true });
});

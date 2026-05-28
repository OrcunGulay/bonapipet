const jwt = require('jsonwebtoken');
require('dotenv').config();
const token = jwt.sign({ id: 1, username: 'admin' }, process.env.JWT_SECRET || 'gizli_anahtar', { expiresIn: '1h' });

(async () => {
  try {
    const FormData = require('form-data');
    const form = new FormData();
    form.append('no', 'Test Urun Yeni');
    form.append('aciklama', 'Test aciklama');
    form.append('meta', '');
    form.append('keyword', '');
    form.append('kategori', 'duz-pipet');
    form.append('dil', 'tr');

    const res = await fetch('http://127.0.0.1:5051/api/admin/products', {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      },
      body: form
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log('Error:', err.message);
  }
})();

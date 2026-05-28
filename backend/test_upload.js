const fs = require('fs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

async function upload() {
  const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'gizli_sir', { expiresIn: '1h' });

  const form = new FormData();
  form.append('kategori', 'duz-pipet');
  
  fs.writeFileSync('dummy.jpg', 'dummy content');
  const blob = new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' });
  form.append('resim', blob, 'dummy.jpg');

  try {
    const res = await fetch('http://127.0.0.1:5051/api/admin/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: form
    });
    const json = await res.json();
    console.log('Upload Result:', json);
  } catch(e) {
    console.error(e);
  }
}
upload();

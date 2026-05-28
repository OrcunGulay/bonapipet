#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:5051/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

curl -s -X POST http://localhost:5051/api/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -F "no=Test Urun" \
  -F "aciklama=Test aciklama" \
  -F "kategori=duz-pipet" \
  -F "dil=tr"

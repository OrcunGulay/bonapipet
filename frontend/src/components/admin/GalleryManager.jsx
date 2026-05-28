import { useState, useEffect } from 'react'
import apiClient from '../../api/apiClient'
import styles from './Manager.module.css'

export default function GalleryManager() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('')
  
  const [formData, setFormData] = useState({
    adi: '',
    kategori: 'galeri',
    dil: 'tr',
    resim: null
  })

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const res = await apiClient.get('/admin/gallery')
      setPhotos(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, resim: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.resim) {
      alert('Lütfen bir görsel seçin.')
      return
    }

    const data = new FormData()
    data.append('adi', formData.adi)
    data.append('kategori', formData.kategori)
    data.append('dil', formData.dil)
    data.append('resim', formData.resim)

    try {
      await apiClient.post('/admin/gallery', data)
      resetForm()
      fetchGallery()
    } catch (err) {
      console.error(err)
      alert('İşlem sırasında hata oluştu.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return
    try {
      await apiClient.delete(`/admin/gallery/${id}`)
      fetchGallery()
    } catch (err) {
      console.error(err)
      alert('Silinirken hata oluştu.')
    }
  }

  const resetForm = () => {
    setFormData({ adi: '', kategori: 'galeri', dil: 'tr', resim: null })
    const fileInput = document.getElementById('galleryImageInput')
    if (fileInput) fileInput.value = ''
  }

  if (loading) return <div>Yükleniyor...</div>

  const filteredPhotos = filterCategory 
    ? photos.filter(p => p.kategori === filterCategory)
    : photos

  return (
    <div className={styles.managerContainer}>
      <h2>Galeri ve Sertifika Yönetimi</h2>
      
      <div className={styles.editFormWrapper}>
        <h3>Yeni Görsel/Sertifika Yükle</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Başlık/Açıklama (Opsiyonel)</label>
            <input type="text" name="adi" value={formData.adi} onChange={handleInputChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Kategori</label>
            <select name="kategori" value={formData.kategori} onChange={handleInputChange} required>
              <option value="galeri">Galeri</option>
              <option value="sertifika">Sertifika</option>
              <option value="uretim">Üretim</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Görsel Seç</label>
            <input id="galleryImageInput" type="file" accept="image/*" onChange={handleFileChange} required />
          </div>
          <div>
            <button type="submit" className={styles.saveBtn}>Yükle</button>
          </div>
        </form>
      </div>

      <div className={styles.listContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Mevcut Görseller</h3>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced6e0' }}>
            <option value="">Tüm Kategoriler</option>
            <option value="galeri">Sadece Galeri</option>
            <option value="sertifika">Sadece Sertifikalar</option>
            <option value="uretim">Sadece Üretim</option>
          </select>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Görsel</th>
              <th>Başlık</th>
              <th>Kategori</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredPhotos.map(item => (
              <tr key={item.id}>
                <td>
                  {item.resim && (
                    <img src={`/uploads/${item.resim}`} alt={item.adi} className={styles.thumbnail} />
                  )}
                </td>
                <td>{item.adi || '-'}</td>
                <td>{item.kategori}</td>
                <td>
                  <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>Sil</button>
                </td>
              </tr>
            ))}
            {filteredPhotos.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Kayıt bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

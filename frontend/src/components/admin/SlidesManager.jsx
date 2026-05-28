import { useState, useEffect } from 'react'
import apiClient from '../../api/apiClient'
import { uploadUrl } from '../../api/config.js'
import styles from './Manager.module.css'

export default function SlidesManager() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    urunadi: '',
    kod: '',
    sira: 0,
    dil: 'tr',
    resim: null,
    mevcut_resim: ''
  })

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const res = await apiClient.get('/admin/slides')
      setSlides(res.data.data)
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
    
    const data = new FormData()
    data.append('urunadi', formData.urunadi)
    data.append('kod', formData.kod)
    data.append('sira', formData.sira)
    data.append('dil', formData.dil)
    if (formData.resim) {
      data.append('resim', formData.resim)
    }
    if (formData.mevcut_resim) {
      data.append('mevcut_resim', formData.mevcut_resim)
    }

    try {
      if (editingId) {
        await apiClient.put(`/admin/slides/${editingId}`, data)
      } else {
        await apiClient.post('/admin/slides', data)
      }
      resetForm()
      fetchSlides()
    } catch (err) {
      console.error(err)
      alert('İşlem sırasında hata oluştu.')
    }
  }

  const handleEdit = (slide) => {
    setEditingId(slide.id)
    setFormData({
      urunadi: slide.urunadi || '',
      kod: slide.kod || '',
      sira: slide.sira || 0,
      dil: slide.dil || 'tr',
      resim: null, // don't load existing file into input
      mevcut_resim: slide.resimbuyuk || slide.resim || ''
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu slaytı silmek istediğinize emin misiniz?')) return
    try {
      await apiClient.delete(`/admin/slides/${id}`)
      fetchSlides()
    } catch (err) {
      console.error(err)
      alert('Silinirken hata oluştu.')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({ urunadi: '', kod: '', sira: 0, dil: 'tr', resim: null, mevcut_resim: '' })
    // reset file input
    const fileInput = document.getElementById('slideImageInput')
    if (fileInput) fileInput.value = ''
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className={styles.managerContainer}>
      <h2>Slayt Yönetimi</h2>
      
      <div className={styles.editFormWrapper}>
        <h3>{editingId ? 'Slaytı Düzenle' : 'Yeni Slayt Ekle'}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Slayt Başlığı (Ürün Adı)</label>
            <input type="text" name="urunadi" value={formData.urunadi} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Dil</label>
            <select name="dil" value={formData.dil} onChange={handleInputChange} required>
              <option value="tr">Türkçe (TR)</option>
              <option value="en">English (EN)</option>
              <option value="ru">Русский (RU)</option>
              <option value="ar">العربية (AR)</option>
              <option value="fr">Français (FR)</option>
              <option value="es">Español (ES)</option>
              <option value="de">Deutsch (DE)</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Kısa Açıklama (Kod)</label>
            <input type="text" name="kod" value={formData.kod} onChange={handleInputChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Sıra No</label>
            <input type="number" name="sira" value={formData.sira} onChange={handleInputChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Görsel Seç {editingId && '(Değiştirmek istemiyorsanız boş bırakın)'}</label>
            <input id="slideImageInput" type="file" accept="image/*" onChange={handleFileChange} required={!editingId} />
          </div>
          <div>
            <button type="submit" className={styles.saveBtn}>
              {editingId ? 'Güncelle' : 'Ekle'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className={styles.cancelBtn}>İptal</button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.listContainer}>
        <h3>Mevcut Slaytlar</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Görsel</th>
              <th>Başlık</th>
              <th>Dil</th>
              <th>Sıra</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {slides.map(slide => (
              <tr key={slide.id}>
                <td>
                  {slide.resimbuyuk && (
                    <img src={uploadUrl(slide.resimbuyuk)} alt={slide.urunadi} className={styles.thumbnail} />
                  )}
                </td>
                <td>{slide.urunadi}</td>
                <td><span className={styles.langBadge}>{slide.dil ? slide.dil.toUpperCase() : 'TR'}</span></td>
                <td>{slide.sira}</td>
                <td>
                  <div className={styles.actionBtns}>
                    <button onClick={() => handleEdit(slide)} className={styles.editBtn}>Düzenle</button>
                    <button onClick={() => handleDelete(slide.id)} className={styles.deleteBtn}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
            {slides.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Kayıt bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

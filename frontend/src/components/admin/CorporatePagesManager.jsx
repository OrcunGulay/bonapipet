import { useState, useEffect } from 'react'
import apiClient from '../../api/apiClient'
import styles from './Manager.module.css'

export default function CorporatePagesManager() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    no: '',
    aciklama: '',
    meta: '',
    keyword: '',
    dil: 'tr',
    resim: null,
    mevcut_resim: ''
  })

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const res = await apiClient.get('/admin/pages')
      setPages(res.data.data)
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
    data.append('no', formData.no)
    data.append('aciklama', formData.aciklama)
    data.append('meta', formData.meta)
    data.append('keyword', formData.keyword)
    data.append('dil', formData.dil)
    if (formData.resim) {
      data.append('resim', formData.resim)
    }
    if (formData.mevcut_resim) {
      data.append('mevcut_resim', formData.mevcut_resim)
    }

    try {
      if (editingId) {
        await apiClient.put(`/admin/pages/${editingId}`, data)
      } else {
        await apiClient.post('/admin/pages', data)
      }
      resetForm()
      fetchPages()
    } catch (err) {
      console.error(err)
      alert('İşlem sırasında hata oluştu.')
    }
  }

  const handleEdit = (page) => {
    setEditingId(page.id)
    setFormData({
      no: page.no || '',
      aciklama: page.aciklama || '',
      meta: page.meta || '',
      keyword: page.keyword || '',
      dil: page.dil || 'tr',
      resim: null,
      mevcut_resim: page.resim || ''
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu sayfayı silmek istediğinize emin misiniz?')) return
    try {
      await apiClient.delete(`/admin/pages/${id}`)
      fetchPages()
    } catch (err) {
      console.error(err)
      alert('Silinirken hata oluştu.')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({ no: '', aciklama: '', meta: '', keyword: '', dil: 'tr', resim: null, mevcut_resim: '' })
    const fileInput = document.getElementById('pageImageInput')
    if (fileInput) fileInput.value = ''
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className={styles.managerContainer}>
      <h2>Kurumsal Sayfa Yönetimi</h2>
      
      <div className={styles.editFormWrapper}>
        <h3>{editingId ? 'Sayfayı Düzenle' : 'Yeni Sayfa Ekle'}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Sayfa Başlığı</label>
            <input type="text" name="no" value={formData.no} onChange={handleInputChange} required />
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
            <label>Sayfa İçeriği (HTML desteklenir)</label>
            <textarea name="aciklama" value={formData.aciklama} onChange={handleInputChange} rows="6" required />
          </div>
          <div className={styles.formGroup}>
            <label>SEO Meta Açıklama</label>
            <input type="text" name="meta" value={formData.meta} onChange={handleInputChange} />
          </div>
          <div className={styles.formGroup}>
            <label>SEO Anahtar Kelimeler</label>
            <input type="text" name="keyword" value={formData.keyword} onChange={handleInputChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Sayfa Görseli {editingId && '(Değiştirmek istemiyorsanız boş bırakın)'}</label>
            <input id="pageImageInput" type="file" accept="image/*" onChange={handleFileChange} />
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
        <h3>Mevcut Sayfalar</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Görsel</th>
              <th>Başlık</th>
              <th>Dil</th>
              <th>SEO URL</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page.id}>
                <td>
                  {page.resim && (
                    <img src={`/uploads/${page.resim}`} alt={page.no} className={styles.thumbnail} />
                  )}
                </td>
                <td>{page.no}</td>
                <td><span className={styles.langBadge}>{page.dil ? page.dil.toUpperCase() : 'TR'}</span></td>
                <td>{page.seo}</td>
                <td>
                  <div className={styles.actionBtns}>
                    <button onClick={() => handleEdit(page)} className={styles.editBtn}>Düzenle</button>
                    <button onClick={() => handleDelete(page.id)} className={styles.deleteBtn}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
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

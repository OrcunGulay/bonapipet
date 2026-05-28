import { useState, useEffect } from 'react'
import apiClient from '../../api/apiClient'
import { uploadUrl } from '../../api/config.js'
import styles from './Manager.module.css'

export default function NewsManager() {
  const [news, setNews] = useState([])
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
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const res = await apiClient.get('/admin/news')
      setNews(res.data.data)
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
        await apiClient.put(`/admin/news/${editingId}`, data)
      } else {
        await apiClient.post('/admin/news', data)
      }
      resetForm()
      fetchNews()
    } catch (err) {
      console.error(err)
      alert('İşlem sırasında hata oluştu.')
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      no: item.no || '',
      aciklama: item.aciklama || '',
      meta: item.meta || '',
      keyword: item.keyword || '',
      dil: item.dil || 'tr',
      resim: null,
      mevcut_resim: item.resim || ''
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu haberi/duyuruyu silmek istediğinize emin misiniz?')) return
    try {
      await apiClient.delete(`/admin/news/${id}`)
      fetchNews()
    } catch (err) {
      console.error(err)
      alert('Silinirken hata oluştu.')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({ no: '', aciklama: '', meta: '', keyword: '', dil: 'tr', resim: null, mevcut_resim: '' })
    const fileInput = document.getElementById('newsImageInput')
    if (fileInput) fileInput.value = ''
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className={styles.managerContainer}>
      <h2>Haberler & Duyurular Yönetimi</h2>
      
      <div className={styles.editFormWrapper}>
        <h3>{editingId ? 'Haberi Düzenle' : 'Yeni Haber Ekle'}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Haber Başlığı</label>
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
            <label>İçerik (HTML desteklenir)</label>
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
            <label>Haber Görseli {editingId && '(Değiştirmek istemiyorsanız boş bırakın)'}</label>
            <input id="newsImageInput" type="file" accept="image/*" onChange={handleFileChange} />
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
        <h3>Eklenmiş Haberler</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Görsel</th>
              <th>Başlık</th>
              <th>Dil</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => (
              <tr key={item.id}>
                <td>
                  {item.resim && (
                    <img src={uploadUrl(item.resim)} alt={item.no} className={styles.thumbnail} />
                  )}
                </td>
                <td>{item.no}</td>
                <td><span className={styles.langBadge}>{item.dil ? item.dil.toUpperCase() : 'TR'}</span></td>
                <td>{new Date(item.tarih).toLocaleDateString('tr-TR')}</td>
                <td>
                  <div className={styles.actionBtns}>
                    <button onClick={() => handleEdit(item)} className={styles.editBtn}>Düzenle</button>
                    <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
            {news.length === 0 && (
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

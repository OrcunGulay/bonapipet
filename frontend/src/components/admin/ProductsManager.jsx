import { useState, useEffect } from 'react'
import apiClient from '../../api/apiClient'
import styles from './Manager.module.css'

export default function ProductsManager() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    kategori: '',
    resim: null
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        apiClient.get('/admin/products'),
        apiClient.get('/categories') // This used to be /admin/categories but public /categories is the same
      ])
      setProducts(prodRes.data.data || [])
      setCategories(catRes.data.data || [])
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
    
    if (!formData.kategori || !formData.resim) {
      alert('Kategori ve resim alanları zorunludur.')
      return
    }

    const data = new FormData()
    data.append('kategori', formData.kategori)
    data.append('resim', formData.resim)

    try {
      await apiClient.post('/admin/products', data)
      resetForm()
      fetchData()
    } catch (err) {
      console.error(err)
      alert('İşlem sırasında hata oluştu.')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({ kategori: '', resim: null })
    const fileInput = document.getElementById('productImageInput')
    if (fileInput) fileInput.value = ''
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    try {
      await apiClient.delete(`/admin/products/${id}`)
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Silinirken hata oluştu.')
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className={styles.managerContainer}>
      <h2>Kategori Fotoğrafları Yönetimi</h2>
      
      <div className={styles.editFormWrapper}>
        <h3>Yeni Kategori Fotoğrafı Yükle</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Kategori</label>
            <select name="kategori" value={formData.kategori} onChange={handleInputChange} required>
              <option value="">Seçiniz</option>
              {categories
                .filter(c => c.dil === 'tr')
                .map(c => (
                  <option key={c.id} value={c.seo}>{c.no}</option>
                ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Ürün / Kategori Görseli</label>
            <input id="productImageInput" type="file" accept="image/*" onChange={handleFileChange} required />
          </div>
          <div>
            <button type="submit" className={styles.saveBtn}>
              Yükle
            </button>
          </div>
        </form>
      </div>

      <div className={styles.listContainer}>
        <h3>Kayıtlı Kategori Fotoğrafları</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Görsel</th>
              <th>Bağlı Olduğu Kategori</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map(item => (
              <tr key={item.id}>
                <td>
                  {item.resim && (
                    <img src={`/uploads/${item.resim}`} alt="Kategori" className={styles.thumbnail} />
                  )}
                </td>
                <td>{item.kategori}</td>
                <td>
                  <div className={styles.actionBtns}>
                    <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Kayıt bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

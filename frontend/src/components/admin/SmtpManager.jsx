import { useState, useEffect } from 'react'
import apiClient from '../../api/apiClient'
import styles from './Manager.module.css'

export default function SmtpManager() {
  const [smtp, setSmtp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSmtp()
  }, [])

  const fetchSmtp = async () => {
    try {
      const res = await apiClient.get('/admin/smtp')
      setSmtp(res.data.data)
    } catch (err) {
      setMessage('SMTP ayarları yüklenirken hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSmtp(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await apiClient.put('/admin/smtp', smtp)
      setMessage('SMTP ayarları başarıyla güncellendi.')
    } catch (err) {
      setMessage('Güncelleme sırasında hata oluştu.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className={styles.managerContainer}>
      <h2>SMTP / Mail Ayarları</h2>
      {message && <div className={styles.message}>{message}</div>}
      
      <p style={{ marginBottom: '1.5rem', color: '#7f8c8d', fontSize: '0.9rem' }}>
        İletişim formundan gönderilen mesajların e-posta adresinize ulaşması için gerekli olan giden sunucu (SMTP) bilgilerini buradan güncelleyebilirsiniz.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Bildirimlerin Gideceği E-Posta Adresi</label>
          <input type="email" name="gelen" value={smtp?.gelen || ''} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Giden Sunucu (SMTP Host - Örn: mail.siteadi.com)</label>
          <input type="text" name="giden" value={smtp?.giden || ''} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>SMTP Kullanıcı Adı (Mail Adresi)</label>
          <input type="text" name="kullaniciadi" value={smtp?.kullaniciadi || ''} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>SMTP Şifresi</label>
          <input type="password" name="sifre" value={smtp?.sifre || ''} onChange={handleChange} />
        </div>
        
        <button type="submit" disabled={saving} className={styles.saveBtn}>
          {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </button>
      </form>
    </div>
  )
}

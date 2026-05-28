import { useState, useEffect } from 'react'
import apiClient from '../../api/apiClient'
import styles from './Manager.module.css'

export default function SettingsManager() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await apiClient.get('/admin/settings')
      setSettings(res.data.data)
    } catch (err) {
      setMessage('Ayarlar yüklenirken hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await apiClient.put('/admin/settings', settings)
      setMessage('Ayarlar başarıyla güncellendi.')
    } catch (err) {
      setMessage('Güncelleme sırasında hata oluştu.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className={styles.managerContainer}>
      <h2>Site Ayarları</h2>
      {message && <div className={styles.message}>{message}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Site Adı</label>
          <input type="text" name="siteadi" value={settings?.siteadi || ''} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Site Adresi (URL)</label>
          <input type="text" name="siteadresi" value={settings?.siteadresi || ''} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Slogan</label>
          <input type="text" name="slogan" value={settings?.slogan || ''} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>SEO Title</label>
          <input type="text" name="title" value={settings?.title || ''} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>SEO Meta Açıklama</label>
          <textarea name="meta" value={settings?.meta || ''} onChange={handleChange} rows="3" />
        </div>
        <div className={styles.formGroup}>
          <label>SEO Anahtar Kelimeler</label>
          <textarea name="keyword" value={settings?.keyword || ''} onChange={handleChange} rows="2" />
        </div>
        <div className={styles.formGroup}>
          <label>Firma Adresi</label>
          <textarea name="firmaadresi" value={settings?.firmaadresi || ''} onChange={handleChange} rows="2" />
        </div>
        <div className={styles.formGroup}>
          <label>Telefon</label>
          <input type="text" name="telefon" value={settings?.telefon || ''} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>GSM</label>
          <input type="text" name="gsm" value={settings?.gsm || ''} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" name="mail" value={settings?.mail || ''} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Yetkili Kişi</label>
          <input type="text" name="yetkili" value={settings?.yetkili || ''} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Facebook URL</label>
          <input type="text" name="facebook" value={settings?.facebook || ''} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Twitter URL</label>
          <input type="text" name="twitter" value={settings?.twitter || ''} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Google Analytics Kodu</label>
          <textarea name="analiz" value={settings?.analiz || ''} onChange={handleChange} rows="3" />
        </div>
        <div className={styles.formGroup}>
          <label>Google Doğrulama Kodu</label>
          <input type="text" name="google" value={settings?.google || ''} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Footer Metni</label>
          <textarea name="footer" value={settings?.footer || ''} onChange={handleChange} rows="2" />
        </div>
        
        <button type="submit" disabled={saving} className={styles.saveBtn}>
          {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </button>
      </form>
    </div>
  )
}

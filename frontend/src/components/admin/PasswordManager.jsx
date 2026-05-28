import { useState } from 'react'
import apiClient from '../../api/apiClient'
import { useAuth } from '../../context/AuthContext'
import styles from './Manager.module.css'

export default function PasswordManager() {
  const { admin, setAdmin } = useAuth()
  const [formData, setFormData] = useState({
    username: admin?.username || '',
    password: '',
    passwordConfirm: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.passwordConfirm) {
      setMessage({ type: 'error', text: 'Şifre tekrarı uyuşmuyor.' })
      return
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır.' })
      return
    }

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      await apiClient.put('/admin/auth/password', formData)
      setMessage({ type: 'success', text: 'Yönetici bilgileri başarıyla güncellendi. Yeni bilgilerinizle giriş yapabilirsiniz.' })
      // Optionally update the context username if it changed
      if (formData.username !== admin?.username) {
        setAdmin(prev => ({ ...prev, username: formData.username }))
      }
      setFormData(prev => ({ ...prev, password: '', passwordConfirm: '' }))
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Güncelleme sırasında hata oluştu.' 
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.managerContainer}>
      <h2>Yönetici Şifre Değişikliği</h2>
      
      {message.text && (
        <div className={styles.message} style={{ backgroundColor: message.type === 'error' ? '#fdecea' : '#e3f2fd', color: message.type === 'error' ? '#e74c3c' : '#1976d2' }}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Yönetici Kullanıcı Adı</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Yeni Şifre</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
        </div>
        <div className={styles.formGroup}>
          <label>Yeni Şifre (Tekrar)</label>
          <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} required minLength="6" />
        </div>
        
        <button type="submit" disabled={saving} className={styles.saveBtn}>
          {saving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
        </button>
      </form>
    </div>
  )
}

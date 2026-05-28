import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext.jsx'
import apiClient from '../api/apiClient.js'
import PageTitle from '../components/shared/PageTitle.jsx'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  const { t } = useLang()
  const [settings, setSettings] = useState({})

  const [formData, setFormData] = useState({
    adi: '',
    mail: '',
    telefon: '',
    mesaj: ''
  })
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    apiClient.get('/settings').then(res => setSettings(res.data.data || {}))
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', msg: '' })

    try {
      const res = await apiClient.post('/contact', formData)
      setStatus({ type: 'success', msg: res.data.message || t.mesajgonderildi })
      setFormData({ adi: '', mail: '', telefon: '', mesaj: '' })
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || t.bosalan })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageTitle title={t.iletisim || 'İletişim'} />
      <div className={styles.contactWrapper}>
        <div className="container">
          <div className={styles.grid}>

            {/* İletişim Bilgileri */}
            <div className={styles.infoBox}>
              <div className="sec-title" style={{ textAlign: 'left', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '24px' }}>{t.iletisimbilgileri || 'İletişim Bilgileri'}</h2>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.icon}>📍</span>
                <div>
                  <h4>{t.adres || 'Adres'}</h4>
                  <p>{t.adrestext || settings.firmaadresi}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.icon}>📞</span>
                <div>
                  <h4>{t.telefon || 'Telefon'}</h4>
                  <p>{t.telefontext || settings.telefon}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.icon}>✉</span>
                <div>
                  <h4>{t.email || 'Email'}</h4>
                  <p>{t.emailtext || settings.mail}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className={styles.formBox}>
              <div className="sec-title" style={{ textAlign: 'left', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '24px' }}>{t.iletisimformu || 'İletişim Formu'}</h2>
              </div>

              {status.msg && (
                <div className={`${styles.alert} ${styles[status.type]}`}>
                  {status.msg}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <input type="text" name="adi" placeholder={t.adsoyad || 'Adınız Soyadınız'} value={formData.adi} onChange={handleChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <input type="email" name="mail" placeholder={t.emailadresiniz || 'Email Adresiniz'} value={formData.mail} onChange={handleChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <input type="text" name="telefon" placeholder={t.telefonnumaraniz || 'Telefon Numaranız'} value={formData.telefon} onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                  <textarea name="mesaj" placeholder={t.mesajiniz || 'Mesajınız'} rows="5" value={formData.mesaj} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>
                  {loading ? '...' : (t.gonder || 'Gönder')}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

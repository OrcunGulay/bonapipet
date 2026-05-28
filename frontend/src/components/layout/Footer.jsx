import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext.jsx'
import apiClient from '../../api/apiClient.js'
import styles from './Footer.module.css'

export default function Footer() {
  const { t, lang } = useLang()
  const [settings, setSettings] = useState({})
  const [gallery, setGallery] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, galleryRes] = await Promise.all([
          apiClient.get('/settings'),
          apiClient.get('/gallery/footer'),
        ])
        setSettings(settingsRes.data.data || {})
        setGallery(galleryRes.data.data || [])
      } catch {}
    }
    fetchData()
  }, [lang])

  return (
    <footer className={styles.footer}>
      <div className={styles.widgetsSection}>
        <div className={styles.container}>
          <div className={styles.grid}>

            {/* Hakkımızda */}
            <div className={styles.widget}>
              <h3 className={styles.widgetTitle}>Bona Pipet</h3>
              <p className={styles.widgetText}>{t.hakkimizdatext}</p>
              <div className={styles.socialLinks}>
                {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" className={styles.socialBtn}>f</a>}
                {settings.twitter && <a href={settings.twitter} target="_blank" rel="noreferrer" className={styles.socialBtn}>𝕏</a>}
              </div>
            </div>

            {/* İletişim */}
            <div className={styles.widget}>
              <h3 className={styles.widgetTitle}>{t.iletisim || 'İletişim'}</h3>
              <ul className={styles.infoList}>
                <li>
                  <span className={styles.infoIcon}>📍</span>
                  <div>
                    <strong>{t.adres || 'Adres'}</strong>
                    <p>{t.adrestext || settings.firmaadresi}</p>
                  </div>
                </li>
                <li>
                  <span className={styles.infoIcon}>📞</span>
                  <div>
                    <strong>{t.telefon || 'Telefon'}</strong>
                    <p>{t.telefontext || settings.telefon}</p>
                  </div>
                </li>
                <li>
                  <span className={styles.infoIcon}>✉</span>
                  <div>
                    <strong>{t.email || 'Email'}</strong>
                    <p>{t.emailtext || settings.mail}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Galeri */}
            <div className={styles.widget}>
              <h3 className={styles.widgetTitle}>{t.galeri || 'Galeri'}</h3>
              <div className={styles.galleryGrid}>
                {gallery.map(img => (
                  <Link key={img.id} to="/galeri" className={styles.galleryItem}>
                    <img src={`/uploads/${img.kucuk}`} alt="galeri" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <p>© {new Date().getFullYear()} Bona Pipet. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

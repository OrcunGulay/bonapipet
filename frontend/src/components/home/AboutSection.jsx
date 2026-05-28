import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext.jsx'
import apiClient from '../../api/apiClient.js'
import styles from './AboutSection.module.css'

export default function AboutSection() {
  const { lang, t } = useLang()
  const [aboutPage, setAboutPage] = useState(null)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await apiClient.get(`/pages/${lang}`)
        if (res.data.data && res.data.data.length > 0) {
          setAboutPage(res.data.data[0]) // Genelde ilk sayfa hakkımızda olur
        }
      } catch (err) {
        console.error('About fetch error', err)
      }
    }
    fetchAbout()
  }, [lang])

  if (!aboutPage) return null

  // Metni temizle ve kısalt
  const cleanText = aboutPage.aciklama
    .replace(/<[^>]+>/g, '') // HTML etiketlerini kaldır
    .replace(/&quot;/g, '"')
    .substring(0, 400) + '...'

  return (
    <section className={styles.aboutSection}>
      <div className="container">
        <div className="sec-title">
          <h2>{t.kisacabiz || 'Kısaca Biz'}</h2>
          <h3>Bona Pipet</h3>
        </div>
        <div className={styles.content}>
          <p>{cleanText}</p>
          <Link to={`/kurumsal/${aboutPage.seo}`} className="btn">
            {t.devam || 'Devamı'}
          </Link>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext.jsx'
import apiClient from '../../api/apiClient.js'
import styles from './NewsSection.module.css'

export default function NewsSection() {
  const { lang, t } = useLang()
  const [news, setNews] = useState([])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await apiClient.get(`/news/${lang}?limit=2`)
        setNews(res.data.data || [])
      } catch (err) {
        console.error('News fetch error', err)
      }
    }
    fetchNews()
  }, [lang])

  if (!news.length) return null

  return (
    <section className={styles.newsSection}>
      <div className="container">
        <div className="sec-title">
          <h2>{t.bizdenhaberler || 'Bizden Haberler'}</h2>
        </div>
        <div className={styles.grid}>
          {news.map(item => {
            const cleanText = item.aciklama
              .replace(/<[^>]+>/g, '')
              .replace(/&quot;/g, '"')
              .substring(0, 150) + '...'

            return (
              <div key={item.id} className={styles.newsCard}>
                <div className={styles.imageBox}>
                  <Link to={`/haber/${item.seo}`}>
                    <img src={`/uploads/${item.resim}`} alt={item.no} />
                  </Link>
                </div>
                <div className={styles.content}>
                  <div className={styles.date}>{item.tarih}</div>
                  <h3><Link to={`/haber/${item.seo}`}>{item.no}</Link></h3>
                  <p>{cleanText}</p>
                  <Link to={`/haber/${item.seo}`} className={styles.readMore}>
                    {t.devam || 'Devamı'} <span>→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

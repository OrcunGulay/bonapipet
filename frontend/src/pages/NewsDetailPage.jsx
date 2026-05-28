import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLang } from '../context/LangContext.jsx'
import apiClient from '../api/apiClient.js'
import PageTitle from '../components/shared/PageTitle.jsx'
import SidebarMenu from '../components/shared/SidebarMenu.jsx'

export default function NewsDetailPage() {
  const { seo } = useParams()
  const { lang, t } = useLang()
  const [news, setNews] = useState(null)
  const [allNews, setAllNews] = useState([])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const route = seo ? `/news/${lang}/${seo}` : `/news/${lang}`
        const res = await apiClient.get(route)
        if (seo) {
          setNews(res.data.data)
          setAllNews(res.data.allNews || [])
        } else {
          setNews(res.data.data[0])
          setAllNews(res.data.data || [])
        }
      } catch (err) {
        console.error('News fetch error', err)
      }
    }
    fetchNews()
  }, [lang, seo])

  if (!news) return null

  return (
    <>
      <PageTitle title={t.bizdenhaberler || 'Bizden Haberler'} />
      <div className="container" style={{ padding: '60px 24px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        <div style={{ flex: '1 1 600px' }}>
          {news.resim && news.resim !== 'resimyok.png' && (
            <img 
              src={`/uploads/${news.resim}`} 
              alt={news.no} 
              style={{ width: '100%', borderRadius: '12px', marginBottom: '30px' }} 
            />
          )}
          <h2 style={{ marginBottom: '20px', color: 'var(--secondary)' }}>{news.no}</h2>
          <div style={{ color: 'var(--primary)', marginBottom: '20px', fontWeight: 600 }}>{news.tarih}</div>
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: news.aciklama }} />
        </div>

        <div style={{ flex: '0 0 300px' }}>
          <SidebarMenu 
            title={t.bizdenhaberler || 'Bizden Haberler'} 
            items={allNews} 
            currentSeo={news.seo}
            basePath="/haber"
          />
        </div>

      </div>
    </>
  )
}

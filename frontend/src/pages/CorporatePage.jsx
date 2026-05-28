import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLang } from '../context/LangContext.jsx'
import apiClient from '../api/apiClient.js'
import PageTitle from '../components/shared/PageTitle.jsx'
import SidebarMenu from '../components/shared/SidebarMenu.jsx'

export default function CorporatePage() {
  const { seo } = useParams()
  const { lang, t } = useLang()
  const [pageData, setPageData] = useState(null)
  const [allPages, setAllPages] = useState([])

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const route = seo ? `/pages/${lang}/${seo}` : `/pages/${lang}`
        const res = await apiClient.get(route)
        setPageData(res.data.data)
        setAllPages(res.data.allPages || [])
      } catch (err) {
        console.error('Page fetch error', err)
      }
    }
    fetchPage()
  }, [lang, seo])

  if (!pageData) return null

  return (
    <>
      <PageTitle title={t.kurumsal || 'Kurumsal'} />
      <div className="container" style={{ padding: '60px 24px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        <div style={{ flex: '1 1 600px' }}>
          {pageData.resim && (
            <img 
              src={`/uploads/${pageData.resim}`} 
              alt={pageData.no} 
              style={{ width: '100%', borderRadius: '12px', marginBottom: '30px' }} 
            />
          )}
          <h2 style={{ marginBottom: '20px', color: 'var(--secondary)' }}>{pageData.no}</h2>
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: pageData.aciklama }} />
        </div>

        <div style={{ flex: '0 0 300px' }}>
          <SidebarMenu 
            title={t.kurumsal || 'Kurumsal'} 
            items={allPages} 
            currentSeo={pageData.seo}
            basePath="/kurumsal"
          />
        </div>

      </div>
    </>
  )
}

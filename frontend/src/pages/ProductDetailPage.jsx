import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLang } from '../context/LangContext.jsx'
import apiClient from '../api/apiClient.js'
import PageTitle from '../components/shared/PageTitle.jsx'
import SidebarMenu from '../components/shared/SidebarMenu.jsx'
import PhotoGallery from '../components/shared/PhotoGallery.jsx'

export default function ProductDetailPage() {
  const { seo } = useParams()
  const { lang, t } = useLang()
  const [product, setProduct] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          apiClient.get(`/products/${lang}/${seo}`),
          apiClient.get('/categories')
        ])
        setProduct(prodRes.data.data)
        setCategories(catRes.data.data || [])
      } catch (err) {
        console.error('Product fetch error', err)
      }
    }
    fetchData()
  }, [lang, seo])

  if (!product) return null

  return (
    <>
      <PageTitle title={product.no} />
      <div className="container" style={{ padding: '60px 24px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        <div style={{ flex: '1 1 600px' }}>
          <h2 style={{ marginBottom: '20px', color: 'var(--secondary)' }}>{product.no}</h2>
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: product.aciklama }} />
          
          {/* İlgili Galeriler */}
          {product.photos && product.photos.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <PhotoGallery photos={product.photos} />
            </div>
          )}
        </div>

        <div style={{ flex: '0 0 300px' }}>
          <SidebarMenu 
            title={t.urunlerimiz || 'Ürünlerimiz'} 
            items={categories.filter(c => c.dil === lang || c.dil === 'tr')} 
            currentSeo={product.seo}
            basePath="/urun"
          />
        </div>

      </div>
    </>
  )
}

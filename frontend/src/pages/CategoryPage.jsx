import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLang } from '../context/LangContext.jsx'
import apiClient from '../api/apiClient.js'
import PhotoGallery from '../components/shared/PhotoGallery.jsx'

export default function CategoryPage() {
  const { seo } = useParams()
  const { lang, t } = useLang()
  const [photos, setPhotos] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryAndPhotos = async () => {
      try {
        setLoading(true)
        // Fetch categories to find the correct one for the title
        const catRes = await apiClient.get('/categories')
        const allCats = catRes.data.data || []
        const currentCat = allCats.find(c => c.seo === seo && (c.dil === lang || c.dil === 'tr'))
        setCategory(currentCat || { no: t.urunlerimiz || 'Ürünlerimiz' })

        // Fetch gallery photos for this specific category
        const photoRes = await apiClient.get(`/gallery?category=${seo}`)
        setPhotos(photoRes.data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategoryAndPhotos()
  }, [seo, lang, t])

  if (loading) return <div style={{ padding: '150px 20px', textAlign: 'center' }}>Yükleniyor...</div>

  return (
    <div style={{ paddingTop: '120px', minHeight: '60vh' }}>
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="sec-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2>{category?.no}</h2>
            <div className="text" style={{ marginTop: '10px', fontSize: '18px', color: '#666' }}>
              {t.urun_kategorisi || 'Bu kategoriye ait görsel galerimiz aşağıda listelenmektedir.'}
            </div>
          </div>

          {photos.length > 0 ? (
            <PhotoGallery photos={photos} />
          ) : (
            <div style={{ textAlign: 'center', width: '100%', padding: '50px' }}>
              <p>{t.kayit_bulunamadi || 'Bu kategoriye henüz görsel eklenmemiş.'}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

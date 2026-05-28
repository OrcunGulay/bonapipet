import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext.jsx'
import apiClient from '../api/apiClient.js'
import PageTitle from '../components/shared/PageTitle.jsx'
import PhotoGallery from '../components/shared/PhotoGallery.jsx'

export default function ProductionPage() {
  const { t } = useLang()
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await apiClient.get('/gallery?category=uretim')
        setPhotos(res.data.data || [])
      } catch (err) {
        console.error('Production fetch error', err)
      }
    }
    fetchPhotos()
  }, [])

  return (
    <>
      <PageTitle title={t.uretim || 'Üretim'} />
      <div className="container" style={{ padding: '60px 24px' }}>
        <PhotoGallery photos={photos} />
      </div>
    </>
  )
}

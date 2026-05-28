import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext.jsx'
import apiClient from '../api/apiClient.js'
import PageTitle from '../components/shared/PageTitle.jsx'
import PhotoGallery from '../components/shared/PhotoGallery.jsx'

export default function CertificatesPage() {
  const { t } = useLang()
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await apiClient.get('/gallery?category=sertifika')
        setPhotos(res.data.data || [])
      } catch (err) {
        console.error('Certificates fetch error', err)
      }
    }
    fetchPhotos()
  }, [])

  return (
    <>
      <PageTitle title={t.sertifikalar || 'Sertifikalar'} />
      <div className="container" style={{ padding: '60px 24px' }}>
        <PhotoGallery photos={photos} />
      </div>
    </>
  )
}

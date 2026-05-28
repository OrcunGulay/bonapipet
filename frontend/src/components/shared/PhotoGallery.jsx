import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import styles from './PhotoGallery.module.css'

export default function PhotoGallery({ photos }) {
  const [index, setIndex] = useState(-1)

  if (!photos || !photos.length) return null

  const slides = photos.map(p => ({
    src: `/uploads/${p.buyuk}`,
    alt: 'Galeri',
  }))

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.grid}>
        {photos.map((p, idx) => (
          <div key={p.id} className={styles.item} onClick={() => setIndex(idx)}>
            <div className={styles.imageBox}>
              <img src={`/uploads/${p.kucuk}`} alt="Galeri" loading="lazy" />
              <div className={styles.overlay}>
                <span className={styles.icon}>+</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
      />
    </div>
  )
}

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Video from 'yet-another-react-lightbox/plugins/video'
import 'yet-another-react-lightbox/styles.css'
import styles from './PhotoGallery.module.css'
import { uploadUrl } from '../../api/config.js'

export default function PhotoGallery({ photos }) {
  const [index, setIndex] = useState(-1)

  if (!photos || !photos.length) return null

  const slides = photos.map(p => {
    const isVideo = p.buyuk && p.buyuk.match(/\.(mp4|webm|ogg)$/i);
    if (isVideo) {
      return {
        type: "video",
        sources: [
          {
            src: uploadUrl(p.buyuk),
            type: `video/${p.buyuk.split('.').pop()}`
          }
        ]
      };
    }
    return {
      src: uploadUrl(p.buyuk),
      alt: 'Galeri',
    };
  })

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.grid}>
        {photos.map((p, idx) => (
          <div key={p.id} className={styles.item} onClick={() => setIndex(idx)}>
            <div className={styles.imageBox}>
              {p.kucuk && p.kucuk.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={uploadUrl(p.kucuk)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
              ) : (
                <img src={uploadUrl(p.kucuk)} alt="Galeri" loading="lazy" />
              )}
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
        plugins={[Video]}
      />
    </div>
  )
}

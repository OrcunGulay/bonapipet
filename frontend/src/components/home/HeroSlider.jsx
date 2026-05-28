import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useLang } from '../../context/LangContext.jsx'
import apiClient from '../../api/apiClient.js'
import styles from './HeroSlider.module.css'

export default function HeroSlider() {
  const { lang, t } = useLang()
  const [slides, setSlides] = useState([])

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await apiClient.get(`/slides/${lang}`)
        setSlides(res.data.data || [])
      } catch (err) {
        console.error('Slider fetch error', err)
      }
    }
    fetchSlides()
  }, [lang])

  if (!slides.length) return <div className={styles.sliderPlaceholder}></div>

  return (
    <div className={styles.heroWrapper}>
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1500}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        className={styles.swiperContainer}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={styles.slideInner}>
              <div
                className={styles.bgImage}
                style={{ backgroundImage: `url(/uploads/${slide.resimbuyuk})` }}
              ></div>
              <div className={styles.overlay}></div>
              <div className={styles.content}>
                <div className="container">
                  <h1 className={styles.title}>{slide.urunadi}</h1>
                  <p className={styles.desc}>{slide.kod}</p>
                  <Link to="/iletisim" className="btn">{t.iletisim || 'İletişim'}</Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

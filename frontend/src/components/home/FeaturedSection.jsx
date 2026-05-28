import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext.jsx'
import styles from './FeaturedSection.module.css'

export default function FeaturedSection() {
  const { t } = useLang()

  return (
    <section className={styles.featuredSection}>
      <div className="container">
        <div className={styles.grid}>
          {/* Misyon */}
          <div className={styles.card}>
            <div className={styles.iconBox}>🎯</div>
            <h3><Link to="/kurumsal/misyonumuz">{t.misyonumuz || 'Misyonumuz'}</Link></h3>
            <p>{t.misyontext}</p>
          </div>
          
          {/* Vizyon */}
          <div className={styles.card}>
            <div className={styles.iconBox}>👁️</div>
            <h3><Link to="/kurumsal/vizyonumuz">{t.vizyonumuz || 'Vizyonumuz'}</Link></h3>
            <p>{t.vizyontext}</p>
          </div>

          {/* Sertifikalar */}
          <div className={styles.card}>
            <div className={styles.iconBox}>📜</div>
            <h3><Link to="/sertifikalar">{t.sertifikalarimiz || 'Sertifikalarımız'}</Link></h3>
            <p>{t.sertifikatext}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

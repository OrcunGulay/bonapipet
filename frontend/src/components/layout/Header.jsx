import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext.jsx'
import apiClient from '../../api/apiClient.js'
import styles from './Header.module.css'

const LANG_FLAGS = {
  tr: '🇹🇷', en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', ru: '🇷🇺', sp: '🇪🇸', ar: '🇸🇦'
}

export default function Header() {
  const { t, lang, changeLang, supportedLangs } = useLang()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [corporatePages, setCorporatePages] = useState([])
  const [categories, setCategories] = useState([])
  const [settings, setSettings] = useState({})

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const [pagesRes, catRes, settingsRes] = await Promise.all([
          apiClient.get(`/pages/${lang}`),
          apiClient.get('/categories'),
          apiClient.get('/settings'),
        ])
        setCorporatePages(pagesRes.data.data || [])
        
        // Backend'den gelen kategorileri dil bazlı filtrele (eğer dil desteği varsa, şu an hepsi TR ama)
        // İleride fotokategori de dile göre ayrılırsa diye filtreliyoruz.
        const allCats = catRes.data.data || []
        setCategories(allCats.filter(c => c.dil === lang || c.dil === 'tr'))
        
        setSettings(settingsRes.data.data || {})
      } catch {}
    }
    fetchNav()
  }, [lang])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topLeft}>
            <a href={`mailto:${settings.mail || 'info@bonapipet.com'}`}>
              <span>✉</span> {settings.mail || 'info@bonapipet.com'}
            </a>
            <a href={`tel:${settings.telefon || '+9 0422 311 18 12'}`}>
              <span>📞</span> {settings.telefon || '+9 0422 311 18 12'}
            </a>
          </div>
          <div className={styles.topRight}>
            {supportedLangs.map(l => (
              <button key={l} onClick={() => changeLang(l)} className={lang === l ? styles.activeLang : ''} title={l.toUpperCase()}>
                {LANG_FLAGS[l]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <div className={styles.mainNav}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <img src="/images/logo.png" alt="Bona Pipet" onError={e => { e.target.style.display='none' }} />
            <span className={styles.logoText}>Bona Pipet</span>
          </Link>

          {/* Hamburger */}
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
            <span /><span /><span />
          </button>

          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
            <Link to="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>{t.anasayfa || 'ANA SAYFA'}</Link>

            {/* Kurumsal dropdown */}
            <div className={styles.dropdown}>
              <span className={styles.navLink}>{t.kurumsal || 'Kurumsal'} <span className={styles.arrow}>▾</span></span>
              <div className={styles.dropdownMenu}>
                {corporatePages.map(p => (
                  <Link key={p.id} to={`/kurumsal/${p.seo}`} className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                    {p.no}
                  </Link>
                ))}
              </div>
            </div>

            {/* Ürünler dropdown */}
            <div className={styles.dropdown}>
              <span className={styles.navLink}>{t.urunlerimiz || 'Ürünlerimiz'} <span className={styles.arrow}>▾</span></span>
              <div className={styles.dropdownMenu}>
                {categories.map(c => (
                  <Link key={c.id} to={`/kategori/${c.seo}`} className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                    {c.no}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/sertifikalar" className={styles.navLink} onClick={() => setMenuOpen(false)}>{t.sertifikalar || 'Sertifikalar'}</Link>
            <Link to="/galeri" className={styles.navLink} onClick={() => setMenuOpen(false)}>{t.galeri || 'Galeri'}</Link>
            <Link to="/iletisim" className={`${styles.navLink} ${styles.contactBtn}`} onClick={() => setMenuOpen(false)}>{t.iletisim || 'İletişim'}</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

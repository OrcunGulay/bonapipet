import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './AdminDashboard.module.css'
import SettingsManager from '../../components/admin/SettingsManager.jsx'
import SlidesManager from '../../components/admin/SlidesManager.jsx'
import CorporatePagesManager from '../../components/admin/CorporatePagesManager.jsx'
import ProductsManager from '../../components/admin/ProductsManager.jsx'
import NewsManager from '../../components/admin/NewsManager.jsx'
import GalleryManager from '../../components/admin/GalleryManager.jsx'
import SmtpManager from '../../components/admin/SmtpManager.jsx'
import PasswordManager from '../../components/admin/PasswordManager.jsx'

export default function AdminDashboard() {
  const { admin, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2>Hoşgeldiniz, {admin?.username}</h2>
            <p>Sol menüden yönetmek istediğiniz bölümü seçebilirsiniz.</p>
          </div>
        )
      case 'ayarlar':
        return <SettingsManager />
      case 'slider':
        return <SlidesManager />
      case 'kurumsal':
        return <CorporatePagesManager />
      case 'urunler':
        return <ProductsManager />
      case 'haberler':
        return <NewsManager />
      case 'galeri':
        return <GalleryManager />
      case 'smtp':
        return <SmtpManager />
      case 'sifre':
        return <PasswordManager />
      default:
        return <div>Lütfen sol menüden bir seçenek seçin.</div>
    }
  }

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Bona Admin</h2>
        </div>
        <nav className={styles.nav}>
          <button className={activeTab === 'dashboard' ? styles.active : ''} onClick={() => setActiveTab('dashboard')}>Gösterge Paneli</button>
          <button className={activeTab === 'ayarlar' ? styles.active : ''} onClick={() => setActiveTab('ayarlar')}>Site Ayarları</button>
          <button className={activeTab === 'slider' ? styles.active : ''} onClick={() => setActiveTab('slider')}>Slayt Yönetimi</button>
          <button className={activeTab === 'kurumsal' ? styles.active : ''} onClick={() => setActiveTab('kurumsal')}>Kurumsal Sayfalar</button>
          <button className={activeTab === 'urunler' ? styles.active : ''} onClick={() => setActiveTab('urunler')}>Ürünler</button>
          <button className={activeTab === 'haberler' ? styles.active : ''} onClick={() => setActiveTab('haberler')}>Haberler / Duyurular</button>
          <button className={activeTab === 'galeri' ? styles.active : ''} onClick={() => setActiveTab('galeri')}>Galeri & Sertifikalar</button>
          <button className={activeTab === 'smtp' ? styles.active : ''} onClick={() => setActiveTab('smtp')}>SMTP Ayarları</button>
          <button className={activeTab === 'sifre' ? styles.active : ''} onClick={() => setActiveTab('sifre')}>Şifre Değiştir</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            {/* Mobilde hamburger buraya gelebilir */}
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.adminName}>{admin?.username}</span>
            <button onClick={logout} className={styles.logoutBtn}>Çıkış Yap</button>
          </div>
        </header>

        <div className={styles.content}>
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

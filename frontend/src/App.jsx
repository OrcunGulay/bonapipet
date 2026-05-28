import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import WhatsAppButton from './components/common/WhatsAppButton.jsx'
import CorporatePage from './pages/CorporatePage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import NewsDetailPage from './pages/NewsDetailPage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import CertificatesPage from './pages/CertificatesPage.jsx'
import ProductionPage from './pages/ProductionPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Admin Rotaları ──────────────────────────────────────── */}
        <Route path="/admin/giris" element={<AdminLoginPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Public Rotaları (Header + Footer ile) ──────────────── */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/kurumsal" element={<CorporatePage />} />
                  <Route path="/kurumsal/:seo" element={<CorporatePage />} />
                  <Route path="/urun/:seo" element={<ProductDetailPage />} />
                  <Route path="/kategori/:seo" element={<CategoryPage />} />
                  <Route path="/haber/:seo" element={<NewsDetailPage />} />
                  <Route path="/galeri" element={<GalleryPage />} />
                  <Route path="/sertifikalar" element={<CertificatesPage />} />
                  <Route path="/uretim" element={<ProductionPage />} />
                  <Route path="/iletisim" element={<ContactPage />} />
                </Routes>
              </main>
              <WhatsAppButton />
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext.jsx'
import apiClient from '../../api/apiClient.js'
import { uploadUrl } from '../../api/config.js'
import styles from './ProductsSection.module.css'

export default function ProductsSection() {
  const { lang, t } = useLang()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          apiClient.get(`/products/${lang}`),
          apiClient.get('/categories')
        ])
        setProducts(prodRes.data.data || [])
        setCategories(catRes.data.data || [])
      } catch (err) {
        console.error('Products fetch error', err)
      }
    }
    fetchData()
  }, [lang])

  return (
    <section className={styles.productSection}>
      <div className="container">
        <div className="sec-title">
          <h2>{t.urunlerimiz || 'Ürünlerimiz'}</h2>
        </div>

        <div className={styles.grid}>
          {categories.filter(c => c.dil === lang || c.dil === 'tr').map(category => {
            // İlgili kategoriye ait ilk ürünü bulup resmini kapak olarak kullanalım
            const catProduct = products.find(p => p.kategori === category.seo)
            const imageUrl = catProduct?.resim ? uploadUrl(catProduct.resim) : '/images/resimyok.png'

            return (
              <div key={category.id} className={styles.productCard}>
                <div className={styles.imageBox}>
                  <img src={imageUrl} alt={category.no} />
                  <div className={styles.overlay}>
                    <Link to={`/urun/${category.seo}`} className={styles.viewBtn}>
                      {t.incele || 'İncele'}
                    </Link>
                  </div>
                </div>
                <div className={styles.lowerBox}>
                  <h3><Link to={`/kategori/${category.seo}`}>{category.no}</Link></h3>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import HeroSlider from '../components/home/HeroSlider.jsx'
import AboutSection from '../components/home/AboutSection.jsx'
import ProductsSection from '../components/home/ProductsSection.jsx'
import FeaturedSection from '../components/home/FeaturedSection.jsx'
import NewsSection from '../components/home/NewsSection.jsx'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <AboutSection />
      <ProductsSection />
      <FeaturedSection />
      <NewsSection />
    </>
  )
}

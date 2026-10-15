import HeroCarousel from '../components/home/HeroCarousel.jsx'
import CollectionSection from '../components/home/CollectionSection.jsx'
import NewArrivals from '../components/home/NewArrivals.jsx'
import Bestsellers from '../components/home/Bestsellers.jsx'
import BrandStory from '../components/home/BrandStory.jsx'
import Newsletter from '../components/home/Newsletter.jsx'

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <CollectionSection />
      <NewArrivals />
      <Bestsellers />
      <BrandStory />
      <Newsletter />
    </main>
  )
}

import { getFeaturedProducts } from '@/lib/products';
import { HeroSection }      from '@/components/layout/HeroSection';
import { MarqueeBand }      from '@/components/ui/MarqueeBand';
import { FeaturedGrid }     from '@/components/product/FeaturedGrid';
import { CategoryGrid }     from '@/components/layout/CategoryGrid';
import { StorySection }     from '@/components/layout/StorySection';
import { TrustPillars }     from '@/components/ui/TrustPillars';

export default async function HomePage() {
  const featured = await getFeaturedProducts(3);

  return (
    <>
      <HeroSection />
      <MarqueeBand />
      <FeaturedGrid products={featured} />
      <CategoryGrid />
      <StorySection />
      <TrustPillars />
    </>
  );
}

import { Navbar } from "@/components/Navbar";
import { HomeHero } from "@/components/home/HomeHero";
import { StatsSection } from "@/components/home/StatsSection";
import { IntroSection } from "@/components/home/IntroSection";
import { SpecialitiesSection } from "@/components/home/SpecialitiesSection";
import { FeaturedWorkSection } from "@/components/home/FeaturedWorkSection";
import { WhySection } from "@/components/home/WhySection";
import { Testimonials } from "@/components/Testimonials";
import { InstagramSection } from "@/components/home/InstagramSection";
import { CTASection } from "@/components/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar variant="dark" />
      <HomeHero />
      <StatsSection />
      <IntroSection />
      <SpecialitiesSection />
      <FeaturedWorkSection />
      <WhySection />
      <Testimonials />
      <InstagramSection />
      <CTASection />
    </>
  );
}

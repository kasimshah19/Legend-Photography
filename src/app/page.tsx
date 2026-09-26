import type { Metadata } from "next";
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
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "Legend Photography | Premium Wedding & Pre-Wedding Photography",
  description:
    "Legend Photography is a premium photography studio specializing in authentic wedding, pre-wedding, maternity, and portrait photography.",
  alternates: { canonical: siteConfig.url },
};

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

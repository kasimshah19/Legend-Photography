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
import { connectMongo } from "@/lib/mongodb";
import { Homepage } from "@/lib/models/Homepage";
import { Portfolio } from "@/lib/models/Portfolio";

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    url: siteConfig.url,
  }
};

async function getHomepageData() {
  try {
    await connectMongo();
    const settings = await Homepage.findOne().populate('featuredAlbums').lean();
    return JSON.parse(JSON.stringify(settings || {}));
  } catch (error) {
    console.error("Failed to fetch homepage data from DB, falling back to defaults:", error);
    return {};
  }
}

export default async function HomePage() {
  const data = await getHomepageData();

  const isEnabled = (section: string) => {
    return data.sections?.[section]?.enabled ?? true;
  };

  return (
    <>
      <Navbar variant="dark" />
      <HomeHero data={data} />
      {isEnabled('stats') && <StatsSection />}
      {isEnabled('intro') && <IntroSection />}
      {isEnabled('specialities') && <SpecialitiesSection />}
      {isEnabled('featuredWork') && <FeaturedWorkSection featuredAlbums={data.featuredAlbums} />}
      {isEnabled('why') && <WhySection />}
      {isEnabled('testimonials') && <Testimonials />}
      {isEnabled('instagram') && <InstagramSection />}
      {isEnabled('cta') && <CTASection data={data} />}
    </>
  );
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import BrandSlider from "@/components/BrandSlider";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import SlideshowSection from "@/components/SlideshowSection";
import ProcessSection from "@/components/ProcessSection";
import RevolutionSection from "@/components/RevolutionSection";
import ResultsShowcase from "@/components/ResultsShowcase";
import MembershipSection from "@/components/MembershipSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTABanner from "@/components/CTABanner";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StatsSection from "@/components/StatsSection";
import TeamSection from "@/components/TeamSection";
import VideoParallaxSection from "@/components/VideoParallaxSection";
import InstagramWall from "@/components/InstagramWall";

import { faqs } from "@/components/FAQSection";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <SEO
        title="Home"
        description="Austin House Beauty & Spa — Colombo's gold standard in skincare, facials, laser treatments, manicures & wellness. Book your appointment today."
        keywords="beauty spa colombo, luxury facials sri lanka, laser treatments colombo, skin care colombo, austin house beauty"
        canonical="https://bright-living-clone.lovable.app/"
        ogImage="https://bright-living-clone.lovable.app/og-home.jpg"
        breadcrumbs={[
          { name: "Home", url: "https://bright-living-clone.lovable.app/" },
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://bright-living-clone.lovable.app",
            name: "Austin House Beauty & Spa",
            description: "Colombo's gold standard in skincare, facials, laser treatments, manicures & wellness.",
            url: "https://bright-living-clone.lovable.app",
            telephone: "+94-112196386",
            address: {
              "@type": "PostalAddress",
              streetAddress: "No 22, Austin Place",
              addressLocality: "Colombo",
              postalCode: "00800",
              addressCountry: "LK",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 6.9123,
              longitude: 79.8765
            },
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              opens: "10:00",
              closes: "18:00",
            },
            priceRange: "$$",
            image: "https://bright-living-clone.lovable.app/favicon.ico",
            sameAs: [],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(faq => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
              }
            }))
          }
        ]}
      />
      <HeroSection />
      <BrandSlider />
      <VideoParallaxSection />
      <AboutSection />
      <StatsSection />
      <ServicesSection />
      <SlideshowSection />
      <ProcessSection />
      <TeamSection />
      <RevolutionSection />
      <ResultsShowcase />
      <InstagramWall />
      <TestimonialsSection />
      <MembershipSection />
      <CTABanner />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;

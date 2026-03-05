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
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";

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
        canonical="https://bright-living-clone.lovable.app/"
        ogImage="https://bright-living-clone.lovable.app/og-home.jpg"
        breadcrumbs={[
          { name: "Home", url: "https://bright-living-clone.lovable.app/" },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://bright-living-clone.lovable.app",
          name: "Austin House Beauty & Spa",
          description: "Colombo's gold standard in skincare, facials, laser treatments, manicures & wellness.",
          url: "https://bright-living-clone.lovable.app",
          telephone: "+94-XX-XXX-XXXX",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Colombo",
            addressCountry: "LK",
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "18:00",
          },
          priceRange: "$$",
          image: "https://bright-living-clone.lovable.app/favicon.ico",
          sameAs: [],
        }}
      />
      <HeroSection />
      <BrandSlider />
      <AboutSection />
      <ServicesSection />
      <SlideshowSection />
      <ProcessSection />
      <RevolutionSection />
      <ResultsShowcase />
      <MembershipSection />
      <TestimonialsSection />
      <CTABanner />
      <FAQSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import GalleryGrid from "@/components/GalleryGrid";

import facialBefore from "@/assets/gallery-facial-before.jpg";
import facialAfter from "@/assets/gallery-facial-after.jpg";
import nailsBefore from "@/assets/gallery-nails-before.jpg";
import nailsAfter from "@/assets/gallery-nails-after.jpg";
import peelBefore from "@/assets/gallery-peel-before.jpg";
import peelAfter from "@/assets/gallery-peel-after.jpg";

import { useData } from "@/contexts/DataContext";
import { Loader2 } from "lucide-react";

const Gallery = () => {
  const { beforeAfterPairs, galleryLoading } = useData();
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Gallery" description="See stunning before & after transformations — facials, nail art, chemical peels and more at Austin House Beauty & Spa, Colombo." canonical="https://bright-living-clone.lovable.app/gallery" ogImage="https://bright-living-clone.lovable.app/og-gallery.jpg" breadcrumbs={[{ name: "Home", url: "https://bright-living-clone.lovable.app/" }, { name: "Gallery", url: "https://bright-living-clone.lovable.app/gallery" }]} />
      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm font-body mb-4">Results</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4">
              Before & <span className="text-gold-gradient">After</span>
            </h1>
            <p className="text-cream/60 font-body text-lg max-w-2xl mx-auto">
              See the transformative power of our gold-standard treatments. Drag the slider to reveal real results from our valued clients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Before/After Sliders */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {galleryLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-gold" size={48} />
            </div>
          ) : beforeAfterPairs.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground font-body">
              No before/after treatments available yet.
            </div>
          ) : (
            <div className="space-y-20">
              {beforeAfterPairs.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="grid lg:grid-cols-2 gap-10 items-center"
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <BeforeAfterSlider beforeImage={item.before_image} afterImage={item.after_image} />
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <span className="text-gold uppercase tracking-[0.3em] text-xs font-body">Treatment Result</span>
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mt-2 mb-4">{item.title}</h2>
                    <p className="text-muted-foreground font-body leading-relaxed mb-6">{item.description}</p>
                    <Link
                      to="/services"
                      className="inline-flex items-center justify-center px-8 py-3 bg-gold-gradient text-primary-foreground font-body font-bold text-sm uppercase tracking-wider rounded-sm shadow-gold hover:opacity-90 transition-opacity"
                    >
                      Book This Treatment
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Photo Gallery Grid */}
      <GalleryGrid />

      {/* CTA */}
      <section className="py-20 bg-charcoal">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
              Ready For Your <span className="text-gold-gradient">Transformation?</span>
            </h2>
            <p className="text-cream/60 font-body text-lg max-w-xl mx-auto mb-8">
              Every journey begins with a single step. Book your consultation today and discover what's possible.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-10 py-4 bg-gold-gradient text-primary-foreground font-body font-bold tracking-wider uppercase text-sm rounded-sm shadow-gold hover:opacity-90 transition-opacity"
            >
              View All Services
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Gallery;

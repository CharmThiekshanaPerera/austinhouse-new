import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useEffect } from "react";

export const serviceCategories = [
  { id: 'facials', name: 'Facials', image: '/category_images/facials.png', path: '/services/facials' },
  { id: 'chemical-peels', name: 'Chemical Peels', image: '/category_images/peels.png', path: '/services/chemical-peels' },
  { id: 'waxing', name: 'Waxing Treatments', image: '/category_images/waxing.png', path: '/services/waxing' },
  { id: 'specialized', name: 'Specialized Procedures', image: '/category_images/specialized.png', path: '/services/specialized' },
  { id: 'anti-aging', name: 'Anti-Aging & Tightening', image: '/category_images/anti_aging.png', path: '/services/anti-aging' },
  { id: 'intimate', name: 'Intimate Area Services', image: '/category_images/intimate.png', path: '/services/intimate' },
  { id: 'wart-removal', name: 'Wart & Skin Tag Removal', image: '/category_images/wart_removal.png', path: '/services/wart-removal' },
  { id: 'micro-dermabrasion', name: 'Micro-Dermabrasion', image: '/category_images/microderm.png', path: '/services/micro-dermabrasion' },
];

const Services = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Our Services - Aesthetic Treatments"
        description="Explore our premium beauty services including facials, chemical peels, waxing, anti-aging, and specialized procedures."
        canonical="https://bright-living-clone.lovable.app/services"
      />
      
      {/* Hero Banner */}
      <section className="pt-32 pb-16 bg-charcoal">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm font-body mb-4">Aesthetic Excellence</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4">
              Explore Our <span className="text-gold-gradient">Services</span>
            </h1>
            <p className="text-cream/60 font-body text-lg max-w-2xl mx-auto">
              Select a category below to discover our meticulously crafted treatments, guided by expertise, luxury, and transformative results.
            </p>
            <div className="mt-8">
              <Link to="/" className="text-gold hover:text-gold-light font-body text-sm transition-colors uppercase tracking-widest border-b border-gold pb-1">
                Return Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Aesthetic Category Cards Grid */}
      <section className="py-20 lg:py-28 bg-[#fdfcfb]">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={category.path} className="group block relative h-[400px] w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">
                  {/* Background Image */}
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                  </div>
                  
                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content inside the card */}
                  <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h2 className="font-display text-2xl font-bold text-white mb-3 group-hover:text-gold transition-colors">
                      {category.name}
                    </h2>
                    
                    <div className="flex items-center text-white/80 font-body text-sm tracking-wider uppercase font-semibold gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      Explore Services 
                      <ArrowRight size={16} className="text-gold group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Decorative corner border on hover */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/0 group-hover:border-gold/50 transition-colors duration-500" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/0 group-hover:border-gold/50 transition-colors duration-500" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-charcoal text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
              Not Sure Which Treatment Is <br className="hidden md:block"/> <span className="text-gold-gradient">Right For You?</span>
            </h2>
            <p className="text-white/60 font-body text-lg max-w-2xl mx-auto mb-10">
              Book a complimentary consultation with our aesthetic experts. We'll assess your unique needs and recommend a highly personalized treatment plan.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gold hover:bg-[#b5952f] text-white font-body font-bold tracking-wider uppercase text-sm rounded-sm shadow-xl shadow-gold/20 transition-all"
            >
              Consult an Expert <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const serviceCategories = [
  { id: 'facials', name: 'Facials', image: '/category_images/facials.png', path: '/services/facials' },
  { id: 'chemical-peels', name: 'Chemical Peels', image: '/category_images/peels.png', path: '/services/chemical-peels' },
  { id: 'waxing', name: 'Waxing Treatments', image: '/category_images/waxing.png', path: '/services/waxing' },
  { id: 'specialized', name: 'Specialized Procedures', image: '/category_images/specialized.png', path: '/services/specialized' },
  { id: 'anti-aging', name: 'Anti-Aging & Tightening', image: '/category_images/anti_aging.png', path: '/services/anti-aging' },
  { id: 'intimate', name: 'Intimate Area Services', image: '/category_images/intimate.png', path: '/services/intimate' },
  { id: 'wart-removal', name: 'Wart & Skin Tag Removal', image: '/category_images/wart_removal.png', path: '/services/wart-removal' },
  { id: 'micro-dermabrasion', name: 'Micro-Dermabrasion', image: '/category_images/microderm.png', path: '/services/micro-dermabrasion' },
];

interface OtherServicesProps {
  currentPath: string;
}

const OtherServices = ({ currentPath }: OtherServicesProps) => {
  const otherServices = serviceCategories.filter(s => s.path !== currentPath);

  return (
    <section className="py-16 bg-[#fdfcfb] border-t border-border/40">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Explore Other <span className="text-gold-gradient">Treatments</span>
          </h3>
          <Link to="/services" className="hidden md:flex items-center gap-2 text-gold font-bold text-sm hover:text-[#b5952f] transition-colors uppercase tracking-wider">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {/* Horizontal scroll container for smaller screens, Grid for larger */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0 gap-4 lg:gap-6 snap-x snap-mandatory hide-scrollbar">
          {otherServices.slice(0, 4).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[260px] md:min-w-0 snap-start"
            >
              <Link to={category.path} className="group block relative h-[250px] w-full rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                
                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-display text-lg font-bold text-white mb-1 group-hover:text-gold transition-colors">
                    {category.name}
                  </h4>
                  <div className="flex items-center text-white/80 font-body text-xs tracking-wider uppercase font-semibold gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    Discover <ArrowRight size={14} className="text-gold group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
            <Link to="/services" className="inline-flex items-center gap-2 text-gold font-bold text-sm hover:text-[#b5952f] transition-colors uppercase tracking-wider border-b border-gold pb-1">
                View All Services <ArrowRight size={16} />
            </Link>
        </div>
      </div>
    </section>
  );
};

export default OtherServices;

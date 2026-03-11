import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { serviceCategories } from "@/pages/Services";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import React from "react";

const ServicesSection = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <section id="services" className="py-20 lg:py-32 bg-[#fdfcfb]">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">Aesthetic Excellence</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Our Beauty Essentials & <span className="text-gold-gradient">Treatments</span>
          </h2>
        </motion.div>

        <div className="relative px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {serviceCategories.map((category, index) => (
                <CarouselItem key={category.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={category.path} className="group block relative h-[380px] w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700">
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
                        <h3 className="font-display text-2xl font-bold text-white mb-3 group-hover:text-gold transition-colors">
                          {category.name}
                        </h3>
                        
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-gold text-charcoal hover:text-white border-gold/20" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-gold text-charcoal hover:text-white border-gold/20" />
          </Carousel>
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-3 px-10 py-4 bg-charcoal hover:bg-charcoal/90 text-white font-body font-bold tracking-wider uppercase text-sm rounded-sm transition-all"
          >
            View Full Menu <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

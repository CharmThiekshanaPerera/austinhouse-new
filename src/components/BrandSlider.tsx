import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

const brands = [
  { name: "Dermalogica", style: "font-serif italic" },
  { name: "Obagi", style: "font-sans tracking-[0.4em] uppercase text-base" },
  { name: "SkinCeuticals", style: "font-serif font-light tracking-wider" },
  { name: "iS Clinical", style: "font-sans font-bold tracking-[0.2em] uppercase text-base" },
  { name: "Environ", style: "font-sans tracking-[0.5em] uppercase text-base" },
  { name: "Depilève", style: "font-serif italic font-light" },
  { name: "Medik8", style: "font-mono font-bold tracking-wider uppercase text-base" },
  { name: "ZO Skin Health", style: "font-sans font-light tracking-[0.3em] uppercase text-base" },
  { name: "Heliocare", style: "font-serif tracking-wider" },
  { name: "La Roche-Posay", style: "font-sans font-light italic tracking-wide" },
];

const BrandSlider = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  return (
    <section className="py-20 bg-[#faf9f6] overflow-hidden border-y border-gold/10">
      <div className="container mx-auto px-4 lg:px-8 mb-12 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-primary/60 font-body text-xs md:text-sm uppercase tracking-[0.4em] font-semibold"
        >
          Trusted by the brands you love
        </motion.p>
      </div>
      <div className="relative px-6 md:px-12 w-full">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-8">
            {brands.map((brand, i) => (
              <CarouselItem key={`${brand.name}-${i}`} className="pl-4 md:pl-8 basis-1/2 md:basis-1/4 lg:basis-1/6">
                <div className="flex items-center justify-center h-16 group">
                  <span
                    className={`text-base md:text-lg text-muted-foreground/30 group-hover:text-gold transition-all duration-500 select-none cursor-default group-hover:scale-110 ${brand.style}`}
                  >
                    {brand.name}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default BrandSlider;

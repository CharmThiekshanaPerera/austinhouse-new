import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import slideshowReception from "@/assets/slideshow-reception.jpg";
import slideshowTreatment from "@/assets/slideshow-treatment.jpg";
import slideshowProducts from "@/assets/slideshow-products.jpg";
import slideshowLounge from "@/assets/slideshow-lounge.jpg";

const slides = [
  {
    image: slideshowReception,
    title: "Welcome to Elegance",
    subtitle: "Our grand reception sets the tone for your transformative journey",
  },
  {
    image: slideshowTreatment,
    title: "State-of-the-Art Treatments",
    subtitle: "World-class equipment meets expert hands for flawless results",
  },
  {
    image: slideshowProducts,
    title: "Premium Product Range",
    subtitle: "Gold-standard skincare curated for lasting radiance",
  },
  {
    image: slideshowLounge,
    title: "Relax & Rejuvenate",
    subtitle: "Unwind in our luxurious spa lounge before or after your treatment",
  },
];

const SlideshowSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[70vh] lg:h-[80vh] overflow-hidden bg-charcoal">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-dark-overlay" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-gold uppercase tracking-[0.3em] text-sm font-body mb-4">Our Space</p>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-cream mb-4">
                {slides[current].title}
              </h2>
              <p className="text-cream/60 font-body text-lg md:text-xl">
                {slides[current].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex items-center justify-center gap-6">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === current ? "bg-gold-gradient w-10" : "bg-cream/20 w-2"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default SlideshowSection;

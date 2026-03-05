import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import slideshowReception from "@/assets/slideshow-reception.jpg";
import slideshowProducts from "@/assets/slideshow-products.jpg";
import slideshowLounge from "@/assets/slideshow-lounge.jpg";
import slideshowTreatment from "@/assets/slideshow-treatment.jpg";

const slides = [heroBg, slideshowReception, slideshowTreatment, slideshowLounge, slideshowProducts];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={current}
          src={slides[current]}
          alt="Austin House"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.15 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2, ease: "easeInOut" }, scale: { duration: 6, ease: "linear" } }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-dark-overlay" />

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-gold w-6" : "bg-cream/40 hover:bg-cream/60"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 lg:px-8 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-cream leading-tight mb-6">
            Gold Standard Beauty & Allied Services{" "}
            <span className="text-gold-gradient">For The Whole Family</span>
          </h1>
          <p className="text-lg md:text-xl text-cream/70 font-body font-light max-w-xl mb-10 leading-relaxed">
            Innovative technology & expertly trained staff will elevate your confidence to extraordinary new heights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center px-8 py-4 bg-gold-gradient text-primary-foreground font-body font-bold tracking-wider uppercase text-sm rounded-sm shadow-gold hover:opacity-90 transition-opacity"
            >
              Explore Services
            </button>
            <button
              onClick={() => document.querySelector("#membership")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center px-8 py-4 border border-gold text-gold font-body font-bold tracking-wider uppercase text-sm rounded-sm hover:bg-gold/10 transition-colors"
            >
              Join Membership
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 max-w-lg border-t border-gold/30 pt-6"
        >
          <p className="text-gold-light italic font-display text-lg">
            "My visit to Austin House was a life changing experience"
          </p>
          <p className="text-cream/40 text-sm mt-2 font-body">— A Valued Client</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

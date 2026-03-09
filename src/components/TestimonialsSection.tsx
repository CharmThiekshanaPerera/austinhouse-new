import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

// Fallback data removed — we use live data from useData()

import { useData } from "@/contexts/DataContext";

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const { testimonials, testimonialsLoading } = useData();

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % (testimonials.length || 1)), [testimonials.length]);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % (testimonials.length || 1));

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  return (
    <section className="py-20 lg:py-32 bg-charcoal">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold uppercase tracking-[0.3em] text-sm font-body mb-4">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-cream">
            What Our Clients <span className="text-gold-gradient">Say</span>
          </h2>
        </motion.div>

        {testimonialsLoading ? (
          <div className="max-w-3xl mx-auto text-center animate-pulse space-y-4">
            <div className="w-12 h-12 bg-gold/20 rounded-full mx-auto" />
            <div className="h-5 bg-cream/10 rounded w-3/4 mx-auto" />
            <div className="h-5 bg-cream/10 rounded w-2/3 mx-auto" />
            <div className="h-3 bg-gold/20 rounded w-1/4 mx-auto mt-4" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center text-cream/60 font-body py-12">
            No testimonials added yet. Share your experience with us!
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Quote className="w-12 h-12 text-gold mx-auto mb-8 opacity-60" />
              <p className="font-display text-xl md:text-2xl text-cream/90 italic leading-relaxed mb-8">
                "{testimonials[current]?.text}"
              </p>
              <p className="text-gold font-body font-bold tracking-wider uppercase text-sm">
                {testimonials[current]?.author}
              </p>
            </motion.div>

            <div className="flex items-center justify-center gap-6 mt-12">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-gold-gradient w-8" : "bg-cream/20"
                      }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;

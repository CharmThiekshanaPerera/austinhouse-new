import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    text: "I got a Facial done and my skin was absolutely GLOWING afterwards. The attention to detail and care was unlike anything I've experienced. I truly recommend this clinic to everyone.",
    author: "Sarah M.",
  },
  {
    text: "The absolute best! The whole team are incredible professionals. The doctor explained everything extremely well and took great care of me. I'm already planning my next visit!",
    author: "Dilini P.",
  },
  {
    text: "Very friendly and professional service from start to finish. The prices are competitive and I'm always thrilled with the results. Austin House has become my beauty sanctuary.",
    author: "Rashmi K.",
  },
  {
    text: "I can't believe the laser hair removal procedure was so pain-free! The technology they use is clearly top-of-the-line. The results exceeded all my expectations.",
    author: "Nadeesha W.",
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % testimonials.length), []);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

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
              "{testimonials[current].text}"
            </p>
            <p className="text-gold font-body font-bold tracking-wider uppercase text-sm">
              {testimonials[current].author}
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
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current ? "bg-gold-gradient w-8" : "bg-cream/20"
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
      </div>
    </section>
  );
};

export default TestimonialsSection;

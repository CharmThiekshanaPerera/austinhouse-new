import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTABanner = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-charcoal overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold uppercase tracking-[0.3em] text-sm font-body mb-4">Begin Today</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-6 max-w-3xl mx-auto leading-tight">
            Your Transformation Is Just{" "}
            <span className="text-gold-gradient">One Visit Away</span>
          </h2>
          <p className="text-cream/50 font-body text-lg max-w-xl mx-auto mb-10">
            Book a complimentary consultation and let our experts create a personalised beauty plan just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-10 py-4 bg-gold-gradient text-primary-foreground font-body font-bold tracking-wider uppercase text-sm rounded-sm shadow-gold hover:opacity-90 transition-opacity"
            >
              Book Consultation
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-4 border border-gold text-gold font-body font-bold tracking-wider uppercase text-sm rounded-sm hover:bg-gold/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;

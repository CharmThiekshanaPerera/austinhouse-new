import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LazyImage from "@/components/LazyImage";
import resultsImg from "@/assets/results-glow.jpg";
import lifestyleImg from "@/assets/lifestyle-couple.jpg";

const ResultsShowcase = () => {
  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">Real Results</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            See The <span className="text-gold-gradient">Difference</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative rounded-lg overflow-hidden"
          >
            <LazyImage
              src={resultsImg}
              alt="Glowing skin after gold facial treatment"
              className="w-full h-[400px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              skeletonClassName="w-full h-[400px] lg:h-[500px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="font-display text-2xl font-bold text-cream mb-2">Radiant Glow</h3>
              <p className="text-cream/70 font-body text-sm mb-4">
                Our signature gold facial delivers visible luminosity from the very first session.
              </p>
              <Link
                to="/gallery"
                className="inline-flex items-center text-gold font-body text-sm font-bold uppercase tracking-wider hover:text-gold-light transition-colors"
              >
                View Gallery →
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="group relative rounded-lg overflow-hidden"
          >
            <LazyImage
              src={lifestyleImg}
              alt="Happy couple at Austin House spa"
              className="w-full h-[400px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              skeletonClassName="w-full h-[400px] lg:h-[500px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="font-display text-2xl font-bold text-cream mb-2">For The Whole Family</h3>
              <p className="text-cream/70 font-body text-sm mb-4">
                Couples, families, and individuals — everyone deserves to feel extraordinary.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center text-gold font-body text-sm font-bold uppercase tracking-wider hover:text-gold-light transition-colors"
              >
                Explore Services →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResultsShowcase;

import { motion } from "framer-motion";
import revolutionImg from "@/assets/beauty-revolution.jpg";

const RevolutionSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-charcoal relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm font-body mb-4">Beauty Revolution</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-cream leading-tight mb-6">
              Wealth, Power & Success Will Not Bring Happiness{" "}
              <span className="text-gold-gradient">If You Go Unnoticed</span>
            </h2>
            <p className="text-cream/60 font-body text-lg leading-relaxed mb-8">
              At Austin House, we don't just enhance your appearance — we ignite your inner radiance. Our expert team crafts personalized beauty journeys that turn heads and transform lives. Step into the spotlight you deserve.
            </p>
            <a
              href="#membership"
              className="inline-flex items-center justify-center px-8 py-4 bg-gold-gradient text-primary-foreground font-body font-bold tracking-wider uppercase text-sm rounded-sm shadow-gold hover:opacity-90 transition-opacity"
            >
              Become a Head Turner
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={revolutionImg}
                alt="Radiant beauty transformation"
                className="w-full h-[400px] lg:h-[550px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RevolutionSection;

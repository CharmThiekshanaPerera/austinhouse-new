import { motion } from "framer-motion";
import aboutBg from "@/assets/about-bg.jpg";
import AnimatedCounter from "@/components/AnimatedCounter";
import LazyImage from "@/components/LazyImage";

const AboutSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">About Us</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              What Drives <span className="text-gold-gradient">Transformation</span>
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-6 text-lg">
              Duration of treatment is the key to a good result. That is what we do at Austin House.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed">
              Our protocols adhere to gold standards backed by original research. Every procedure is meticulously designed for optimal safety and efficacy, following globally recognized practices. Our team stays at the forefront of innovation, guaranteeing you the highest quality care and results that speak for themselves.
            </p>
            {/* <div className="mt-8 flex gap-12">
              <div>
                <p className="font-display text-3xl font-bold text-gold-gradient">
                  <AnimatedCounter target={15} suffix="+" />
                </p>
                <p className="text-muted-foreground text-sm font-body mt-1">Years Experience</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-gold-gradient">
                  <AnimatedCounter target={5000} suffix="+" />
                </p>
                <p className="text-muted-foreground text-sm font-body mt-1">Happy Clients</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-gold-gradient">
                  <AnimatedCounter target={50} suffix="+" />
                </p>
                <p className="text-muted-foreground text-sm font-body mt-1">Treatments</p>
              </div>
            </div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden shadow-gold">
              <LazyImage
                src={aboutBg}
                alt="Premium treatment room at Austin House"
                className="w-full h-[400px] lg:h-[500px] object-cover"
                skeletonClassName="w-full h-[400px] lg:h-[500px]"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold-gradient rounded-lg flex items-center justify-center">
              <div className="text-center text-primary-foreground">
                <p className="font-display text-2xl font-bold">Gold</p>
                <p className="text-xs uppercase tracking-widest">Standard</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

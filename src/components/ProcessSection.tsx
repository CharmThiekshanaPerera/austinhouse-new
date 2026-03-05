import { motion } from "framer-motion";
import { ClipboardCheck, Sparkles, Heart, Crown } from "lucide-react";
import LazyImage from "@/components/LazyImage";
import processImg from "@/assets/process-journey.jpg";

const steps = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Consultation",
    description: "Our experts analyse your skin, listen to your goals, and design a bespoke treatment plan.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Treatment",
    description: "Relax while our trained professionals apply gold-standard protocols using premium products.",
  },
  {
    icon: Heart,
    step: "03",
    title: "Aftercare",
    description: "Receive a personalised aftercare plan and premium products to maintain your results at home.",
  },
  {
    icon: Crown,
    step: "04",
    title: "Transformation",
    description: "Walk out glowing with renewed confidence — and come back whenever you need a refresh.",
  },
];

const ProcessSection = () => {
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
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">How It Works</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-10">
              Your Beauty <span className="text-gold-gradient">Journey</span>
            </h2>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="flex gap-5 group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-300">
                      <step.icon size={22} className="text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-gold font-body text-xs font-bold tracking-widest">{step.step}</span>
                      <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="rounded-lg overflow-hidden shadow-gold">
              <LazyImage
                src={processImg}
                alt="Our treatment process from consultation to transformation"
                className="w-full h-[450px] lg:h-[580px] object-cover"
                skeletonClassName="w-full h-[450px] lg:h-[580px]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

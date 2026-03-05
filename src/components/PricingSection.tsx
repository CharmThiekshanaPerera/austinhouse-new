import { motion } from "framer-motion";
import { Check, Crown, Sparkles, Star } from "lucide-react";

const packages = [
  {
    name: "Glow Essentials",
    price: "LKR 15,000",
    period: "per session",
    icon: Sparkles,
    features: [
      "Signature gold facial (60 min)",
      "Skin analysis & consultation",
      "Aftercare product sample kit",
      "10% off next visit",
    ],
    popular: false,
  },
  {
    name: "Radiance Package",
    price: "LKR 35,000",
    period: "3 sessions",
    icon: Star,
    features: [
      "3x signature gold facials",
      "1x microdermabrasion session",
      "Full skin assessment report",
      "Premium aftercare kit included",
      "20% off all products",
      "Priority booking access",
    ],
    popular: true,
  },
  {
    name: "Royal Experience",
    price: "LKR 75,000",
    period: "6 sessions",
    icon: Crown,
    features: [
      "6x premium treatments of choice",
      "2x massage therapy sessions",
      "Complete aftercare collection",
      "Dedicated beauty consultant",
      "30% off all products",
      "VIP lounge access",
      "Complimentary refreshments",
    ],
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-charcoal">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold uppercase tracking-[0.3em] text-sm font-body mb-4">Packages</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-cream">
            Treatment <span className="text-gold-gradient">Packages</span>
          </h2>
          <p className="text-cream/50 font-body text-lg mt-4 max-w-2xl mx-auto">
            Save more with our curated treatment bundles — designed for those who demand the best.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className={`relative rounded-lg p-8 ${
                pkg.popular
                  ? "bg-gradient-to-b from-gold-dark/20 to-charcoal border-2 border-gold/40 shadow-gold"
                  : "bg-charcoal border border-gold/10"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gold-gradient text-primary-foreground text-xs font-body font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <pkg.icon className="w-8 h-8 text-gold mx-auto mb-3" />
                <h3 className="font-display text-xl font-bold text-cream mb-1">{pkg.name}</h3>
                <div className="mt-4">
                  <span className="font-display text-3xl font-bold text-gold-gradient">{pkg.price}</span>
                  <span className="text-cream/40 font-body text-sm ml-2">/ {pkg.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check size={16} className="text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-cream/70 font-body text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 font-body font-bold text-sm uppercase tracking-wider rounded-sm transition-all ${
                  pkg.popular
                    ? "bg-gold-gradient text-primary-foreground shadow-gold hover:opacity-90"
                    : "border border-gold/30 text-gold hover:bg-gold/10"
                }`}
              >
                Choose Package
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
    {
        id: 1,
        value: 1000,
        suffix: "+",
        label: "Happy Clients",
        description: "Trusted by Colombo's elite for premium beauty care.",
    },
    {
        id: 2,
        value: 50,
        suffix: "+",
        label: "Luxury Treatments",
        description: "From 24k gold facials to advanced laser therapies.",
    },
    {
        id: 3,
        value: 10,
        suffix: "+",
        label: "Years Experience",
        description: "A decade of excellence in the wellness industry.",
    },
    {
        id: 4,
        value: 100,
        suffix: "%",
        label: "Satisfaction",
        description: "Dedicated to exceeding your expectations every visit.",
    }
];

const StatsSection = () => {
    return (
        <section className="py-24 bg-charcoal text-white relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="text-center group"
                        >
                            <div className="mb-4">
                                <span className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 group-hover:to-gold transition-all duration-500">
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2500} />
                                </span>
                            </div>
                            <h3 className="text-gold font-body tracking-[0.2em] uppercase text-sm font-semibold mb-3">
                                {stat.label}
                            </h3>
                            <p className="text-white/60 font-body text-sm leading-relaxed max-w-[250px] mx-auto">
                                {stat.description}
                            </p>

                            {/* Animated underline */}
                            <div className="w-12 h-px bg-gold/30 mx-auto mt-6 group-hover:w-24 group-hover:bg-gold transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;

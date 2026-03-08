import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import LazyImage from "@/components/LazyImage";

// Fallback data removed — we use live data from useData()

import { useData } from "@/contexts/DataContext";

const TeamSection = () => {
  const { staff } = useData();

  return (
    <section className="py-20 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">Our Experts</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Meet The <span className="text-gold-gradient">Team</span>
          </h2>
        </motion.div>

        {staff.length === 0 ? (
          <div className="text-center text-muted-foreground font-body">
            No team members added yet. Check back soon!
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {staff.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group flex flex-col"
              >
                <div className="relative rounded-lg overflow-hidden mb-4 flex-shrink-0">
                  <LazyImage
                    src={member.image || "https://images.unsplash.com/photo-1594824432258-fdd9fc5b2c78?auto=format&fit=crop&q=80"}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                    skeletonClassName="w-full h-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full border border-gold/50 flex items-center justify-center text-gold hover:bg-gold/20 transition-colors"
                      aria-label={`${member.name} Instagram`}
                    >
                      <Instagram size={16} />
                    </a>
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-primary font-body text-sm font-bold uppercase tracking-wider mb-2">{member.role}</p>
                <p className="text-muted-foreground font-body text-sm leading-relaxed flex-1">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;

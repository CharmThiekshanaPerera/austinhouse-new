import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import LazyImage from "@/components/LazyImage";

import teamDoctor from "@/assets/team-doctor.jpg";
import teamAesthetician from "@/assets/team-aesthetician.jpg";
import teamTherapist from "@/assets/team-therapist.jpg";
import teamNailTech from "@/assets/team-nail-tech.jpg";

const team = [
  {
    image: teamDoctor,
    name: "Dr. Amaya Fernando",
    role: "Lead Dermatologist",
    bio: "With 15+ years in aesthetic medicine, Dr. Fernando pioneered our gold-standard treatment protocols.",
  },
  {
    image: teamAesthetician,
    name: "Nishadi Perera",
    role: "Senior Aesthetician",
    bio: "A certified skin specialist trained in London, Nishadi crafts personalized facial journeys for every client.",
  },
  {
    image: teamTherapist,
    name: "Kamini De Silva",
    role: "Massage Therapist",
    bio: "Trained in Balinese and Swedish techniques, Kamini's healing touch has earned her a devoted following.",
  },
  {
    image: teamNailTech,
    name: "Rashika Wijesekara",
    role: "Nail Art Specialist",
    bio: "A creative visionary whose intricate nail designs have been featured in national beauty magazines.",
  },
];

const TeamSection = () => {
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="relative rounded-lg overflow-hidden mb-4">
                <LazyImage
                  src={member.image}
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
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

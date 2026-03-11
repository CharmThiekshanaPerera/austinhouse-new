import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, Heart, Shield, Users } from "lucide-react";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import SEO from "@/components/SEO";
import AnimatedCounter from "@/components/AnimatedCounter";

import aboutBg from "@/assets/about-bg.jpg";
import contactExterior from "@/assets/contact-exterior.jpg";

const values = [
  { icon: Shield, title: "Gold Standard", description: "Every treatment follows globally recognized protocols backed by original research." },
  { icon: Heart, title: "Client First", description: "Your comfort, safety, and satisfaction are at the heart of everything we do." },
  { icon: Award, title: "Expert Team", description: "Internationally trained professionals with decades of combined experience." },
  { icon: Users, title: "Family Values", description: "We serve the whole family — from teens to seniors — with equal care and attention." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="About Us" description="Learn about Austin House Beauty & Spa — our story, values, expert team, and commitment to delivering Colombo's finest beauty and wellness experience." canonical="https://bright-living-clone.lovable.app/about" ogImage="https://bright-living-clone.lovable.app/og-about.jpg" breadcrumbs={[{ name: "Home", url: "https://bright-living-clone.lovable.app/" }, { name: "About Us", url: "https://bright-living-clone.lovable.app/about" }]} />
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pb-32 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src={contactExterior} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-dark-overlay" />
        <div className="relative container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm font-body mb-4">Our Story</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4">
              About <span className="text-gold-gradient">Austin House</span>
            </h1>
            <p className="text-cream/60 font-body text-lg max-w-2xl mx-auto">
              For over 15 years, we've been Sri Lanka's destination for gold-standard beauty treatments,
              transforming lives one client at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">Our Journey</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                From Humble Beginnings to <span className="text-gold-gradient">Gold Standard</span>
              </h2>
              <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
                <p>
                  Austin House Aesthetic Centre was founded in 2010 with a simple yet ambitious vision: 
                  to bring internationally recognized beauty standards to Sri Lanka. What started as a 
                  small clinic has blossomed into the country's premier aesthetic destination.
                </p>
                <p>
                  Our founder, Dr. Amaya Fernando, trained at leading institutions in London and Paris 
                  before returning home to establish a centre that combines cutting-edge technology with 
                  the warmth and care that defines Sri Lankan hospitality.
                </p>
                <p>
                  Today, we proudly serve over 5,000 clients annually, offering more than 50 specialized 
                  treatments — each one meticulously designed for safety, efficacy, and an unforgettable experience.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="rounded-lg overflow-hidden shadow-gold">
                <img src={aboutBg} alt="Austin House interior" className="w-full h-[450px] object-cover" loading="lazy" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-charcoal">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 15, suffix: "+", label: "Years Experience" },
              { value: 5000, suffix: "+", label: "Happy Clients" },
              { value: 50, suffix: "+", label: "Treatments" },
              { value: 12, suffix: "", label: "Expert Staff" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl md:text-4xl font-bold text-gold-gradient">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-cream/50 font-body text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">What We Stand For</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Our Core <span className="text-gold-gradient">Values</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center bg-card rounded-lg p-8 border border-border hover:shadow-gold transition-shadow duration-500"
              >
                <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-4">
                  <value.icon size={24} className="text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TeamSection />

      {/* CTA */}
      <section className="py-20 bg-charcoal">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
              Ready to Begin Your <span className="text-gold-gradient">Journey?</span>
            </h2>
            <p className="text-cream/60 font-body text-lg max-w-xl mx-auto mb-8">
              Visit us today and experience the Austin House difference for yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-10 py-4 bg-gold-gradient text-primary-foreground font-body font-bold tracking-wider uppercase text-sm rounded-sm shadow-gold hover:opacity-90 transition-opacity"
              >
                View Services
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

      <Footer />
    </div>
  );
};

export default About;

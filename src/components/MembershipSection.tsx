import { motion } from "framer-motion";
import { useState } from "react";

const MembershipSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your interest! We'll be in touch soon.");
    setFormData({ name: "", phone: "", email: "" });
  };

  return (
    <section id="membership" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">Membership</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Join Our <span className="text-gold-gradient">Exclusive Circle</span>
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed text-lg">
              Become a member of Austin House and unlock a world of exclusive benefits. Enjoy personalized access to premium treatments, special offers, priority booking, and members-only events. As a valued member, you'll be the first to experience the luxury and care we provide.
            </p>
            <div className="mt-8 space-y-4">
              {["Priority booking & exclusive discounts", "Personalized treatment plans", "Members-only events & launches", "Complimentary consultations"].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold-gradient flex-shrink-0" />
                  <p className="text-muted-foreground font-body">{benefit}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-card p-8 lg:p-10 rounded-lg shadow-gold">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">Sign Up Today</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="+94 XX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gold-gradient text-primary-foreground font-body font-bold tracking-wider uppercase text-sm rounded-sm shadow-gold hover:opacity-90 transition-opacity"
                >
                  Become a Member
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;

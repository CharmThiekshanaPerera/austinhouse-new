import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import { toast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

import contactExterior from "@/assets/contact-exterior.jpg";

const contactInfo = [
  { icon: MapPin, title: "Visit Us", lines: ["123 Galle Road", "Colombo 03, Sri Lanka"] },
  { icon: Phone, title: "Call Us", lines: ["+94 11 234 5678", "+94 77 123 4567"] },
  { icon: Mail, title: "Email Us", lines: ["info@austinhouse.lk", "bookings@austinhouse.lk"] },
  { icon: Clock, title: "Opening Hours", lines: ["Mon – Sat: 9:00 AM – 7:00 PM", "Sunday: 10:00 AM – 4:00 PM"] },
];

const Contact = () => {
  const { addContactMessage } = useData();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addContactMessage({ name: form.name, email: form.email, subject: form.subject, message: form.message });
      toast({
        title: "Message Sent! ✨",
        description: "Thank you for reaching out. We'll get back to you within 24 hours.",
      });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Contact" description="Get in touch with Austin House Beauty & Spa — visit us in Colombo, call, email, or send a message. We'd love to hear from you." canonical="https://bright-living-clone.lovable.app/contact" ogImage="https://bright-living-clone.lovable.app/og-contact.jpg" breadcrumbs={[{ name: "Home", url: "https://bright-living-clone.lovable.app/" }, { name: "Contact", url: "https://bright-living-clone.lovable.app/contact" }]} />
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={contactExterior} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-dark-overlay" />
        <div className="relative container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-gold uppercase tracking-[0.3em] text-sm font-body mb-4">Get In Touch</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4">
              Contact <span className="text-gold-gradient">Us</span>
            </h1>
            <p className="text-cream/60 font-body text-lg max-w-2xl mx-auto">
              Have questions or ready to book? Reach out to us — we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-card rounded-lg p-6 text-center border border-border hover:shadow-gold transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-4">
                  <info.icon size={20} className="text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{info.title}</h3>
                {info.lines.map((line) => (
                  <p key={line} className="text-muted-foreground font-body text-sm">{line}</p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                Send Us a <span className="text-gold-gradient">Message</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body text-muted-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-muted-foreground mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body text-muted-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="+94..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-muted-foreground mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Inquiry about..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gold-gradient text-primary-foreground font-body font-bold tracking-wider uppercase text-sm rounded-sm shadow-gold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-6"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Find <span className="text-gold-gradient">Us</span>
              </h2>
              <div className="flex-1 rounded-lg overflow-hidden shadow-gold border border-border min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9029751582974!2d79.8449853!3d6.9024186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25963c3640001%3A0xe5c1d58e8e190e4!2sColombo%2003%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  className="w-full h-full min-h-[400px]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Austin House Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;

import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, Twitter, Send } from "lucide-react";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Footer = () => {
  const { addNewsletterSubscriber } = useData();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      await addNewsletterSubscriber(email);
      toast({ title: "Subscribed!", description: "Thank you for joining our newsletter." });
      setEmail("");
    } catch (error) {
      toast({ title: "Subscription Failed", description: "You might already be subscribed.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="contact" className="bg-charcoal border-t border-gold/10">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        
        {/* Newsletter Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 mb-12 border-b border-gold/10">
          <div className="text-center md:text-left">
            <h3 className="font-display text-2xl text-cream mb-2">Subscribe to our Newsletter</h3>
            <p className="font-body text-cream/50 text-sm">Stay updated with our latest treatments, offers, and aesthetic tips.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md gap-2">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/20 border-gold/30 text-cream placeholder:text-cream/30 focus-visible:ring-gold"
              required
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gold-gradient text-primary-foreground font-body font-bold"
            >
              {loading ? "..." : <><Send size={16} className="mr-2" /> Subscribe</>}
            </Button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Austin House logo" className="w-12 h-12 rounded-sm object-cover" />
              <div>
                <h3 className="font-display text-xl font-bold text-gold-gradient leading-tight">Austin House</h3>
                <p className="text-gold-light text-[10px] tracking-[0.2em] uppercase -mt-0.5">Aesthetic Centre</p>
              </div>
            </div>
            <p className="text-cream/50 font-body text-sm italic mb-4">The house of beauty & bliss</p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/austinhouse_aestheticcentre/" },
                { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/austincolombo7" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 hover:border-gold/60 transition-all"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-cream mb-4">Quick Links</h4>
            <div className="space-y-3">
              {[
                { label: "Home", to: "/" },
                { label: "About", to: "/about" },
                { label: "Services", to: "/services" },
                { label: "Products", to: "/products" },
                { label: "Gallery", to: "/gallery" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <Link key={link.label} to={link.to} className="block text-cream/50 hover:text-gold transition-colors font-body text-sm">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-cream mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gold mt-1 flex-shrink-0" />
                <p className="text-cream/50 font-body text-sm">No 22, Austin Place, Colombo 08, Sri Lanka</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <a href="tel:+94112196386" className="text-cream/50 hover:text-gold transition-colors font-body text-sm">+94 112196386</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <a href="mailto:info@austinhouse.lk" className="text-cream/50 hover:text-gold transition-colors font-body text-sm">info@austinhouse.lk</a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-cream mb-4">Hours</h4>
            <div className="space-y-2 text-cream/50 font-body text-sm">
              <p>Monday – Sunday</p>
              <p>10:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 font-body text-sm">
            © {new Date().getFullYear()} Austin House Aesthetic Centre. All rights reserved.
          </p>
          <div className="flex gap-6 text-cream/30 font-body text-xs">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, Twitter } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer id="contact" className="bg-charcoal border-t border-gold/10">
      <div className="container mx-auto px-4 lg:px-8 py-16">
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
                { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
                { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
                { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
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
                <p className="text-cream/50 font-body text-sm">123 Galle Road, Colombo 03, Sri Lanka</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <p className="text-cream/50 font-body text-sm">+94 11 234 5678</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <p className="text-cream/50 font-body text-sm">info@austinhouse.lk</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-cream mb-4">Hours</h4>
            <div className="space-y-2 text-cream/50 font-body text-sm">
              <p>Mon – Fri: 9:00 AM – 7:00 PM</p>
              <p>Saturday: 9:00 AM – 5:00 PM</p>
              <p>Sunday: 10:00 AM – 4:00 PM</p>
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

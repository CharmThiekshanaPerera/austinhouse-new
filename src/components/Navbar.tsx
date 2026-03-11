import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, Instagram, Facebook, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Products", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const servicesMenu = [
  { label: "Facials", href: "/services/facials" },
  { label: "Chemical Peels", href: "/services/chemical-peels" },
  { label: "Waxing Treatments", href: "/services/waxing" },
  { label: "Specialized Procedures", href: "/services/specialized" },
  { label: "Anti-aging Skin Tightening Treatments", href: "/services/anti-aging" },
  { label: "Intimate Area Services", href: "/services/intimate" },
  { label: "Wart Removal", href: "/services/wart-removal" },
  { label: "Micro-Dermabrasion", href: "/services/micro-dermabrasion" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/90 backdrop-blur-md">
      {/* Top bar with social icons and announcement */}
      <div className="bg-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between py-1.5">
          <div className="hidden sm:flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
              <Instagram size={14} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
              <Facebook size={14} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="TikTok">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          </div>
          <p className="text-sm font-body tracking-wide text-center flex-1">
            Begin your radiant journey with us — discover gold standard beauty care!
          </p>
          <div className="hidden sm:block w-[70px]" />
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Austin House logo" className="w-10 h-10 lg:w-12 lg:h-12 rounded-sm object-cover" />
            <div className="flex flex-col">
              <span className="font-display text-xl lg:text-2xl font-bold text-gold-gradient leading-tight">
                Austin House
              </span>
              <span className="text-[10px] text-gold-light tracking-[0.2em] -mt-0.5">
                AESTHETIC CENTRE
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <Link
                  to={link.href}
                  className="flex items-center gap-1 text-cream/80 hover:text-gold transition-colors text-sm tracking-wider uppercase font-body py-2"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                </Link>

                {link.hasDropdown && (
                  <div className="absolute top-full -left-4 pt-2 hidden group-hover:block w-72">
                    <div className="bg-[#002B4B] rounded-md shadow-2xl py-3 overflow-hidden border border-gold/10">
                      {servicesMenu.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="block px-6 py-2.5 text-[15px] font-body text-white hover:bg-gold/10 hover:text-gold-light transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button className="text-cream/60 hover:text-gold transition-colors" aria-label="Search">
              <Search size={18} />
            </button>
          </div>

          <button
            className="lg:hidden text-cream"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-charcoal/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <div key={link.label} className="flex flex-col">
                  <Link
                    to={link.href}
                    onClick={() => !link.hasDropdown && setIsOpen(false)}
                    className="flex justify-between items-center text-cream/80 hover:text-gold transition-colors text-base tracking-wider uppercase font-body py-2 border-b border-gold/10"
                  >
                    {link.label}
                  </Link>
                  {link.hasDropdown && (
                    <div className="flex flex-col pl-4 mt-2 border-l-2 border-gold/20 space-y-2">
                      {servicesMenu.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className="text-cream/70 hover:text-gold transition-colors text-sm font-body py-1.5"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-4 pt-2">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

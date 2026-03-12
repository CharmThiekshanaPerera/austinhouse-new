import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, Instagram, Facebook, ChevronDown, ArrowRight, Phone, Mail } from "lucide-react";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const allSearchableItems = [
    ...navLinks.map(l => ({ title: l.label, href: l.href, category: "Page" })),
    ...servicesMenu.map(s => ({ title: s.label, href: s.href, category: "Service" }))
  ];

  const filteredResults = searchQuery.trim() === "" 
    ? [] 
    : allSearchableItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/90 backdrop-blur-md">
      {/* Top bar with social icons and announcement */}
      <div className="bg-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between py-1.5 gap-2 sm:gap-0">
          <div className="flex items-center gap-4 text-xs font-body">
            <div className="flex items-center gap-3 border-r border-white/20 pr-4 mr-1">
              <a href="https://www.instagram.com/austinhouse_aestheticcentre/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram size={14} />
              </a>
              <a href="https://www.facebook.com/austincolombo7" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Facebook">
                <Facebook size={14} />
              </a>
            </div>
            <a href="tel:+94112196386" className="flex items-center gap-1.5 hover:text-gold transition-colors">
              <Phone size={12} className="text-gold" />
              <span>+94 112196386</span>
            </a>
            <a href="mailto:info@austinhouse.lk" className="hidden md:flex items-center gap-1.5 hover:text-gold transition-colors">
              <Mail size={12} className="text-gold" />
              <span>info@austinhouse.lk</span>
            </a>
          </div>
          <p className="text-[11px] sm:text-xs font-body tracking-wide text-center sm:text-right opacity-90">
            Begin your radiant journey with us — gold standard beauty care!
          </p>
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
                    <div className="bg-[#0A1A2F] rounded-md shadow-2xl py-3 overflow-hidden border border-gold/10">
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
            <button 
              className="text-cream/60 hover:text-gold transition-colors" 
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            <button 
              className="text-cream/80 hover:text-gold transition-colors" 
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} />
            </button>
            <button
              className="text-cream"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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
                <a href="https://www.instagram.com/austinhouse_aestheticcentre/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://www.facebook.com/austincolombo7" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-xl flex flex-col items-center pt-20 px-6"
          >
            <button 
              className="absolute top-8 right-8 text-cream/60 hover:text-gold transition-colors"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
            >
              <X size={32} />
            </button>
            
            <div className="w-full max-w-2xl">
              <div className="relative border-b-2 border-gold/30 focus-within:border-gold transition-colors pb-4 mb-12">
                <Search size={24} className="absolute left-0 top-1 text-gold/50" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent border-none outline-none text-2xl md:text-4xl font-display text-white pl-10 placeholder:text-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                {searchQuery.trim() !== "" && filteredResults.length > 0 ? (
                  <div className="grid gap-2">
                    {filteredResults.map((result, idx) => (
                      <Link
                        key={`${result.href}-${idx}`}
                        to={result.href}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-gold/10 border border-white/5 hover:border-gold/20 transition-all"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-widest text-gold/60 mb-1">{result.category}</span>
                          <span className="text-lg text-cream group-hover:text-gold transition-colors">{result.title}</span>
                        </div>
                        <ArrowRight size={20} className="text-gold opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.trim() !== "" ? (
                  <p className="text-center text-cream/40 font-body py-10">No matches found for "{searchQuery}"</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 opacity-40">
                    <p className="col-span-full text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Suggested Searches</p>
                    {["Facials", "Peels", "Anti-aging", "Waxing"].map(suggest => (
                      <button 
                        key={suggest}
                        onClick={() => setSearchQuery(suggest)}
                        className="text-left px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-cream transition-colors"
                      >
                        {suggest}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

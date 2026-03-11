import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import { createPortal } from "react-dom";

export interface ServiceData {
  id: string;
  title: string;
  duration: string;
  price: string;
  description: string;
  image?: string;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceData | null;
}

const ServiceModal = ({ isOpen, onClose, service }: ServiceModalProps) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && service && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 text-left">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/90 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-background rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-8 h-8 sm:w-10 sm:h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 h-48 sm:h-56 md:h-auto shrink-0 relative">
              <div className="absolute inset-0 bg-charcoal/10 z-10" />
              <img
                src={service?.image || "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80"}
                alt={service?.title}
                className="w-full h-full object-cover relative z-0"
              />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col flex-1 min-h-0 overflow-y-auto bg-white">
              <span className="text-gold tracking-[0.2em] uppercase text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 block shrink-0">
                Treatment Details
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#002B4B] font-bold mb-4 sm:mb-6 leading-tight shrink-0">
                {service?.title}
              </h2>
              
              <div className="prose prose-sm md:prose-base text-muted-foreground mb-6 sm:mb-8 shrink-0">
                <p className="leading-relaxed text-sm sm:text-base">{service?.description}</p>
              </div>

              <div className="mt-auto pt-5 sm:pt-8 border-t border-border shrink-0">
                <div className="flex flex-row items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div>
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Duration</p>
                    <div className="flex items-center gap-1.5 text-foreground font-medium text-sm sm:text-base">
                      <Clock size={16} className="text-gold w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{service?.duration}</span>
                    </div>
                  </div>
                  <div className="w-px h-8 sm:h-10 bg-border" />
                  <div className="text-right sm:text-left">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Investment</p>
                    <p className="text-base sm:text-xl font-display font-bold text-foreground">
                      {service?.price.includes("LKR") ? service?.price : `LKR ${service?.price}`}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/contact?service=${service?.id}`}
                  onClick={onClose}
                  className="w-full h-12 sm:h-14 bg-[#D4AF37] hover:bg-[#b5952f] text-white flex items-center justify-center gap-2 rounded-md font-bold tracking-wide transition-colors shadow-md shadow-gold/20 uppercase text-xs sm:text-sm"
                >
                  Book This Treatment <ArrowRight size={16} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ServiceModal;

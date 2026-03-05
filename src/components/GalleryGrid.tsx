import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

import galleryMassage from "@/assets/gallery-massage.jpg";
import facialBefore from "@/assets/gallery-facial-before.jpg";
import facialAfter from "@/assets/gallery-facial-after.jpg";
import nailsAfter from "@/assets/gallery-nails-after.jpg";
import peelAfter from "@/assets/gallery-peel-after.jpg";
import slideshowReception from "@/assets/slideshow-reception.jpg";
import slideshowLounge from "@/assets/slideshow-lounge.jpg";
import slideshowProducts from "@/assets/slideshow-products.jpg";
import slideshowTreatment from "@/assets/slideshow-treatment.jpg";
import spaEnvironment from "@/assets/spa-environment.jpg";
import contactExterior from "@/assets/contact-exterior.jpg";
import aboutBg from "@/assets/about-bg.jpg";

const images = [
  { src: slideshowReception, alt: "Grand reception", category: "Environment" },
  { src: facialAfter, alt: "Facial result", category: "Results" },
  { src: galleryMassage, alt: "Hot stone massage", category: "Treatments" },
  { src: slideshowProducts, alt: "Product range", category: "Products" },
  { src: nailsAfter, alt: "Nail art", category: "Results" },
  { src: slideshowLounge, alt: "Spa lounge", category: "Environment" },
  { src: slideshowTreatment, alt: "Treatment room", category: "Environment" },
  { src: peelAfter, alt: "Chemical peel result", category: "Results" },
  { src: spaEnvironment, alt: "Spa atmosphere", category: "Environment" },
  { src: contactExterior, alt: "Exterior view", category: "Environment" },
  { src: aboutBg, alt: "Premium treatment", category: "Treatments" },
  { src: facialBefore, alt: "Before treatment", category: "Results" },
];

const categories = ["All", "Environment", "Treatments", "Results", "Products"];

const GalleryGrid = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filtered = activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory);

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            Photo <span className="text-gold-gradient">Gallery</span>
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-body text-sm tracking-wider transition-all ${
                  activeCategory === cat
                    ? "bg-gold-gradient text-primary-foreground shadow-gold"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((img, index) => (
            <motion.div
              key={img.src + img.alt}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="break-inside-avoid cursor-pointer group"
              onClick={() => setSelectedImage(img.src)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-cream font-body text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-cream hover:text-gold transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={selectedImage}
            alt="Gallery preview"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default GalleryGrid;

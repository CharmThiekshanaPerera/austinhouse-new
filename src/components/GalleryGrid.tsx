import { motion } from "framer-motion";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useData, GalleryImage } from "@/contexts/DataContext";

const categories = ["All", "Environment", "Treatments", "Results", "Products"];

const GalleryGrid = () => {
  const { galleryImages, galleryLoading } = useData();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<GalleryImage | null>(null);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const filtered = activeCategory === "All" ? galleryImages : galleryImages.filter((img) => img.category === activeCategory);

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
                className={`px-5 py-2 rounded-full font-body text-sm tracking-wider transition-all ${activeCategory === cat
                  ? "bg-gold-gradient text-primary-foreground shadow-gold"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {galleryLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-gold" size={48} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-body">
            No images found in this category.
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((img, index) => {
              const isVideo = img.type === "video";
              const ytId = isVideo ? getYoutubeId(img.image) : null;
              const displayImage = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : img.image;

              return (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="break-inside-avoid cursor-pointer group"
                  onClick={() => setSelectedItem(img)}
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={displayImage}
                      alt={img.alt}
                      className="w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-300 flex items-center justify-center">
                      <div className="text-center">
                        {isVideo && <div className="w-12 h-12 rounded-full bg-gold/80 flex items-center justify-center text-white mb-2 mx-auto"><X className="rotate-45" size={24} /></div>}
                        <span className="text-cream font-body text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                          {img.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            className="absolute top-6 right-6 text-cream hover:text-gold transition-colors"
            onClick={() => setSelectedItem(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          
          <div className="w-full max-w-5xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
            {selectedItem.type === "video" ? (
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${getYoutubeId(selectedItem.image)}?autoplay=1`}
                  title={selectedItem.alt}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={selectedItem.image}
                alt={selectedItem.alt}
                className="max-w-full max-h-[85vh] mx-auto object-contain rounded-lg"
              />
            )}
            <div className="absolute -bottom-10 left-0 right-0 text-center text-cream font-body text-sm tracking-widest uppercase">
              {selectedItem.alt}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GalleryGrid;

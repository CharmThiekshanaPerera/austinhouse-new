import { motion } from "framer-motion";

const brands = [
  { name: "Dermalogica", style: "font-serif italic" },
  { name: "Obagi", style: "font-sans tracking-[0.4em] uppercase text-base" },
  { name: "SkinCeuticals", style: "font-serif font-light tracking-wider" },
  { name: "iS Clinical", style: "font-sans font-bold tracking-[0.2em] uppercase text-base" },
  { name: "Environ", style: "font-sans tracking-[0.5em] uppercase text-base" },
  { name: "Depilève", style: "font-serif italic font-light" },
  { name: "Medik8", style: "font-mono font-bold tracking-wider uppercase text-base" },
  { name: "ZO Skin Health", style: "font-sans font-light tracking-[0.3em] uppercase text-base" },
  { name: "Heliocare", style: "font-serif tracking-wider" },
  { name: "La Roche-Posay", style: "font-sans font-light italic tracking-wide" },
];

const BrandSlider = () => {
  return (
    <section className="py-14 bg-background overflow-hidden border-y border-border">
      <div className="container mx-auto px-4 lg:px-8 mb-8 text-center">
        <p className="text-muted-foreground font-body text-sm uppercase tracking-[0.3em]">
          Trusted by the brands you love
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <motion.div
          className="flex gap-16 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={`${brand.name}-${i}`}
              className={`text-xl md:text-2xl text-muted-foreground/50 hover:text-primary transition-colors duration-300 select-none flex-shrink-0 ${brand.style}`}
            >
              {brand.name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandSlider;

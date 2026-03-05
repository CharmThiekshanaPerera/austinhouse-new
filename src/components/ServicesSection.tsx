import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LazyImage from "@/components/LazyImage";
import facialImg from "@/assets/facial-treatment.jpg";
import spaImg from "@/assets/spa-environment.jpg";
import productsImg from "@/assets/products.jpg";

const services = [
  {
    image: facialImg,
    title: "Professional Skin Assessment",
    description: "Expert analysis of your unique skin profile, followed by customized treatments that restore your natural radiance.",
    link: "Treatments",
    to: "/services",
  },
  {
    image: spaImg,
    title: "Immersive Spa Experience",
    description: "Sweet fragrances, ambient lighting, soft melodies, and a unique healing touch guide you through an unforgettable journey.",
    link: "Services",
    to: "/services",
  },
  {
    image: productsImg,
    title: "Premium Aftercare Range",
    description: "Maintain your restored confidence with our curated collection of gold-standard aftercare products designed for lasting results.",
    link: "Products",
    to: "/products",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">What We Offer</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Our Beauty Essentials & <span className="text-gold-gradient">Treatments</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-gold transition-shadow duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <LazyImage
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  skeletonClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-dark-overlay-light opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">{service.description}</p>
                <Link
                  to={service.to}
                  className="inline-flex items-center text-primary font-body text-sm font-bold uppercase tracking-wider hover:text-gold-light transition-colors"
                >
                  {service.link} →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

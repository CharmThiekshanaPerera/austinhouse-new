import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LazyImage from "@/components/LazyImage";
import { useData } from "@/contexts/DataContext";

const ServiceCardSkeleton = () => (
  <div className="bg-card rounded-lg overflow-hidden shadow-lg flex flex-col animate-pulse">
    <div className="h-64 bg-muted" />
    <div className="p-6 flex flex-col gap-3 flex-1">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-full" />
      <div className="h-3 bg-muted rounded w-5/6" />
      <div className="h-3 bg-muted rounded w-1/3 mt-auto" />
    </div>
  </div>
);

const ServicesSection = () => {
  const { services, servicesLoading } = useData();
  const featuredServices = services.slice(0, 3);

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

        {servicesLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : featuredServices.length === 0 ? (
          <div className="text-center text-muted-foreground font-body">
            No featured services added yet. Check back soon!
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-gold transition-shadow duration-500 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <LazyImage
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    skeletonClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-dark-overlay-light opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{service.description}</p>
                  <Link
                    to="/services"
                    className="inline-flex items-center text-primary font-body text-sm font-bold uppercase tracking-wider hover:text-gold-light transition-colors mt-auto"
                  >
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Star, CheckCircle } from "lucide-react";
import { useState } from "react";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import { useData } from "@/contexts/DataContext";

const ServiceRowSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-10 items-center animate-pulse">
    <div className="rounded-lg h-[300px] lg:h-[400px] bg-muted" />
    <div className="space-y-4">
      <div className="h-3 bg-muted rounded w-1/4" />
      <div className="h-7 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-5/6" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => <div key={i} className="h-3 bg-muted rounded" />)}
      </div>
      <div className="flex gap-4 mt-2">
        <div className="h-8 bg-muted rounded w-24" />
        <div className="h-8 bg-muted rounded w-32" />
      </div>
    </div>
  </div>
);

const Services = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const { services, servicesLoading } = useData();

  const handleBookNow = (title: string) => {
    setSelectedService(title);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Services"
        description="Explore our premium beauty services — facials, laser hair removal, manicures, waxing, microdermabrasion & massage therapy at Austin House, Colombo."
        canonical="https://bright-living-clone.lovable.app/services"
        ogImage="https://bright-living-clone.lovable.app/og-services.jpg"
        breadcrumbs={[
          { name: "Home", url: "https://bright-living-clone.lovable.app/" },
          { name: "Services", url: "https://bright-living-clone.lovable.app/services" },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Austin House Beauty & Spa Services",
          itemListElement: services.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: s.title,
              description: s.description,
              image: s.image,
              provider: {
                "@type": "LocalBusiness",
                name: "Austin House Beauty & Spa",
              },
              offers: {
                "@type": "Offer",
                price: s.price.replace(/[^0-9.]/g, ""),
                priceCurrency: "LKR",
              },
            },
          })),
        }}
      />
      {/* Hero Banner */}
      <section className="pt-32 pb-16 bg-charcoal">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm font-body mb-4">What We Offer</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4">
              Our <span className="text-gold-gradient">Services</span>
            </h1>
            <p className="text-cream/60 font-body text-lg max-w-2xl mx-auto">
              Every treatment is a journey — meticulously crafted by experts using gold-standard protocols and the finest products from around the world.
            </p>
            <div className="mt-4">
              <Link to="/" className="text-gold hover:text-gold-light font-body text-sm transition-colors">
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-16">
            {servicesLoading ? (
              [...Array(3)].map((_, i) => <ServiceRowSkeleton key={i} />)
            ) : (
              services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="grid lg:grid-cols-2 gap-10 items-center"
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="rounded-lg overflow-hidden shadow-gold">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-[300px] lg:h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-gold">
                        <Star size={16} fill="currentColor" />
                        <span className="font-body text-sm font-bold">{service.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock size={14} />
                        <span className="font-body text-sm">{service.duration}</span>
                      </div>
                    </div>

                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                      {service.title}
                    </h2>

                    <p className="text-muted-foreground font-body leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {service.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-gold mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-body text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-6">
                      <p className="font-display text-2xl font-bold text-gold-gradient">{service.price}</p>
                      <button
                        onClick={() => handleBookNow(service.title)}
                        className="px-8 py-3 bg-gold-gradient text-primary-foreground font-body font-bold text-sm uppercase tracking-wider rounded-sm shadow-gold hover:opacity-90 transition-opacity"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
              Not Sure Which Treatment Is <span className="text-gold-gradient">Right For You?</span>
            </h2>
            <p className="text-cream/60 font-body text-lg max-w-xl mx-auto mb-8">
              Book a complimentary consultation with our experts. We'll assess your needs and recommend a personalized treatment plan.
            </p>
            <button
              onClick={() => { setSelectedService(""); setBookingOpen(true); }}
              className="inline-flex items-center justify-center px-10 py-4 bg-gold-gradient text-primary-foreground font-body font-bold tracking-wider uppercase text-sm rounded-sm shadow-gold hover:opacity-90 transition-opacity"
            >
              Book Free Consultation
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />

      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        preselectedService={selectedService}
      />
      <WhatsAppButton />
    </div>
  );
};

export default Services;

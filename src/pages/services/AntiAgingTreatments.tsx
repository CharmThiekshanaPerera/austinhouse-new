import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import CTABanner from "@/components/CTABanner";
import SEO from "@/components/SEO";
import OtherServices from "@/components/OtherServices";
import { Link } from "react-router-dom";
import { Clock, Info, ArrowRight } from "lucide-react";
import ServiceModal, { ServiceData } from "@/components/ServiceModal";
import { useData } from "@/contexts/DataContext";
import BookingModal from "@/components/BookingModal";

const AntiAgingTreatments = () => {
    const { services } = useData();
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingServiceTitle, setBookingServiceTitle] = useState("");
    const pageServices = services.filter(s => s.category === "Anti-aging Skin Tightening Treatments");
    const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-background font-body">
            <SEO
                title="Anti-Aging Skin Tightening"
                description="Turn back time with our advanced anti-aging and skin tightening treatments at Austin House. Non-surgical lifting and firming to restore your skin's natural elasticity."
                keywords="anti-aging colombo, skin tightening sri lanka, non-surgical facelift, collagen induction, Austin House anti-aging"
                canonical="https://bright-living-clone.lovable.app/services/anti-aging"
                breadcrumbs={[
                    { name: "Home", url: "https://bright-living-clone.lovable.app/" },
                    { name: "Services", url: "https://bright-living-clone.lovable.app/services" },
                    { name: "Anti-Aging", url: "https://bright-living-clone.lovable.app/services/anti-aging" },
                ]}
                jsonLd={pageServices.map(service => ({
                    "@context": "https://schema.org",
                    "@type": "Service",
                    name: service.title,
                    description: service.description,
                    provider: {
                        "@type": "LocalBusiness",
                        name: "Austin House Beauty & Spa"
                    },
                    offers: {
                        "@type": "Offer",
                        price: service.price.replace(/[^\d]/g, ""),
                        priceCurrency: "LKR"
                    }
                }))}
            />

            <Navbar />

            <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-charcoal/60 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
                    <img
                        src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80"
                        alt="Anti-Aging"
                        className="w-full h-full object-cover"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-30 container mx-auto px-4 text-center mt-20"
                >
                    <span className="text-gold tracking-[0.3em] uppercase text-sm font-semibold mb-4 block">
                        Youthful Radiance
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        Anti-Aging & <br /> Tightening
                    </h1>
                    <p className="text-white/80 font-light text-lg max-w-2xl mx-auto">
                        Non-surgical lifting and firming treatments to restore your skin's natural elasticity.
                    </p>
                </motion.div>
            </section>

            <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 lg:px-8 max-w-5xl relative z-10">
                    <div className="mb-16 text-center">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Our Anti-Aging <span className="text-gold-gradient">Solutions</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Turn back time with our curated selection of skin tightening and age-defying treatments designed to restore your youthful glow.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {pageServices.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group relative bg-white border border-border/60 hover:border-gold/30 rounded-2xl p-6 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                                    <div className="flex-1">
                                        <h3 className="font-display text-2xl text-[#002B4B] font-bold mb-3 group-hover:text-primary transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">
                                            {service.description}
                                        </p>
                                        <button 
                                            onClick={() => {
                                                setSelectedService(service);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-primary font-bold text-sm hover:text-gold flex items-center gap-1 transition-colors uppercase tracking-wider"
                                        >
                                            Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>

                                    <div className="w-full md:w-[320px] shrink-0 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-10 flex flex-col justify-center">
                                        <div className="flex items-center gap-6 mb-6">
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Duration</p>
                                                <div className="flex items-center gap-1.5 text-foreground font-medium">
                                                    <Clock size={16} className="text-gold" />
                                                    <span>{service.duration}</span>
                                                </div>
                                            </div>
                                            <div className="w-px h-10 bg-border" />
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Investment</p>
                                                <p className="text-lg font-display font-bold text-foreground">
                                                    {service.price}
                                                </p>
                                            </div>
                                        </div>

                                        <button onClick={() => { setBookingServiceTitle(service.title); setIsBookingModalOpen(true); }} className="w-full h-12 bg-[#D4AF37] hover:bg-[#b5952f] text-white flex items-center justify-center rounded-md font-semibold tracking-wide transition-colors shadow-md shadow-gold/20">Book Now</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

      {/* Benefits Split Section */}
      <section className="py-0 bg-charcoal text-white">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center">
            <span className="text-gold uppercase tracking-[0.2em] text-sm font-semibold mb-4">Why Choose Us</span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold mb-8">
              Premium Care & <br/> Expert Precision
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-10">
              Unlike ordinary treatments, we employ advanced aesthetic techniques and clinical-grade formulations to ensure you experience superior results with maximum comfort.
            </p>
            <ul className="space-y-4">
               {[
                 "FDA-approved, premium grade products",
                 "Customized treatment plans for your skin type",
                 "Expert aftercare and recovery guidance",
                 "Unmatched relaxation during the procedure"
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-white/90">
                   <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0">
                     <Info size={12} />
                   </div>
                   {item}
                 </li>
               ))}
            </ul>
          </div>
          <div className="w-full lg:w-1/2 h-[500px] lg:h-auto min-h-[500px] relative">
            <iframe 
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/LXb3EKWsInQ?mute=1&autoplay=1&loop=1&playlist=LXb3EKWsInQ" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </section>

      <OtherServices currentPath="/services/anti-aging" />
      <CTABanner />
            <Footer />


            <ServiceModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={selectedService}
                onBookNow={(title) => {
                    setIsModalOpen(false);
                    setBookingServiceTitle(title);
                    setIsBookingModalOpen(true);
                }}
            />
            <BookingModal
                open={isBookingModalOpen}
                onOpenChange={setIsBookingModalOpen}
                preselectedService={bookingServiceTitle}
            />
        </div>
    );
};

export default AntiAgingTreatments;

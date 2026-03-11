import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import CTABanner from "@/components/CTABanner";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Info } from "lucide-react";
import LazyImage from "@/components/LazyImage";
import OtherServices from "@/components/OtherServices";
import ServiceModal, { ServiceData } from "@/components/ServiceModal";
import { useData } from "@/contexts/DataContext";
import BookingModal from "@/components/BookingModal";

const ChemicalPeels = () => {
    const { services } = useData();
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingServiceTitle, setBookingServiceTitle] = useState("");
    const pageServices = services.filter(s => s.category === "Chemical Peels");
    const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-background font-body">
            <SEO
                title="Chemical Peels - Face & Body"
                description="Rejuvenate your skin with our premium fractional cell, sensitive medical, and body peels at Austin House Aesthetic Centre."
            />

            <Navbar />

            {/* Hero Video Section */}
            <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-charcoal/70 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
                    <img
                        src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80"
                        alt="Chemical Peels"
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
                        Premium Services
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        Rejuvenating Peels <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDF3A7] to-gold">
                            Face & Body
                        </span>
                    </h1>
                    <p className="text-white/80 font-light text-lg max-w-2xl mx-auto">
                        Advanced medical-grade treatments carefully formulated for deep renewal,
                        pigmentation correction, and supreme skin health.
                    </p>
                </motion.div>
            </section>

            {/* Peels Listing Section */}
            <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 lg:px-8 max-w-5xl relative z-10">
                    <div className="mb-16 text-center">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Our Peel <span className="text-gold-gradient">Collection</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Choose from our curated selection of high-performance chemical peels designed to deliver transformative results with minimal downtime.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {pageServices.map((peel, index) => (
                            <motion.div
                                key={peel.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group relative bg-white border border-border/60 hover:border-gold/30 rounded-2xl p-6 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                            >
                                {/* Subtle gradient hover background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                                    <div className="flex-1">
                                        <h3 className="font-display text-2xl text-[#002B4B] font-bold mb-3 group-hover:text-primary transition-colors">
                                            {peel.title}
                                        </h3>
                                        <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">
                                            {peel.description}
                                        </p>
                                        <button 
                                            onClick={() => {
                                                setSelectedService(peel);
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
                                                    <span>{peel.duration}</span>
                                                </div>
                                            </div>
                                            <div className="w-px h-10 bg-border" />
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Investment</p>
                                                <p className="text-lg font-display font-bold text-foreground">
                                                    LKR {peel.price}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/contact?service=${peel.id}`}
                                            className="w-full h-12 bg-[#D4AF37] hover:bg-[#b5952f] text-white flex items-center justify-center rounded-md font-semibold tracking-wide transition-colors shadow-md shadow-gold/20"
                                        >
                                            Get the Service
                                        </Link>
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
                            Medical Grade Purity <br /> & Safety
                        </h2>
                        <p className="text-white/70 text-lg leading-relaxed mb-10">
                            Unlike ordinary physical exfoliators, our chemical peels sink deep into the epidermis to promote cellular turnover from within.
                            Our expert aestheticians carefully analyze your skin to dispense the optimal acid concentration,
                            ensuring maximum radiance with minimal downtime.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "FDA-approved, premium grade solutions",
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

      <OtherServices currentPath="/services/chemical-peels" />
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

export default ChemicalPeels;

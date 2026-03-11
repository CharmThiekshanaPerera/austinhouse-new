import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTABanner from "@/components/CTABanner";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Clock, Info } from "lucide-react";

const servicesData = [
    {
        id: "diamond-micro",
        title: "Diamond Micro-Dermabrasion",
        duration: "1 hr",
        price: "15,000.00/=",
        description: "An exceptional exfoliating treatment using a diamond-tipped wand to gently sand away the thick outer layer of the skin. Rejuvenates sun-damaged skin, reduces acne scars, and evens out skin tone.",
    },
    {
        id: "crystal-micro",
        title: "Crystal Micro-Dermabrasion",
        duration: "1 hr",
        price: "12,000.00/=",
        description: "Utilizes ultra-fine crystals to blast away dead skin cells. Excellent for deep exfoliation, unclogging pores, and preparing the skin for maximum serum absorption.",
    }
];

const MicroDermabrasion = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-background font-body">
            <SEO
                title="Micro-Dermabrasion"
                description="Premium skin resurfacing and exfoliation."
            />

            <Navbar />

            <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-charcoal/60 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
                    <img
                        src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80"
                        alt="Skin Resurfacing"
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
                        Skin Resurfacing
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        Micro-Dermabrasion
                    </h1>
                    <p className="text-white/80 font-light text-lg max-w-2xl mx-auto">
                        Reveal fresh, glowing, youthful skin by removing dead surface cells.
                    </p>
                </motion.div>
            </section>

            <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
                <div className="container mx-auto px-4 lg:px-8 max-w-5xl relative z-10">
                    <div className="space-y-12">
                        {servicesData.map((service, index) => (
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

                                        <Link
                                            to={`/contact?service=${service.id}`}
                                            className="w-full h-12 bg-[#D4AF37] hover:bg-[#b5952f] text-white flex items-center justify-center rounded-md font-semibold tracking-wide transition-colors shadow-md shadow-gold/20"
                                        >
                                            Book Now
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

      <CTABanner />
            <Footer />
            <WhatsAppButton />
        </div>
    );
};

export default MicroDermabrasion;

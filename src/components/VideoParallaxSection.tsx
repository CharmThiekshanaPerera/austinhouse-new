import { useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, Star, Award, ShieldCheck } from "lucide-react";
import backgroundImage from "@/assets/gold-standard-bg.png";

const features = [
    { icon: Star, text: "5-Star Excellence" },
    { icon: Award, text: "Award-Winning Staff" },
    { icon: ShieldCheck, text: "Premium Safety Standards" },
];

const VideoParallaxSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Parallax effect: moves the content slightly slower than the scroll
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <section
            ref={containerRef}
            className="relative h-[90vh] min-h-[700px] w-full overflow-hidden flex items-center justify-center bg-charcoal"
        >
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={backgroundImage} 
                    alt="Luxury Spa Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal/40 z-10" />
            </div>

            {/* Parallax Video Overlay Layer */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 w-full h-[120%] z-10 opacity-30 mix-blend-screen"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source
                        src="https://player.vimeo.com/external/498305001.sd.mp4?s=d0db586c91350a8ceca9fd8ebd598ff7b7bbcb17&profile_id=164&oauth2_token_id=57447761"
                        type="video/mp4"
                    />
                </video>
            </motion.div>

            {/* Final darkening gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/60 z-20" />


            {/* Content Overlay */}
            <div className="container relative z-30 mx-auto px-4 lg:px-8 flex flex-col items-center justify-center min-h-screen pt-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2,
                                delayChildren: 0.3
                            }
                        }
                    }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <motion.p 
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="text-gold uppercase tracking-[0.4em] text-sm md:text-base font-body font-semibold mb-6"
                    >
                        The Gold Standard
                    </motion.p>
                    
                    <motion.h2 
                        variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: { opacity: 1, scale: 1 }
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-display text-4xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-8"
                    >
                        Where Beauty Meets <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#FDF3A7] to-gold drop-shadow-sm">
                            Tranquility
                        </span>
                    </motion.h2>

                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12"
                    >
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-white/90 group cursor-default">
                                <feature.icon size={18} className="text-gold group-hover:scale-125 transition-transform" />
                                <span className="font-body text-xs md:text-sm uppercase tracking-widest font-medium border-b border-transparent group-hover:border-gold/50 transition-all pb-1">
                                    {feature.text}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                    
                    <motion.p 
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1 }
                        }}
                        className="font-body text-white/80 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed mb-12 italic"
                    >
                        "Immerse yourself in Colombo's most exclusive sanctuary.
                        Experience treatments designed not just to enhance your appearance,
                        but to restore your inner balance."
                    </motion.p>

                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="flex items-center justify-center gap-6"
                    >
                        <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-gold/50" />
                        <div className="flex gap-6">
                            <a 
                                href="https://www.instagram.com/austinhouse_aestheticcentre/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 hover:border-gold hover:scale-110 transition-all bg-white/5 backdrop-blur-sm"
                            >
                                <Instagram size={20} />
                            </a>
                            <a 
                                href="https://www.facebook.com/austincolombo7" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 hover:border-gold hover:scale-110 transition-all bg-white/5 backdrop-blur-sm"
                            >
                                <Facebook size={20} />
                            </a>
                        </div>
                        <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-gold/50" />
                    </motion.div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1 }
                        }}
                        className="mt-16"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-6 h-10 border-2 border-gold/30 rounded-full mx-auto flex justify-center p-1"
                        >
                            <div className="w-1 h-2 bg-gold border border-gold rounded-full" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default VideoParallaxSection;

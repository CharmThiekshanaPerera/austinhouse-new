import { Instagram, Facebook, Volume2, VolumeX } from "lucide-react";
import introVideo from "@/assets/intro.mp4";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const VideoParallaxSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false); // Default to unmuted as requested

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

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
                {/* Removed obscured static background image to prioritize video clarity */}
            </div>

            {/* Parallax Video Overlay Layer */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 w-full h-[120%] z-10 opacity-100"
            >
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source
                        src={introVideo}
                        type="video/mp4"
                    />
                </video>
            </motion.div>

            {/* Subtle Gradient for text readability at bottom only */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20 pointer-events-none" />


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
                    {/* Middle and center content removed to show video clearly */}
                    
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="absolute bottom-20 left-0 right-0 px-4 md:px-8 z-50 pointer-events-none"
                    >
                        <p className="font-body text-white text-base md:text-xl max-w-4xl mx-auto font-light leading-relaxed text-center drop-shadow-2xl bg-black/40 backdrop-blur-md py-6 px-8 rounded-2xl border border-white/10">
                            "Immerse yourself in Colombo's most exclusive sanctuary.
                            Experience treatments designed not just to enhance your appearance,
                            but to restore your inner balance."
                        </p>
                    </motion.div>

                    {/* Sound Control Toggle */}
                    <div className="absolute bottom-40 right-8 z-[60]">
                        <button 
                            onClick={toggleMute}
                            className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all group"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                    </div>

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

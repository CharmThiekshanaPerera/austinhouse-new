import { Volume2, VolumeX } from "lucide-react";
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
            className="relative h-[70vh] md:h-[90vh] min-h-[500px] md:min-h-[700px] w-full overflow-hidden flex items-center justify-center bg-charcoal"
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
                    preload="auto"
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
                            hidden: { opacity: 0, y: 30 },
                            visible: { 
                                opacity: 1, 
                                y: 0,
                                transition: {
                                    duration: 1,
                                    ease: "easeOut",
                                    delay: 0.5
                                }
                            }
                        }}
                        className="absolute bottom-10 md:bottom-24 left-0 right-0 px-4 md:px-8 z-50 pointer-events-none"
                    >
                        <p className="font-body text-white text-[13px] md:text-xl lg:text-2xl max-w-5xl mx-auto font-light leading-relaxed text-center drop-shadow-2xl bg-black/50 backdrop-blur-xl py-5 md:py-10 px-6 md:px-14 rounded-2xl md:rounded-[3rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.8 }}
                                className="block mb-3 text-gold/90 font-medium tracking-[0.3em] uppercase text-[10px] md:text-xs"
                            >
                                Experience Excellence
                            </motion.span>
                            "Immerse yourself in Colombo's most exclusive sanctuary.
                            Experience treatments designed not just to enhance your appearance,
                            but to restore your inner balance."
                        </p>
                    </motion.div>

                    {/* Sound Control Toggle - Repositioned for Mobile */}
                    <div className="absolute bottom-6 md:bottom-20 right-4 md:right-12 z-[60]">
                        <button 
                            onClick={toggleMute}
                            className="p-2.5 md:p-4 rounded-full bg-black/50 backdrop-blur-lg border border-white/20 text-white hover:bg-gold/20 hover:border-gold/50 transition-all group shadow-2xl"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <VolumeX size={18} className="md:w-6 md:h-6" /> : <Volume2 size={18} className="md:w-6 md:h-6" />}
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default VideoParallaxSection;

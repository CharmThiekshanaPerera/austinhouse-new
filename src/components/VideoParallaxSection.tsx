import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const VideoParallaxSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Parallax effect: moves the video slightly slower than the scroll
    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section
            ref={containerRef}
            className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center"
        >
            {/* Parallax Video Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 w-full h-[140%] z-0"
            >
                <div className="absolute inset-0 bg-charcoal/60 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80 z-20" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    {/* Using a high-quality luxury spa placeholder video */}
                    <source
                        src="https://player.vimeo.com/external/498305001.sd.mp4?s=d0db586c91350a8ceca9fd8ebd598ff7b7bbcb17&profile_id=164&oauth2_token_id=57447761"
                        type="video/mp4"
                    />
                </video>
            </motion.div>

            {/* Content Overlay */}
            <div className="container relative z-30 mx-auto px-4 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto space-y-6"
                >
                    <p className="text-gold uppercase tracking-[0.4em] text-sm md:text-base font-body font-semibold">
                        The Gold Standard
                    </p>
                    <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                        Where Beauty Meets <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#FDF3A7] to-gold">
                            Tranquility
                        </span>
                    </h2>
                    <p className="font-body text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mt-8">
                        Immerse yourself in Colombo's most exclusive sanctuary.
                        Experience treatments designed not just to enhance your appearance,
                        but to restore your inner balance.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default VideoParallaxSection;

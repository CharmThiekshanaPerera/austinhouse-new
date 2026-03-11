import { motion } from "framer-motion";
import { Instagram, Heart, MessageCircle } from "lucide-react";
import LazyImage from "./LazyImage";

// Dummy high-quality aesthetic images
const instagramPosts = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80",
        likes: 342,
        comments: 28,
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80",
        likes: 512,
        comments: 45,
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80",
        likes: 890,
        comments: 112,
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80",
        likes: 421,
        comments: 31,
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80",
        likes: 678,
        comments: 56,
    },
];

const InstagramWall = () => {
    return (
        <section className="py-20 lg:py-32 bg-background overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8 text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="flex items-center justify-center gap-2 text-primary font-body uppercase tracking-[0.3em] text-sm mb-4">
                        <Instagram size={18} />
                        <span>Follow Us</span>
                    </div>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
                        @AustinHouse<span className="text-gold-gradient">Spa</span>
                    </h2>
                    <p className="text-muted-foreground font-body text-lg">
                        Join our community for daily beauty inspiration, exclusive offers,
                        and behind-the-scenes glimpses into Colombo's finest luxury sanctuary.
                    </p>
                </motion.div>
            </div>

            {/* Scrolling / Masonry Grid */}
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
                    {instagramPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`relative group overflow-hidden rounded-xl cursor-pointer ${index === 2 ? 'col-span-2 row-span-2 md:col-span-1 md:row-span-1' : ''
                                }`}
                        >
                            {/* Image */}
                            <LazyImage
                                src={post.image}
                                alt="Instagram post"
                                className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${index === 2 ? 'h-[400px] md:h-80' : 'h-48 md:h-80'
                                    }`}
                                skeletonClassName={`w-full ${index === 2 ? 'h-[400px] md:h-80' : 'h-48 md:h-80'}`}
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="flex gap-6 text-white font-body font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center gap-2">
                                        <Heart size={20} className="fill-white" />
                                        <span>{post.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle size={20} className="fill-white" />
                                        <span>{post.comments}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Call to action button */}
                <div className="text-center mt-12">
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-primary text-primary hover:bg-primary hover:text-white rounded-full font-body font-medium transition-all duration-300 group"
                    >
                        <span>View Full Gallery</span>
                        <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default InstagramWall;

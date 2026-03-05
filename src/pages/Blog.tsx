import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Search, Tag } from "lucide-react";
import { format } from "date-fns";
import { useData, BlogPost } from "@/contexts/DataContext";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Blog = () => {
  const { blogPosts } = useData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const published = blogPosts.filter(p => p.published);
  const categories = [...new Set(published.map(p => p.category).filter(Boolean))];

  const filtered = published.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title={selectedPost.title}
          description={selectedPost.excerpt || selectedPost.content.slice(0, 155)}
          ogImage={selectedPost.imageUrl}
          ogType="article"
          breadcrumbs={[
            { name: "Home", url: "https://bright-living-clone.lovable.app/" },
            { name: "Blog", url: "https://bright-living-clone.lovable.app/blog" },
            { name: selectedPost.title, url: "https://bright-living-clone.lovable.app/blog" },
          ]}
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: selectedPost.title,
            description: selectedPost.excerpt || selectedPost.content.slice(0, 155),
            image: selectedPost.imageUrl || undefined,
            datePublished: selectedPost.createdAt,
            author: {
              "@type": "Organization",
              name: "Austin House Beauty & Spa",
            },
            publisher: {
              "@type": "Organization",
              name: "Austin House Beauty & Spa",
            },
            articleSection: selectedPost.category || "Beauty",
          }}
        />
        {/* Post Hero */}
        <section className="relative pt-32 pb-16 bg-charcoal overflow-hidden">
          {selectedPost.imageUrl && (
            <div className="absolute inset-0 opacity-20">
              <img src={selectedPost.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="absolute inset-0 bg-dark-overlay" />
          <div className="relative container mx-auto px-4 lg:px-8 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <button
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-body text-sm mb-6 transition-colors"
              >
                <ArrowLeft size={16} /> Back to Blog
              </button>
              {selectedPost.category && (
                <Badge className="bg-gold/20 text-gold border-gold/30 font-body text-xs mb-4">{selectedPost.category}</Badge>
              )}
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-cream leading-tight mb-4">
                {selectedPost.title}
              </h1>
              <div className="flex items-center gap-3 text-cream/50 font-body text-sm">
                <Calendar size={14} />
                <span>{format(new Date(selectedPost.createdAt), "MMMM d, yyyy")}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Post Content */}
        <article className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              {selectedPost.imageUrl && (
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-64 md:h-80 object-cover rounded-xl mb-10 shadow-gold"
                />
              )}
              {selectedPost.excerpt && (
                <p className="text-lg font-body text-muted-foreground italic border-l-4 border-primary pl-6 mb-10">
                  {selectedPost.excerpt}
                </p>
              )}
              <div className="prose prose-lg max-w-none font-body text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </div>
            </motion.div>
          </div>
        </article>

        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Beauty Blog"
        description="Expert skincare tips, beauty trends, and wellness insights from Austin House Beauty & Spa. Discover the secrets to radiant, healthy skin."
        canonical="https://bright-living-clone.lovable.app/blog"
        ogImage="https://bright-living-clone.lovable.app/og-blog.jpg"
        breadcrumbs={[
          { name: "Home", url: "https://bright-living-clone.lovable.app/" },
          { name: "Blog", url: "https://bright-living-clone.lovable.app/blog" },
        ]}
      />
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 bg-dark-overlay" />
        <div className="relative container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-gold uppercase tracking-[0.3em] text-sm font-body mb-4">Our Journal</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4">
              Beauty <span className="text-gold-gradient">Blog</span>
            </h1>
            <p className="text-cream/60 font-body text-lg max-w-2xl mx-auto">
              Tips, trends, and insights from our skincare & beauty experts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-secondary/50 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-background pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-4 py-1.5 rounded-full font-body text-xs uppercase tracking-wider transition-all border",
                  !selectedCategory
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                )}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-full font-body text-xs uppercase tracking-wider transition-all border",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-xl text-muted-foreground mb-2">No posts found</p>
              <p className="text-muted-foreground font-body text-sm">
                {published.length === 0 ? "Check back soon — new articles coming!" : "Try a different search or category."}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => setSelectedPost(post)}
                  className="group cursor-pointer"
                >
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-accent">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-4xl text-muted-foreground/30">{post.title.charAt(0)}</span>
                        </div>
                      )}
                      {post.category && (
                        <Badge className="absolute top-4 left-4 bg-charcoal/80 text-cream border-none font-body text-[10px] backdrop-blur-sm">
                          {post.category}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-muted-foreground font-body text-xs mb-3">
                        <Calendar size={12} />
                        <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                      </div>
                      <h2 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground font-body text-sm line-clamp-3">
                        {post.excerpt || post.content.slice(0, 120) + "..."}
                      </p>
                      <span className="inline-block mt-4 text-primary font-body text-sm font-semibold group-hover:underline">
                        Read More →
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Blog;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useState, useMemo } from "react";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import SEO from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { useData } from "@/contexts/DataContext";
import { toast } from "@/hooks/use-toast";

const ProductCardSkeleton = () => (
  <div className="bg-card rounded-lg overflow-hidden shadow-lg animate-pulse">
    <div className="h-72 bg-muted" />
    <div className="p-6 space-y-3">
      <div className="h-5 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-full" />
      <div className="h-3 bg-muted rounded w-5/6" />
      <div className="flex justify-between mt-2">
        <div className="h-6 bg-muted rounded w-1/4" />
        <div className="h-8 bg-muted rounded w-1/3" />
      </div>
    </div>
  </div>
);

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addItem, setIsOpen, totalItems } = useCart();
  const { products, productsLoading } = useData();

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ["All", ...cats];
  }, [products]);

  const filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      name: product.name,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
    });
    toast({
      title: "Added to cart ✨",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Products" description="Shop premium skincare products — serums, moisturizers, sunscreens, cleansers & eye creams curated by Austin House Beauty & Spa experts." canonical="https://bright-living-clone.lovable.app/products" ogImage="https://bright-living-clone.lovable.app/og-products.jpg" breadcrumbs={[{ name: "Home", url: "https://bright-living-clone.lovable.app/" }, { name: "Products", url: "https://bright-living-clone.lovable.app/products" }]} />
      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gold-gradient rounded-full shadow-gold flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <ShoppingBag size={22} className="text-primary-foreground" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-charcoal text-cream text-xs font-body font-bold rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        </button>
      )}

      {/* Hero Banner */}
      <section className="pt-32 pb-16 bg-charcoal">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm font-body mb-4">Our Collection</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4">
              Aftercare <span className="text-gold-gradient">Products</span>
            </h1>
            <p className="text-cream/60 font-body text-lg max-w-2xl mx-auto">
              Extend the benefits of your treatments with our curated range of gold-standard aftercare products, designed to protect, nourish, and transform.
            </p>
            <div className="mt-4">
              <Link to="/" className="text-gold hover:text-gold-light font-body text-sm transition-colors">
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-secondary/50 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-body text-sm tracking-wider transition-all ${activeCategory === cat
                  ? "bg-gold-gradient text-primary-foreground shadow-gold"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {productsLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-gold transition-shadow duration-500"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-charcoal/80 text-gold text-xs font-body tracking-wider uppercase px-3 py-1 rounded-full backdrop-blur-sm">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-display text-2xl font-bold text-gold-gradient">{product.price}</p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider rounded-sm shadow-gold hover:opacity-90 transition-opacity"
                      >
                        <ShoppingBag size={14} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Products;

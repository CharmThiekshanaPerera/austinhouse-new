import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { ShoppingBag, ArrowLeft, CreditCard, Truck, MapPin, User, Mail, Phone, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (items.length === 0 && !orderComplete) {
      navigate("/products");
    }
  }, [items, navigate, orderComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addOrder({
        items: items.map(item => ({
          product_id: item.name, // Using name as ID for demo since context items use names
          name: item.name,
          quantity: item.quantity,
          price: parseInt(item.price.replace(/[^\d]/g, "")),
          image: item.image
        })),
        total: totalPrice,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        address: formData.address,
        city: formData.city,
        payment_method: "COD"
      });

      setOrderComplete(true);
      clearCart();
      toast({
        title: "Order Placed Successfully! 🎉",
        description: "Thank you for shopping with Austin House.",
      });
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-32">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 max-w-2xl text-center pb-32">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border rounded-xl p-12 shadow-xl"
          >
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">Thank You for Your Order!</h1>
            <p className="text-muted-foreground font-body text-lg mb-8">
              Your order has been received and is being processed. We will contact you shortly for delivery.
            </p>
            <Button 
                onClick={() => navigate("/products")}
                className="bg-gold-gradient text-primary-foreground font-body font-bold uppercase tracking-wider px-10"
            >
              Back to Shop
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32">
      <SEO title="Checkout" />
      <Navbar />

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl pb-32">
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 font-body text-sm">
            <ArrowLeft size={16} /> Back to Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">Secure Checkout</h1>
              <p className="text-muted-foreground font-body">Complete your purchase by providing your delivery details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-6">
                <div className="flex items-center gap-3 text-gold mb-2">
                  <User size={20} />
                  <h2 className="font-display text-xl font-bold text-foreground">Contact Information</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Full Name</Label>
                    <Input id="name" name="name" required value={formData.name} onChange={handleInputChange} className="bg-background border-border h-12" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Email Address</Label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className="bg-background border-border h-12" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Mobile Phone</Label>
                  <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} className="bg-background border-border h-12" placeholder="+94 7X XXX XXXX" />
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-6">
                <div className="flex items-center gap-3 text-gold mb-2">
                  <MapPin size={20} />
                  <h2 className="font-display text-xl font-bold text-foreground">Shipping Address</h2>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Street Address</Label>
                  <Input id="address" name="address" required value={formData.address} onChange={handleInputChange} className="bg-background border-border h-12" placeholder="No 22, Austin Place" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">City</Label>
                  <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} className="bg-background border-border h-12" placeholder="Colombo 08" />
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-6">
                <div className="flex items-center gap-3 text-gold mb-2">
                  <CreditCard size={20} />
                  <h2 className="font-display text-xl font-bold text-foreground">Payment Method</h2>
                </div>
                
                <RadioGroup defaultValue="cod" className="grid gap-4">
                  <div className="flex items-center space-x-3 bg-background border border-border p-4 rounded-lg cursor-pointer hover:border-gold/50 transition-colors">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <p className="font-bold text-foreground">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay when you receive the product.</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-muted/50 border border-border p-4 rounded-lg opacity-60 cursor-not-allowed">
                    <RadioGroupItem value="card" id="card" disabled />
                    <Label htmlFor="card" className="flex-1 cursor-not-allowed">
                      <p className="font-bold text-muted-foreground">Online Card Payment</p>
                      <p className="text-[10px] text-gold uppercase tracking-tighter">Coming Soon</p>
                    </Label>
                  </div>
                </RadioGroup>
              </section>

              <Button 
                type="submit" 
                disabled={submitting} 
                className="w-full py-7 bg-gold-gradient text-primary-foreground font-body font-bold tracking-[0.2em] uppercase text-sm rounded-sm shadow-gold hover:opacity-90 transition-opacity"
              >
                {submitting ? <Loader2 className="animate-spin mr-2" /> : <ShoppingBag className="mr-2" size={18} />}
                {submitting ? "Processing…" : "Confirm Order"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-muted/30 px-6 py-4 border-b border-border">
                  <h3 className="font-display text-lg font-bold">Order Summary</h3>
                </div>
                <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.name} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-background border border-border overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body text-sm font-bold text-foreground truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground font-body">Qty: {item.quantity}</p>
                        <p className="text-sm text-gold font-body font-bold">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-muted/10 border-t border-border space-y-3">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">LKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest">Free</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between font-display text-xl">
                    <span className="font-bold">Total</span>
                    <span className="text-gold-gradient font-bold">LKR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 px-4">
                <div className="flex items-center gap-3 text-muted-foreground font-body text-xs">
                  <Truck size={16} className="text-gold flex-shrink-0" />
                  <p>Fast delivery within 2-3 business days islandwide.</p>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground font-body text-xs">
                  <CheckCircle2 size={16} className="text-gold flex-shrink-0" />
                  <p>100% genuine products directly from Austin House.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;

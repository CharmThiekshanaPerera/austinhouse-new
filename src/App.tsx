import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { DataProvider } from "@/contexts/DataContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";
import ChatBot from "@/components/ChatBot";
import PublicLayout from "@/pages/PublicLayout";

// Lazy-loaded public pages
const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const Services = lazy(() => import("./pages/Services"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy-loaded admin pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminNewsletter = lazy(() => import("./pages/admin/AdminNewsletter"));
const AdminRevenue = lazy(() => import("./pages/admin/AdminRevenue"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSocial = lazy(() => import("./pages/admin/AdminSocial"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
const AdminLoyalty = lazy(() => import("./pages/admin/AdminLoyalty"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const AdminStaff = lazy(() => import("./pages/admin/AdminStaff"));
const AdminPromotions = lazy(() => import("./pages/admin/AdminPromotions"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminGiftCards = lazy(() => import("./pages/admin/AdminGiftCards"));
const AdminWaitlist = lazy(() => import("./pages/admin/AdminWaitlist"));
const AdminEmailTemplates = lazy(() => import("./pages/admin/AdminEmailTemplates"));
const AdminExpenses = lazy(() => import("./pages/admin/AdminExpenses"));
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-muted-foreground font-body text-sm">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="social" element={<AdminSocial />} />
          <Route path="revenue" element={<AdminRevenue />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="seo" element={<AdminSEO />} />
          <Route path="loyalty" element={<AdminLoyalty />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="gift-cards" element={<AdminGiftCards />} />
          <Route path="waitlist" element={<AdminWaitlist />} />
          <Route path="email-templates" element={<AdminEmailTemplates />} />
          <Route path="expenses" element={<AdminExpenses />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AnimatedRoutes />
              <ChatBot />
            </BrowserRouter>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

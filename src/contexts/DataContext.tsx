import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { productsApi } from "@/lib/productsApi";
import { servicesApi } from "@/lib/servicesApi";

export interface Product {
  id: string;
  image: string;
  name: string;
  category: string;
  price: string;
  priceNum: number;
  description: string;
}

export interface Service {
  id: string;
  image: string;
  category?: string;
  title: string;
  duration: string;
  price: string;
  rating: number;
  description: string;
  benefits: string[];
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  treatment: string;
  date: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  avatarUrl: string;
  rating: number;
  featured: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  active: boolean;
  subscribedAt: string;
}

export interface RevenueEntry {
  id: string;
  description: string;
  customerName: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
  recurring: boolean;
  interval?: "monthly" | "quarterly" | "yearly";
  notes: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
}

interface DataContextType {
  products: Product[];
  services: Service[];
  bookings: Booking[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
  revenueEntries: RevenueEntry[];
  activityLogs: ActivityLog[];
  addProduct: (p: Omit<Product, "id">) => Promise<Product>;
  updateProduct: (p: Product) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  addService: (s: Omit<Service, "id">) => Promise<Service>;
  updateService: (s: Service) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  addBooking: (b: Omit<Booking, "id" | "createdAt">) => void;
  updateBooking: (b: Booking) => void;
  deleteBooking: (id: string) => void;
  addBlogPost: (p: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => void;
  updateBlogPost: (p: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  addTestimonial: (t: Omit<Testimonial, "id" | "createdAt">) => void;
  updateTestimonial: (t: Testimonial) => void;
  deleteTestimonial: (id: string) => void;
  addContactMessage: (m: Omit<ContactMessage, "id" | "createdAt" | "read" | "replied">) => void;
  updateContactMessage: (m: ContactMessage) => void;
  deleteContactMessage: (id: string) => void;
  addNewsletterSubscriber: (email: string) => void;
  updateNewsletterSubscriber: (s: NewsletterSubscriber) => void;
  deleteNewsletterSubscriber: (id: string) => void;
  addRevenueEntry: (r: Omit<RevenueEntry, "id" | "createdAt">) => void;
  updateRevenueEntry: (r: RevenueEntry) => void;
  deleteRevenueEntry: (id: string) => void;
  addActivityLog: (action: string, detail: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const addActivityLog = (action: string, detail: string) =>
    setActivityLogs(prev => [{ id: `al_${Date.now()}`, action, detail, timestamp: new Date().toISOString() }, ...prev].slice(0, 100));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await productsApi.list();
        if (!cancelled) setProducts(remote);
      } catch (e) {
        console.warn("Failed to load products from API.", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await servicesApi.list();
        if (!cancelled) setServices(remote);
      } catch (e) {
        console.warn("Failed to load services from API.", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addProduct = async (p: Omit<Product, "id">) => {
    const created = await productsApi.create(p);
    setProducts(prev => [...prev, created]);
    addActivityLog("Product Added", created.name);
    return created;
  };

  const updateProduct = async (p: Product) => {
    const updated = await productsApi.replace(p.id, p);
    setProducts(prev => prev.map(x => (x.id === updated.id ? updated : x)));
    addActivityLog("Product Updated", updated.name);
    return updated;
  };

  const deleteProduct = async (id: string) => {
    await productsApi.remove(id);
    setProducts(prev => prev.filter(x => x.id !== id));
    addActivityLog("Product Deleted", id);
  };

  const addService = async (s: Omit<Service, "id">) => {
    const created = await servicesApi.create(s);
    setServices(prev => [...prev, created]);
    addActivityLog("Service Added", created.title);
    return created;
  };

  const updateService = async (s: Service) => {
    const updated = await servicesApi.replace(s.id, s);
    setServices(prev => prev.map(x => (x.id === updated.id ? updated : x)));
    addActivityLog("Service Updated", updated.title);
    return updated;
  };

  const deleteService = async (id: string) => {
    await servicesApi.remove(id);
    setServices(prev => prev.filter(x => x.id !== id));
    addActivityLog("Service Deleted", id);
  };

  const addBooking = (b: Omit<Booking, "id" | "createdAt">) => {
    const nb = { ...b, id: `b_${Date.now()}`, createdAt: new Date().toISOString() };
    setBookings(prev => [...prev, nb]);
    addActivityLog("Booking Created", `${b.name} - ${b.treatment}`);
  };

  const updateBooking = (b: Booking) => {
    setBookings(prev => prev.map(x => (x.id === b.id ? b : x)));
    addActivityLog("Booking Updated", `${b.name} → ${b.status}`);
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(x => x.id !== id));
    addActivityLog("Booking Deleted", id);
  };

  const addBlogPost = (p: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    setBlogPosts(prev => [...prev, { ...p, id: `bp_${Date.now()}`, createdAt: now, updatedAt: now }]);
    addActivityLog("Blog Post Created", p.title);
  };

  const updateBlogPost = (p: BlogPost) => {
    setBlogPosts(prev => prev.map(x => (x.id === p.id ? { ...p, updatedAt: new Date().toISOString() } : x)));
    addActivityLog("Blog Post Updated", p.title);
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(x => x.id !== id));
    addActivityLog("Blog Post Deleted", id);
  };

  const addTestimonial = (t: Omit<Testimonial, "id" | "createdAt">) => {
    setTestimonials(prev => [...prev, { ...t, id: `t_${Date.now()}`, createdAt: new Date().toISOString() }]);
    addActivityLog("Testimonial Added", t.name);
  };

  const updateTestimonial = (t: Testimonial) => {
    setTestimonials(prev => prev.map(x => (x.id === t.id ? t : x)));
    addActivityLog("Testimonial Updated", t.name);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(x => x.id !== id));
    addActivityLog("Testimonial Deleted", id);
  };

  const addContactMessage = (m: Omit<ContactMessage, "id" | "createdAt" | "read" | "replied">) => {
    setContactMessages(prev => [
      ...prev,
      { ...m, id: `m_${Date.now()}`, createdAt: new Date().toISOString(), read: false, replied: false },
    ]);
    addActivityLog("New Contact Message", m.subject);
  };

  const updateContactMessage = (m: ContactMessage) => setContactMessages(prev => prev.map(x => (x.id === m.id ? m : x)));

  const deleteContactMessage = (id: string) => {
    setContactMessages(prev => prev.filter(x => x.id !== id));
    addActivityLog("Message Deleted", id);
  };

  const addNewsletterSubscriber = (email: string) => {
    setNewsletterSubscribers(prev => [...prev, { id: `ns_${Date.now()}`, email, active: true, subscribedAt: new Date().toISOString() }]);
    addActivityLog("Newsletter Subscriber", email);
  };

  const updateNewsletterSubscriber = (s: NewsletterSubscriber) => setNewsletterSubscribers(prev => prev.map(x => (x.id === s.id ? s : x)));

  const deleteNewsletterSubscriber = (id: string) => {
    setNewsletterSubscribers(prev => prev.filter(x => x.id !== id));
    addActivityLog("Subscriber Removed", id);
  };

  const addRevenueEntry = (r: Omit<RevenueEntry, "id" | "createdAt">) => {
    setRevenueEntries(prev => [...prev, { ...r, id: `r_${Date.now()}`, createdAt: new Date().toISOString() }]);
    addActivityLog("Revenue Added", `${r.amount}`);
  };

  const updateRevenueEntry = (r: RevenueEntry) => {
    setRevenueEntries(prev => prev.map(x => (x.id === r.id ? r : x)));
    addActivityLog("Revenue Updated", r.description);
  };

  const deleteRevenueEntry = (id: string) => {
    setRevenueEntries(prev => prev.filter(x => x.id !== id));
    addActivityLog("Revenue Deleted", id);
  };

  return (
    <DataContext.Provider
      value={{
        products,
        services,
        bookings,
        blogPosts,
        testimonials,
        contactMessages,
        newsletterSubscribers,
        revenueEntries,
        activityLogs,
        addProduct,
        updateProduct,
        deleteProduct,
        addService,
        updateService,
        deleteService,
        addBooking,
        updateBooking,
        deleteBooking,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addContactMessage,
        updateContactMessage,
        deleteContactMessage,
        addNewsletterSubscriber,
        updateNewsletterSubscriber,
        deleteNewsletterSubscriber,
        addRevenueEntry,
        updateRevenueEntry,
        deleteRevenueEntry,
        addActivityLog,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};


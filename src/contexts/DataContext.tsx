import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { productsApi } from "@/lib/productsApi";
import { servicesApi } from "@/lib/servicesApi";
import { bookingsApi } from "@/lib/bookingsApi";
import { staffApi } from "@/lib/staffApi";
import { customersApi } from "@/lib/customersApi";
import { blogApi } from "@/lib/blogApi";
import { waitlistApi } from "@/lib/waitlistApi";
import { testimonialsApi } from "@/lib/testimonialsApi";
import { contactMessagesApi } from "@/lib/contactMessagesApi";
import { subscribersApi } from "@/lib/subscribersApi";
import { galleryImagesApi, beforeAfterApi, BeforeAfterPair } from "@/lib/galleryApi";

export type { BeforeAfterPair } from "@/lib/galleryApi";

export interface GalleryImage {
  id: string;
  image: string;
  alt: string;
  category: "Environment" | "Treatments" | "Results" | "Products" | "Before/After";
  type: "image" | "video";
}

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

// Matches backend BookingBase schema
export interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  service_id: string;
  staff_id?: string | null;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  notes?: string | null;
}

// Matches backend StaffBase schema
export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
  image?: string | null;
  show_in_frontend?: boolean;
}

// Matches backend CustomerBase schema
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  total_spent: number;
  last_visit?: string | null;
}

// Matches backend BlogPostBase schema
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author_id: string;
  published: boolean;
  image?: string | null;
}

// Matches backend WaitlistEntryBase schema
export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  preferred_date: string;
  service_id: string;
  notes?: string | null;
}

// Matches backend TestimonialBase schema
export interface Testimonial {
  id: string;
  text: string;
  author: string;
  rating: number;
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
  staff: Staff[];
  customers: Customer[];
  blogPosts: BlogPost[];
  waitlistEntries: WaitlistEntry[];
  testimonials: Testimonial[];
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
  revenueEntries: RevenueEntry[];
  activityLogs: ActivityLog[];
  galleryImages: GalleryImage[];
  beforeAfterPairs: BeforeAfterPair[];
  // Loading states
  servicesLoading: boolean;
  productsLoading: boolean;
  bookingsLoading: boolean;
  staffLoading: boolean;
  customersLoading: boolean;
  blogLoading: boolean;
  waitlistLoading: boolean;
  testimonialsLoading: boolean;
  contactMessagesLoading: boolean;
  galleryLoading: boolean;
  subscribersLoading: boolean;
  // Products
  addProduct: (p: Omit<Product, "id">) => Promise<Product>;
  updateProduct: (p: Product) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  // Services
  addService: (s: Omit<Service, "id">) => Promise<Service>;
  updateService: (s: Service) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  // Bookings (API-backed)
  addBooking: (b: Omit<Booking, "id">) => Promise<Booking>;
  updateBooking: (id: string, b: Partial<Omit<Booking, "id">>) => Promise<Booking>;
  deleteBooking: (id: string) => Promise<void>;
  // Staff (API-backed)
  addStaff: (s: Omit<Staff, "id">) => Promise<Staff>;
  updateStaff: (id: string, s: Partial<Omit<Staff, "id">>) => Promise<Staff>;
  deleteStaff: (id: string) => Promise<void>;
  // Customers (API-backed)
  addCustomer: (c: Omit<Customer, "id">) => Promise<Customer>;
  updateCustomer: (id: string, c: Partial<Omit<Customer, "id">>) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
  // Blog (API-backed)
  addBlogPost: (p: Omit<BlogPost, "id">) => Promise<BlogPost>;
  updateBlogPost: (id: string, p: Partial<Omit<BlogPost, "id">>) => Promise<BlogPost>;
  deleteBlogPost: (id: string) => Promise<void>;
  // Waitlist (API-backed)
  addWaitlistEntry: (w: Omit<WaitlistEntry, "id">) => Promise<WaitlistEntry>;
  deleteWaitlistEntry: (id: string) => Promise<void>;
  // Testimonials (API-backed)
  addTestimonial: (t: Omit<Testimonial, "id">) => Promise<Testimonial>;
  updateTestimonial: (id: string, t: Partial<Omit<Testimonial, "id">>) => Promise<Testimonial>;
  deleteTestimonial: (id: string) => Promise<void>;
  // Contact Messages (API-backed)
  addContactMessage: (m: Omit<ContactMessage, "id" | "createdAt" | "read" | "replied">) => Promise<ContactMessage>;
  updateContactMessage: (id: string, m: Partial<Omit<ContactMessage, "id" | "createdAt">>) => Promise<ContactMessage>;
  deleteContactMessage: (id: string) => Promise<void>;
  // Gallery (API-backed)
  addGalleryImage: (img: Omit<GalleryImage, "id">) => Promise<GalleryImage>;
  deleteGalleryImage: (id: string) => Promise<void>;
  updateGalleryImage: (id: string, img: Partial<Omit<GalleryImage, "id">>) => Promise<GalleryImage>;
  addBeforeAfterPair: (pair: Omit<BeforeAfterPair, "id">) => Promise<BeforeAfterPair>;
  deleteBeforeAfterPair: (id: string) => Promise<void>;
  updateBeforeAfterPair: (id: string, pair: Partial<Omit<BeforeAfterPair, "id">>) => Promise<BeforeAfterPair>;
  // Subscribers (API-backed)
  addNewsletterSubscriber: (email: string) => Promise<NewsletterSubscriber>;
  updateNewsletterSubscriber: (s: NewsletterSubscriber) => Promise<NewsletterSubscriber>;
  deleteNewsletterSubscriber: (id: string) => Promise<void>;
  // Local-only
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
  const [staff, setStaff] = useState<Staff[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [beforeAfterPairs, setBeforeAfterPairs] = useState<BeforeAfterPair[]>([]);

  // Loading states
  const [servicesLoading, setServicesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [staffLoading, setStaffLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(true);
  const [waitlistLoading, setWaitlistLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [contactMessagesLoading, setContactMessagesLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [subscribersLoading, setSubscribersLoading] = useState(true);

  const addActivityLog = (action: string, detail: string) =>
    setActivityLogs(prev =>
      [{ id: `al_${Date.now()}`, action, detail, timestamp: new Date().toISOString() }, ...prev].slice(0, 100),
    );

  // ─── Products ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await productsApi.list();
        if (!cancelled) setProducts(remote);
      } catch (e) {
        console.warn("Failed to load products from API.", e);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Services ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await servicesApi.list();
        if (!cancelled) setServices(remote);
      } catch (e) {
        console.warn("Failed to load services from API.", e);
      } finally {
        if (!cancelled) setServicesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Bookings ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await bookingsApi.list();
        if (!cancelled) setBookings(remote);
      } catch (e) {
        console.warn("Failed to load bookings from API.", e);
      } finally {
        if (!cancelled) setBookingsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Staff ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await staffApi.list();
        if (!cancelled) setStaff(remote);
      } catch (e) {
        console.warn("Failed to load staff from API.", e);
      } finally {
        if (!cancelled) setStaffLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Customers ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await customersApi.list();
        if (!cancelled) setCustomers(remote);
      } catch (e) {
        console.warn("Failed to load customers from API.", e);
      } finally {
        if (!cancelled) setCustomersLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Blog ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await blogApi.list();
        if (!cancelled) setBlogPosts(remote);
      } catch (e) {
        console.warn("Failed to load blog posts from API.", e);
      } finally {
        if (!cancelled) setBlogLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Waitlist ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await waitlistApi.list();
        if (!cancelled) setWaitlistEntries(remote);
      } catch (e) {
        console.warn("Failed to load waitlist from API.", e);
      } finally {
        if (!cancelled) setWaitlistLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Testimonials ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await testimonialsApi.list() as Testimonial[];
        if (!cancelled) setTestimonials(remote);
      } catch (e) {
        console.warn("Failed to load testimonials from API.", e);
      } finally {
        if (!cancelled) setTestimonialsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Contact Messages ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await contactMessagesApi.list();
        if (!cancelled) setContactMessages(remote);
      } catch (e) {
        console.warn("Failed to load contact messages from API.", e);
      } finally {
        if (!cancelled) setContactMessagesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Subscribers ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await subscribersApi.list();
        if (!cancelled) setNewsletterSubscribers(remote);
      } catch (e) {
        console.warn("Failed to load subscribers from API.", e);
      } finally {
        if (!cancelled) setSubscribersLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Gallery Images & Before/After ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [imgs, pairs] = await Promise.all([
          galleryImagesApi.list(),
          beforeAfterApi.list(),
        ]);
        if (!cancelled) {
          setGalleryImages(imgs);
          setBeforeAfterPairs(pairs);
        }
      } catch (e) {
        console.warn("Failed to load gallery from API.", e);
      } finally {
        if (!cancelled) setGalleryLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Product CRUD ────────────────────────────────────────────────────────────
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

  // ─── Service CRUD ────────────────────────────────────────────────────────────
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

  // ─── Booking CRUD ────────────────────────────────────────────────────────────
  const addBooking = async (b: Omit<Booking, "id">) => {
    const created = await bookingsApi.create(b);
    setBookings(prev => [...prev, created]);
    addActivityLog("Booking Created", `${b.customer_name} - ${b.date}`);
    return created;
  };

  const updateBooking = async (id: string, b: Partial<Omit<Booking, "id">>) => {
    const updated = await bookingsApi.update(id, b);
    setBookings(prev => prev.map(x => (x.id === id ? updated : x)));
    addActivityLog("Booking Updated", `${updated.customer_name} → ${updated.status}`);
    return updated;
  };

  const deleteBooking = async (id: string) => {
    await bookingsApi.remove(id);
    setBookings(prev => prev.filter(x => x.id !== id));
    addActivityLog("Booking Deleted", id);
  };

  // ─── Staff CRUD ──────────────────────────────────────────────────────────────
  const addStaff = async (s: Omit<Staff, "id">) => {
    const created = await staffApi.create(s);
    setStaff(prev => [...prev, created]);
    addActivityLog("Staff Added", created.name);
    return created;
  };

  const updateStaff = async (id: string, s: Partial<Omit<Staff, "id">>) => {
    const updated = await staffApi.update(id, s);
    setStaff(prev => prev.map(x => (x.id === id ? updated : x)));
    addActivityLog("Staff Updated", updated.name);
    return updated;
  };

  const deleteStaff = async (id: string) => {
    await staffApi.remove(id);
    setStaff(prev => prev.filter(x => x.id !== id));
    addActivityLog("Staff Deleted", id);
  };

  // ─── Customer CRUD ───────────────────────────────────────────────────────────
  const addCustomer = async (c: Omit<Customer, "id">) => {
    const created = await customersApi.create(c);
    setCustomers(prev => [...prev, created]);
    addActivityLog("Customer Added", created.name);
    return created;
  };

  const updateCustomer = async (id: string, c: Partial<Omit<Customer, "id">>) => {
    const updated = await customersApi.update(id, c);
    setCustomers(prev => prev.map(x => (x.id === id ? updated : x)));
    addActivityLog("Customer Updated", updated.name);
    return updated;
  };

  const deleteCustomer = async (id: string) => {
    await customersApi.remove(id);
    setCustomers(prev => prev.filter(x => x.id !== id));
    addActivityLog("Customer Deleted", id);
  };

  // ─── Blog CRUD ───────────────────────────────────────────────────────────────
  const addBlogPost = async (p: Omit<BlogPost, "id">) => {
    const created = await blogApi.create(p);
    setBlogPosts(prev => [...prev, created]);
    addActivityLog("Blog Post Created", created.title);
    return created;
  };

  const updateBlogPost = async (id: string, p: Partial<Omit<BlogPost, "id">>) => {
    const updated = await blogApi.update(id, p);
    setBlogPosts(prev => prev.map(x => (x.id === id ? updated : x)));
    addActivityLog("Blog Post Updated", updated.title);
    return updated;
  };

  const deleteBlogPost = async (id: string) => {
    await blogApi.remove(id);
    setBlogPosts(prev => prev.filter(x => x.id !== id));
    addActivityLog("Blog Post Deleted", id);
  };

  // ─── Waitlist CRUD ───────────────────────────────────────────────────────────
  const addWaitlistEntry = async (w: Omit<WaitlistEntry, "id">) => {
    const created = await waitlistApi.create(w);
    setWaitlistEntries(prev => [...prev, created]);
    addActivityLog("Waitlist Entry Added", created.name);
    return created;
  };

  const deleteWaitlistEntry = async (id: string) => {
    await waitlistApi.remove(id);
    setWaitlistEntries(prev => prev.filter(x => x.id !== id));
    addActivityLog("Waitlist Entry Removed", id);
  };

  // ─── Testimonial CRUD ────────────────────────────────────────────────────────
  const addTestimonial = async (t: Omit<Testimonial, "id">) => {
    const created = await testimonialsApi.create(t as any) as Testimonial;
    setTestimonials(prev => [...prev, created]);
    addActivityLog("Testimonial Added", created.author);
    return created;
  };

  const updateTestimonial = async (id: string, t: Partial<Omit<Testimonial, "id">>) => {
    const updated = await testimonialsApi.update(id, t as any) as Testimonial;
    setTestimonials(prev => prev.map(x => (x.id === id ? updated : x)));
    addActivityLog("Testimonial Updated", updated.author);
    return updated;
  };

  const deleteTestimonial = async (id: string) => {
    await testimonialsApi.remove(id);
    setTestimonials(prev => prev.filter(x => x.id !== id));
    addActivityLog("Testimonial Deleted", id);
  };

  // ─── Local-only CRUD ────────────────────────────────────────────────────────
  // ─── Contact Message CRUD ──────────────────────────────────────────────────
  const addContactMessage = async (m: Omit<ContactMessage, "id" | "createdAt" | "read" | "replied">) => {
    const created = await contactMessagesApi.create(m);
    setContactMessages(prev => [...prev, created]);
    addActivityLog("New Contact Message", m.subject);
    return created;
  };

  const updateContactMessage = async (id: string, m: Partial<Omit<ContactMessage, "id" | "createdAt">>) => {
    const updated = await contactMessagesApi.update(id, m);
    setContactMessages(prev => prev.map(x => (x.id === id ? updated : x)));
    return updated;
  };

  const deleteContactMessage = async (id: string) => {
    await contactMessagesApi.remove(id);
    setContactMessages(prev => prev.filter(x => x.id !== id));
    addActivityLog("Message Deleted", id);
  };

  // ─── Gallery CRUD ────────────────────────────────────────────────────────
  const addGalleryImage = async (img: Omit<GalleryImage, "id">) => {
    const created = await galleryImagesApi.create(img);
    setGalleryImages(prev => [...prev, created]);
    addActivityLog("Gallery Image Added", created.alt);
    return created;
  };

  const updateGalleryImage = async (id: string, img: Partial<Omit<GalleryImage, "id">>) => {
    const updated = await galleryImagesApi.update(id, img);
    setGalleryImages(prev => prev.map(x => (x.id === id ? updated : x)));
    return updated;
  };

  const deleteGalleryImage = async (id: string) => {
    await galleryImagesApi.remove(id);
    setGalleryImages(prev => prev.filter(x => x.id !== id));
    addActivityLog("Gallery Image Deleted", id);
  };

  const addBeforeAfterPair = async (pair: Omit<BeforeAfterPair, "id">) => {
    const created = await beforeAfterApi.create(pair);
    setBeforeAfterPairs(prev => [...prev, created]);
    addActivityLog("Before/After Pair Added", created.title);
    return created;
  };

  const updateBeforeAfterPair = async (id: string, pair: Partial<Omit<BeforeAfterPair, "id">>) => {
    const updated = await beforeAfterApi.update(id, pair);
    setBeforeAfterPairs(prev => prev.map(x => (x.id === id ? updated : x)));
    return updated;
  };

  const deleteBeforeAfterPair = async (id: string) => {
    await beforeAfterApi.remove(id);
    setBeforeAfterPairs(prev => prev.filter(x => x.id !== id));
    addActivityLog("Before/After Pair Deleted", id);
  };

  // ─── Local-only CRUD ────────────────────────────────────────────────────────

  const addNewsletterSubscriber = async (email: string) => {
    const created = await subscribersApi.create(email);
    setNewsletterSubscribers(prev => {
      if (prev.find(s => s.id === created.id)) return prev;
      return [...prev, created];
    });
    addActivityLog("Newsletter Subscriber", email);
    return created;
  };

  const updateNewsletterSubscriber = async (s: NewsletterSubscriber) => {
    const updated = await subscribersApi.update(s.id, s.active);
    setNewsletterSubscribers(prev => prev.map(x => (x.id === updated.id ? updated : x)));
    return updated;
  };

  const deleteNewsletterSubscriber = async (id: string) => {
    await subscribersApi.remove(id);
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
        staff,
        customers,
        blogPosts,
        waitlistEntries,
        testimonials,
        contactMessages,
        newsletterSubscribers,
        revenueEntries,
        activityLogs,
        galleryImages,
        beforeAfterPairs,
        servicesLoading,
        productsLoading,
        bookingsLoading,
        staffLoading,
        customersLoading,
        blogLoading,
        waitlistLoading,
        testimonialsLoading,
        contactMessagesLoading,
        galleryLoading,
        subscribersLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        addService,
        updateService,
        deleteService,
        addBooking,
        updateBooking,
        deleteBooking,
        addStaff,
        updateStaff,
        deleteStaff,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addWaitlistEntry,
        deleteWaitlistEntry,
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
        addGalleryImage,
        updateGalleryImage,
        deleteGalleryImage,
        addBeforeAfterPair,
        updateBeforeAfterPair,
        deleteBeforeAfterPair,
        addActivityLog,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

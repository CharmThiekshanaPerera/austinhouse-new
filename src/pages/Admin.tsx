import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, ArrowLeft, Package, Scissors, CalendarDays, Check, XCircle, Clock } from "lucide-react";
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from "date-fns";
import { useData, Product, Service, Booking } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ADMIN_PASSWORD = "admin123";

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      onLogin();
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl text-foreground">Admin Panel</CardTitle>
          <p className="text-muted-foreground font-body text-sm">Enter password to continue</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="bg-background"
            />
            {error && <p className="text-destructive text-sm font-body">{error}</p>}
            <Button type="submit" className="w-full bg-gold-gradient text-primary-foreground font-body font-bold uppercase tracking-wider">
              Login
            </Button>
            <div className="text-center">
              <Link to="/" className="text-gold hover:text-gold-light font-body text-sm transition-colors">
                ← Back to Site
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const emptyProduct = { image: "", name: "", category: "", price: "", priceNum: 0, description: "" };
const emptyService = { image: "", title: "", duration: "", price: "", rating: 5.0, description: "", benefits: ["", "", "", ""] };

const ProductForm = ({ initial, onSave, onCancel }: { initial?: Product; onSave: (data: Omit<Product, "id"> & { id?: string }) => void; onCancel: () => void }) => {
  const [form, setForm] = useState(initial || emptyProduct);
  const set = (key: string, val: string | number) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-3">
      <Input placeholder="Product Name" value={form.name} onChange={e => set("name", e.target.value)} className="bg-background" />
      <Input placeholder="Category" value={form.category} onChange={e => set("category", e.target.value)} className="bg-background" />
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Price (e.g. LKR 8,500)" value={form.price} onChange={e => set("price", e.target.value)} className="bg-background" />
        <Input type="number" placeholder="Price Number" value={form.priceNum || ""} onChange={e => set("priceNum", Number(e.target.value))} className="bg-background" />
      </div>
      <Input placeholder="Image URL" value={form.image} onChange={e => set("image", e.target.value)} className="bg-background" />
      <Textarea placeholder="Description" value={form.description} onChange={e => set("description", e.target.value)} className="bg-background" rows={3} />
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
          {initial ? "Update" : "Add"} Product
        </Button>
        <Button variant="outline" onClick={onCancel} className="font-body text-xs uppercase tracking-wider">Cancel</Button>
      </div>
    </div>
  );
};

const ServiceForm = ({ initial, onSave, onCancel }: { initial?: Service; onSave: (data: Omit<Service, "id"> & { id?: string }) => void; onCancel: () => void }) => {
  const [form, setForm] = useState(initial || emptyService);
  const set = (key: string, val: string | number | string[]) => setForm(prev => ({ ...prev, [key]: val }));

  const updateBenefit = (index: number, val: string) => {
    const newBenefits = [...form.benefits];
    newBenefits[index] = val;
    set("benefits", newBenefits);
  };

  return (
    <div className="space-y-3">
      <Input placeholder="Service Title" value={form.title} onChange={e => set("title", e.target.value)} className="bg-background" />
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Duration (e.g. 90 min)" value={form.duration} onChange={e => set("duration", e.target.value)} className="bg-background" />
        <Input placeholder="Price (e.g. LKR 12,500)" value={form.price} onChange={e => set("price", e.target.value)} className="bg-background" />
      </div>
      <Input type="number" step="0.1" placeholder="Rating (1-5)" value={form.rating || ""} onChange={e => set("rating", Number(e.target.value))} className="bg-background" />
      <Input placeholder="Image URL" value={form.image} onChange={e => set("image", e.target.value)} className="bg-background" />
      <Textarea placeholder="Description" value={form.description} onChange={e => set("description", e.target.value)} className="bg-background" rows={3} />
      <p className="text-xs text-muted-foreground font-body">Benefits (up to 4):</p>
      {form.benefits.map((b, i) => (
        <Input key={i} placeholder={`Benefit ${i + 1}`} value={b} onChange={e => updateBenefit(i, e.target.value)} className="bg-background" />
      ))}
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
          {initial ? "Update" : "Add"} Service
        </Button>
        <Button variant="outline" onClick={onCancel} className="font-body text-xs uppercase tracking-wider">Cancel</Button>
      </div>
    </div>
  );
};

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  confirmed: { label: "Confirmed", icon: Check, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  completed: { label: "Completed", icon: Check, className: "bg-primary/10 text-primary border-primary/20" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const BookingCalendar = ({ bookings, onStatusChange, onDelete }: {
  bookings: Booking[];
  onStatusChange: (b: Booking, status: Booking["status"]) => void;
  onDelete: (b: Booking) => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const getBookingsForDate = (date: Date) =>
    bookings.filter(b => b.date && isSameDay(parseISO(b.date), date));

  const selectedBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  const prevMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  return (
    <div className="space-y-6">
      {/* Calendar Grid */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={prevMonth} className="text-muted-foreground">←</Button>
            <CardTitle className="font-display text-lg">{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <Button variant="ghost" size="sm" onClick={nextMonth} className="text-muted-foreground">→</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-xs font-body text-muted-foreground py-2 font-semibold">{d}</div>
            ))}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map(day => {
              const dayBookings = getBookingsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative p-2 rounded-lg text-sm font-body transition-all min-h-[48px] flex flex-col items-center justify-start gap-0.5",
                    isToday(day) && "ring-1 ring-primary",
                    isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                    dayBookings.length > 0 && !isSelected && "bg-accent/50"
                  )}
                >
                  <span>{format(day, "d")}</span>
                  {dayBookings.length > 0 && (
                    <span className={cn(
                      "text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center",
                      isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/20 text-primary"
                    )}>
                      {dayBookings.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Bookings */}
      {selectedDate && (
        <div>
          <h3 className="font-display text-lg text-foreground mb-4">
            Bookings for {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h3>
          {selectedBookings.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm">No bookings for this date.</p>
          ) : (
            <div className="grid gap-3">
              {selectedBookings.map(b => {
                const config = statusConfig[b.status];
                return (
                  <Card key={b.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-display text-base font-semibold text-foreground">{b.treatment}</h4>
                            <Badge variant="outline" className={cn("text-xs font-body", config.className)}>
                              <config.icon size={12} className="mr-1" />{config.label}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground font-body text-sm">
                            {b.name} · {b.phone} · {b.timeSlot}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0 flex-wrap">
                          {b.status === "pending" && (
                            <Button size="sm" variant="outline" onClick={() => onStatusChange(b, "confirmed")} className="text-xs">
                              <Check size={14} className="mr-1" /> Confirm
                            </Button>
                          )}
                          {b.status === "confirmed" && (
                            <Button size="sm" variant="outline" onClick={() => onStatusChange(b, "completed")} className="text-xs">
                              <Check size={14} className="mr-1" /> Complete
                            </Button>
                          )}
                          {(b.status === "pending" || b.status === "confirmed") && (
                            <Button size="sm" variant="outline" onClick={() => onStatusChange(b, "cancelled")} className="text-xs text-destructive">
                              <XCircle size={14} className="mr-1" /> Cancel
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => onDelete(b)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* All Bookings List */}
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">All Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-muted-foreground font-body text-sm">No bookings yet. Bookings made through the site will appear here.</p>
        ) : (
          <div className="grid gap-3">
            {bookings
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(b => {
                const config = statusConfig[b.status];
                return (
                  <Card key={b.id} className="border-border">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-display text-sm font-semibold text-foreground">{b.treatment}</h4>
                          <Badge variant="outline" className={cn("text-xs font-body", config.className)}>
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground font-body text-xs mt-1">
                          {b.name} · {b.phone} · {b.date ? format(parseISO(b.date), "MMM d, yyyy") : "No date"} · {b.timeSlot}
                        </p>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(b)} className="flex-shrink-0">
                        <Trash2 size={14} />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

const Admin = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const [tab, setTab] = useState<"products" | "services" | "bookings">("products");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { products, services, bookings, addProduct, updateProduct, deleteProduct, addService, updateService, deleteService, updateBooking, deleteBooking } = useData();

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  };

  const handleSaveProduct = (data: Omit<Product, "id"> & { id?: string }) => {
    if (!data.name || !data.price) { toast({ title: "Error", description: "Name and price are required.", variant: "destructive" }); return; }
    if (data.id) { updateProduct(data as Product); toast({ title: "Updated ✨", description: `${data.name} has been updated.` }); }
    else { addProduct(data); toast({ title: "Added ✨", description: `${data.name} has been added.` }); }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSaveService = (data: Omit<Service, "id"> & { id?: string }) => {
    if (!data.title || !data.price) { toast({ title: "Error", description: "Title and price are required.", variant: "destructive" }); return; }
    const cleaned = { ...data, benefits: data.benefits.filter(b => b.trim() !== "") };
    if (data.id) { updateService(cleaned as Service); toast({ title: "Updated ✨", description: `${data.title} has been updated.` }); }
    else { addService(cleaned); toast({ title: "Added ✨", description: `${data.title} has been added.` }); }
    setShowForm(false);
    setEditingService(null);
  };

  const handleDeleteProduct = (p: Product) => {
    deleteProduct(p.id);
    toast({ title: "Deleted", description: `${p.name} has been removed.` });
  };

  const handleDeleteService = (s: Service) => {
    deleteService(s.id);
    toast({ title: "Deleted", description: `${s.title} has been removed.` });
  };

  const handleBookingStatusChange = (b: Booking, status: Booking["status"]) => {
    updateBooking({ ...b, status });
    toast({ title: "Updated", description: `Booking status changed to ${status}.` });
  };

  const handleDeleteBooking = (b: Booking) => {
    deleteBooking(b.id);
    toast({ title: "Deleted", description: `Booking for ${b.name} has been removed.` });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-charcoal border-b border-border sticky top-0 z-30">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gold hover:text-gold-light transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-display text-xl text-cream font-bold">Admin Panel</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-cream/60 hover:text-cream font-body text-sm">
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { key: "products" as const, icon: Package, label: "Products", count: products.length },
            { key: "services" as const, icon: Scissors, label: "Services", count: services.length },
            { key: "bookings" as const, icon: CalendarDays, label: "Bookings", count: bookings.length },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setShowForm(false); setEditingProduct(null); setEditingService(null); }}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-body text-sm font-bold uppercase tracking-wider transition-all",
                tab === t.key ? "bg-gold-gradient text-primary-foreground shadow-gold" : "bg-card text-muted-foreground hover:text-foreground border border-border"
              )}
            >
              <t.icon size={16} /> {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Add Button (products/services only) */}
        {tab !== "bookings" && !showForm && !editingProduct && !editingService && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-6 bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider"
          >
            <Plus size={16} className="mr-2" /> Add {tab === "products" ? "Product" : "Service"}
          </Button>
        )}

        {/* Product Form */}
        {tab === "products" && (showForm || editingProduct) && (
          <Card className="mb-8 border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm
                initial={editingProduct || undefined}
                onSave={handleSaveProduct}
                onCancel={() => { setShowForm(false); setEditingProduct(null); }}
              />
            </CardContent>
          </Card>
        )}

        {/* Service Form */}
        {tab === "services" && (showForm || editingService) && (
          <Card className="mb-8 border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">{editingService ? "Edit Service" : "Add New Service"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceForm
                initial={editingService || undefined}
                onSave={handleSaveService}
                onCancel={() => { setShowForm(false); setEditingService(null); }}
              />
            </CardContent>
          </Card>
        )}

        {/* Product List */}
        {tab === "products" && (
          <div className="grid gap-4">
            {products.map(p => (
              <Card key={p.id} className="border-border">
                <CardContent className="p-4 flex items-center gap-4">
                  {p.image && <img src={p.image} alt={p.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold text-foreground truncate">{p.name}</h3>
                    <p className="text-muted-foreground font-body text-xs">{p.category} · {p.price}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => { setEditingProduct(p); setShowForm(false); }}><Pencil size={14} /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(p)}><Trash2 size={14} /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Service List */}
        {tab === "services" && (
          <div className="grid gap-4">
            {services.map(s => (
              <Card key={s.id} className="border-border">
                <CardContent className="p-4 flex items-center gap-4">
                  {s.image && <img src={s.image} alt={s.title} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold text-foreground truncate">{s.title}</h3>
                    <p className="text-muted-foreground font-body text-xs">{s.duration} · {s.price} · ⭐ {s.rating}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => { setEditingService(s); setShowForm(false); }}><Pencil size={14} /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteService(s)}><Trash2 size={14} /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bookings Calendar */}
        {tab === "bookings" && (
          <BookingCalendar
            bookings={bookings}
            onStatusChange={handleBookingStatusChange}
            onDelete={handleDeleteBooking}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;

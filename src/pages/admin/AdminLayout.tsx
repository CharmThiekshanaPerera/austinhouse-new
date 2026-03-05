import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, Scissors, CalendarDays, FileText, Star,
  Mail, Users, DollarSign, BarChart3, Settings, LogOut, Menu, X, ChevronLeft, Share2, Search,
  Heart, Boxes, UserCog, Percent, Contact, FileDown, CreditCard, Clock, MailOpen, Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ADMIN_PASSWORD = "admin123";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { path: "/admin/products", icon: Package, label: "Products" },
  { path: "/admin/services", icon: Scissors, label: "Services" },
  { path: "/admin/bookings", icon: CalendarDays, label: "Bookings" },
  { path: "/admin/blog", icon: FileText, label: "Blog Posts" },
  { path: "/admin/testimonials", icon: Star, label: "Testimonials" },
  { path: "/admin/messages", icon: Mail, label: "Messages" },
  { path: "/admin/newsletter", icon: Users, label: "Newsletter" },
  { path: "/admin/social", icon: Share2, label: "Social Automation" },
  { path: "/admin/revenue", icon: DollarSign, label: "Revenue", hidden: true },
  { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/admin/seo", icon: Search, label: "SEO & Performance" },
  { path: "/admin/loyalty", icon: Heart, label: "Loyalty Program", hidden: true },
  { path: "/admin/inventory", icon: Boxes, label: "Inventory" },
  { path: "/admin/staff", icon: UserCog, label: "Staff Scheduling" },
  { path: "/admin/promotions", icon: Percent, label: "Promotions", hidden: true },
  { path: "/admin/customers", icon: Contact, label: "Customer CRM" },
  { path: "/admin/reports", icon: FileDown, label: "Reports & Export", hidden: true },
  { path: "/admin/gift-cards", icon: CreditCard, label: "Gift Cards", hidden: true },
  { path: "/admin/waitlist", icon: Clock, label: "Waitlist" },
  { path: "/admin/email-templates", icon: MailOpen, label: "Email Templates", hidden: true },
  { path: "/admin/expenses", icon: Receipt, label: "Expenses" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

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
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8">
        <h1 className="font-display text-2xl text-foreground text-center mb-1">Admin Panel</h1>
        <p className="text-muted-foreground font-body text-sm text-center mb-6">Enter password to continue</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && <p className="text-destructive text-sm font-body">{error}</p>}
          <Button type="submit" className="w-full bg-gold-gradient text-primary-foreground font-body font-bold uppercase tracking-wider">
            Login
          </Button>
          <div className="text-center">
            <Link to="/" className="text-gold hover:text-gold-light font-body text-sm transition-colors">← Back to Site</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  };

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path) && (path !== "/admin" || location.pathname === "/admin");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full bg-charcoal border-r border-border z-50 transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-16",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
          {sidebarOpen && <h1 className="font-display text-lg text-cream font-bold truncate">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md text-cream/60 hover:text-cream hover:bg-white/5 transition-colors"
          >
            <ChevronLeft size={18} className={cn("transition-transform", !sidebarOpen && "rotate-180")} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.filter((item) => !item.hidden).map(item => {
            const active = isActive(item.path, item.exact);
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-all",
                  active
                    ? "bg-gold/20 text-gold font-semibold"
                    : "text-cream/60 hover:text-cream hover:bg-white/5"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-cream/40 hover:text-destructive hover:bg-destructive/10 transition-all"
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-16"
      )}>
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border sticky top-0 z-30 flex items-center px-4 gap-4">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gold hover:text-gold-light transition-colors font-body text-sm">
              ← Back to Site
            </Link>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, Scissors, CalendarDays, FileText, Star,
  Mail, Users, DollarSign, BarChart3, Settings, LogOut, Menu, ChevronLeft, Share2, Search,
  Heart, Boxes, UserCog, Percent, Contact, FileDown, CreditCard, Clock, MailOpen, Receipt, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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

// ── Login Form ─────────────────────────────────────────────────────────────────
const AdminLoginForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch {
      setError("Incorrect username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8">
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl text-foreground mb-1">Admin Panel</h1>
          <p className="text-muted-foreground font-body text-sm">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              autoComplete="username"
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {error && (
            <p className="text-destructive text-sm font-body bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-gradient text-primary-foreground font-body font-bold uppercase tracking-wider"
          >
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            {loading ? "Signing in…" : "Sign In"}
          </Button>
          <div className="text-center">
            <Link to="/" className="text-gold hover:text-gold-light font-body text-sm transition-colors">
              ← Back to Site
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Admin Layout ───────────────────────────────────────────────────────────────
const AdminLayout = () => {
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Show a full-screen spinner while validating the stored token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  // Not authenticated → show login form
  if (!user) return <AdminLoginForm />;

  const isActive = (path: string, exact?: boolean) =>
    exact
      ? location.pathname === path
      : location.pathname.startsWith(path) && (path !== "/admin" || location.pathname === "/admin");

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

        {/* User badge */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-border/30">
            <p className="text-xs font-body text-cream/40 uppercase tracking-wider">Logged in as</p>
            <p className="text-sm font-body font-semibold text-cream/90 truncate">{user.username}</p>
            <span className="text-[10px] font-body text-gold bg-gold/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        )}

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
            onClick={logout}
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

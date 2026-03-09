import { Package, Scissors, CalendarDays, Mail, Star, Clock, Users, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";
import { format, isToday, parseISO } from "date-fns";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const statusConfig = {
  Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const Dashboard = () => {
  const {
    products, services, bookings, contactMessages, testimonials,
    staff, customers, waitlistEntries,
  } = useData();

  const unreadMessages = contactMessages.filter(m => !m.read).length;
  const pendingBookings = bookings.filter(b => b.status === "Pending").length;
  const todayBookings = bookings.filter(b => b.date && isToday(parseISO(b.date)));

  const kpis = [
    { label: "Services", value: services.length, icon: Scissors, color: "text-emerald-500" },
    { label: "Products", value: products.length, icon: Package, color: "text-blue-500" },
    { label: "Bookings", value: bookings.length, sub: `${pendingBookings} pending`, icon: CalendarDays, color: "text-amber-500" },
    { label: "Staff", value: staff.length, icon: UserCog, color: "text-violet-500" },
    { label: "Customers", value: customers.length, icon: Users, color: "text-pink-500" },
    { label: "Waitlist", value: waitlistEntries.length, icon: Clock, color: "text-orange-500" },
    { label: "Testimonials", value: testimonials.length, icon: Star, color: "text-yellow-500" },
    { label: "Messages", value: contactMessages.length, sub: `${unreadMessages} unread`, icon: Mail, color: "text-indigo-500" },
  ];

  // Booking status breakdown for pie chart — use correct title-case keys
  const statusCounts = [
    { name: "Pending", value: bookings.filter(b => b.status === "Pending").length, color: "#f59e0b" },
    { name: "Confirmed", value: bookings.filter(b => b.status === "Confirmed").length, color: "#3b82f6" },
    { name: "Completed", value: bookings.filter(b => b.status === "Completed").length, color: "#10b981" },
    { name: "Cancelled", value: bookings.filter(b => b.status === "Cancelled").length, color: "#ef4444" },
  ].filter(s => s.value > 0);

  // Resolve service name from id
  const serviceMap = Object.fromEntries(services.map(s => [s.id, s.title]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl text-foreground font-bold">Dashboard</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">Overview of your business at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon size={16} className={kpi.color} />
                <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{kpi.value}</p>
              {kpi.sub && <p className="text-xs text-muted-foreground font-body mt-0.5">{kpi.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Booking Status Pie */}
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-base">Booking Status Breakdown</CardTitle></CardHeader>
          <CardContent>
            {statusCounts.length > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={statusCounts} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                      {statusCounts.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {statusCounts.map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                      <span className="text-sm font-body text-muted-foreground">{s.name}: {s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground font-body text-sm py-10 text-center">No bookings yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Today's Bookings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-base">
              Today's Bookings
              <span className="ml-2 text-sm font-body text-muted-foreground font-normal">
                {format(new Date(), "EEEE, MMM d")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayBookings.length === 0 ? (
              <p className="text-muted-foreground font-body text-sm py-8 text-center">No bookings scheduled for today.</p>
            ) : (
              <div className="space-y-3 max-h-[220px] overflow-y-auto">
                {[...todayBookings].sort((a, b) => (a.time ?? "").localeCompare(b.time ?? "")).map(b => (
                  <div key={b.id} className="flex items-center gap-3">
                    <div className="w-12 text-xs font-body text-muted-foreground text-right flex-shrink-0">{b.time}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-foreground truncate">{b.customer_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{serviceMap[b.service_id] ?? b.service_id}</p>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] font-body flex-shrink-0", statusConfig[b.status])}>
                      {b.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings (next 7 days) */}
      <Card className="border-border">
        <CardHeader><CardTitle className="font-display text-base">Upcoming Bookings (Next 7 Days)</CardTitle></CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm">No bookings yet.</p>
          ) : (() => {
            const now = new Date();
            const upcoming = [...bookings]
              .filter(b => {
                if (!b.date) return false;
                const d = parseISO(b.date);
                const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                return diff >= 0 && diff <= 7 && b.status !== "Cancelled";
              })
              .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "") || (a.time ?? "").localeCompare(b.time ?? ""));

            if (upcoming.length === 0) return (
              <p className="text-muted-foreground font-body text-sm">No upcoming bookings in the next 7 days.</p>
            );

            return (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {upcoming.map(b => (
                  <div key={b.id} className="flex items-center gap-3">
                    <div className="w-20 text-xs font-body text-muted-foreground flex-shrink-0">
                      {b.date ? format(parseISO(b.date), "EEE, MMM d") : "—"}
                    </div>
                    <div className="w-14 text-xs font-body text-muted-foreground flex-shrink-0">{b.time}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-foreground truncate">{b.customer_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{serviceMap[b.service_id] ?? b.service_id}</p>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] font-body flex-shrink-0", statusConfig[b.status])}>
                      {b.status}
                    </Badge>
                  </div>
                ))}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

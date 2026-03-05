import { Package, Scissors, CalendarDays, Mail, Star, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { format } from "date-fns";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { products, services, bookings, contactMessages, testimonials, activityLogs } = useData();

  const unreadMessages = contactMessages.filter(m => !m.read).length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;

  const kpis = [
    { label: "Products", value: products.length, icon: Package, color: "text-blue-500" },
    { label: "Services", value: services.length, icon: Scissors, color: "text-emerald-500" },
    { label: "Bookings", value: bookings.length, sub: `${pendingBookings} pending`, icon: CalendarDays, color: "text-amber-500" },
    { label: "Messages", value: contactMessages.length, sub: `${unreadMessages} unread`, icon: Mail, color: "text-violet-500" },
    { label: "Testimonials", value: testimonials.length, icon: Star, color: "text-yellow-500" },
  ];

  // Booking status breakdown for pie chart
  const statusCounts = [
    { name: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "#f59e0b" },
    { name: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, color: "#3b82f6" },
    { name: "Completed", value: bookings.filter(b => b.status === "completed").length, color: "#10b981" },
    { name: "Cancelled", value: bookings.filter(b => b.status === "cancelled").length, color: "#ef4444" },
  ].filter(s => s.value > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl text-foreground font-bold">Dashboard</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">Overview of your business at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
          <CardHeader><CardTitle className="font-display text-base">Booking Status</CardTitle></CardHeader>
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
      </div>

      {/* Recent Activity */}
      <Card className="border-border">
        <CardHeader><CardTitle className="font-display text-base">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          {activityLogs.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm">No activity yet.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {activityLogs.slice(0, 15).map(log => (
                <div key={log.id} className="flex items-start gap-3 text-sm font-body">
                  <Clock size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-foreground">{log.action}</span>
                    <span className="text-muted-foreground ml-1">— {log.detail}</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {format(new Date(log.timestamp), "MMM d, HH:mm")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

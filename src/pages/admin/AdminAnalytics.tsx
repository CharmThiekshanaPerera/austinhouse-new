import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

const AdminAnalytics = () => {
  const { bookings, contactMessages, revenueEntries } = useData();
  const [range, setRange] = useState<7 | 30 | 90>(30);

  const cutoff = subDays(new Date(), range);
  const recentBookings = bookings.filter(b => isAfter(new Date(b.createdAt), cutoff));
  const recentMessages = contactMessages.filter(m => isAfter(new Date(m.createdAt), cutoff));
  const recentRevenue = revenueEntries.filter(r => isAfter(new Date(r.date), cutoff) && r.status === "paid");

  const totalLeads = recentMessages.length + recentBookings.length;
  const totalRevenueAmt = recentRevenue.reduce((s, r) => s + r.amount, 0);

  // Booking status breakdown
  const statusData = [
    { name: "Pending", value: recentBookings.filter(b => b.status === "pending").length, color: "#f59e0b" },
    { name: "Confirmed", value: recentBookings.filter(b => b.status === "confirmed").length, color: "#3b82f6" },
    { name: "Completed", value: recentBookings.filter(b => b.status === "completed").length, color: "#10b981" },
    { name: "Cancelled", value: recentBookings.filter(b => b.status === "cancelled").length, color: "#ef4444" },
  ].filter(s => s.value > 0);

  // Message response breakdown
  const msgStatus = [
    { name: "Unread", value: recentMessages.filter(m => !m.read).length, color: "#3b82f6" },
    { name: "Read", value: recentMessages.filter(m => m.read && !m.replied).length, color: "#f59e0b" },
    { name: "Replied", value: recentMessages.filter(m => m.replied).length, color: "#10b981" },
  ].filter(s => s.value > 0);

  // Conversion funnel
  const funnelSteps = [
    { label: "Contact Messages", value: recentMessages.length },
    { label: "Bookings Made", value: recentBookings.length },
    { label: "Completed", value: recentBookings.filter(b => b.status === "completed").length },
  ];
  const maxFunnel = Math.max(...funnelSteps.map(f => f.value), 1);

  // Top treatments
  const treatmentCounts: Record<string, number> = {};
  recentBookings.forEach(b => { treatmentCounts[b.treatment] = (treatmentCounts[b.treatment] || 0) + 1; });
  const topTreatments = Object.entries(treatmentCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxTreatment = Math.max(...topTreatments.map(t => t[1]), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Analytics</h1>
          <p className="text-muted-foreground font-body text-sm">Lead generation & conversion insights</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map(d => (
            <Button
              key={d}
              variant={range === d ? "default" : "outline"}
              size="sm"
              onClick={() => setRange(d as 7 | 30 | 90)}
              className="font-body text-xs"
            >
              {d}D
            </Button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: totalLeads },
          { label: "Bookings", value: recentBookings.length },
          { label: "Messages", value: recentMessages.length },
          { label: "Revenue", value: `LKR ${(totalRevenueAmt / 1000).toFixed(0)}K` },
        ].map(kpi => (
          <Card key={kpi.label} className="border-border">
            <CardContent className="p-4">
              <p className="text-xs font-body text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
              <p className="font-display text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversion Funnel */}
      <Card className="border-border">
        <CardHeader><CardTitle className="font-display text-base">Conversion Funnel</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {funnelSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-4">
              <span className="text-sm font-body text-muted-foreground w-40 flex-shrink-0">{step.label}</span>
              <div className="flex-1 bg-accent rounded-full h-8 overflow-hidden">
                <div
                  className="h-full bg-primary/60 rounded-full flex items-center justify-end pr-3 transition-all"
                  style={{ width: `${Math.max((step.value / maxFunnel) * 100, 8)}%` }}
                >
                  <span className="text-xs font-bold text-primary-foreground">{step.value}</span>
                </div>
              </div>
              {i < funnelSteps.length - 1 && funnelSteps[i].value > 0 && (
                <span className="text-xs text-muted-foreground font-body w-16 text-right">
                  {((funnelSteps[i + 1].value / funnelSteps[i].value) * 100).toFixed(0)}%
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Booking Status */}
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-base">Booking Status</CardTitle></CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={4}>
                      {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {statusData.map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                      <span className="text-sm font-body text-muted-foreground">{s.name}: {s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : <p className="text-muted-foreground text-sm text-center py-10">No data</p>}
          </CardContent>
        </Card>

        {/* Message Response */}
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-base">Message Response</CardTitle></CardHeader>
          <CardContent>
            {msgStatus.length > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={msgStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={4}>
                      {msgStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {msgStatus.map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                      <span className="text-sm font-body text-muted-foreground">{s.name}: {s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : <p className="text-muted-foreground text-sm text-center py-10">No data</p>}
          </CardContent>
        </Card>
      </div>

      {/* Top Treatments */}
      <Card className="border-border">
        <CardHeader><CardTitle className="font-display text-base">Popular Treatments</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {topTreatments.length > 0 ? topTreatments.map(([name, count]) => (
            <div key={name} className="flex items-center gap-4">
              <span className="text-sm font-body text-foreground w-48 truncate flex-shrink-0">{name}</span>
              <div className="flex-1 bg-accent rounded-full h-6 overflow-hidden">
                <div className="h-full bg-primary/40 rounded-full" style={{ width: `${(count / maxTreatment) * 100}%` }} />
              </div>
              <span className="text-sm font-body text-muted-foreground font-bold w-8 text-right">{count}</span>
            </div>
          )) : <p className="text-muted-foreground text-sm text-center py-6">No bookings in this period.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;

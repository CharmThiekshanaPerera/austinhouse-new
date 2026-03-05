import { useState } from "react";
import { Plus, Pencil, Trash2, Download, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { useData, RevenueEntry } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const emptyEntry: Omit<RevenueEntry, "id" | "createdAt"> = { description: "", customerName: "", amount: 0, date: "", status: "paid", recurring: false, interval: undefined, notes: "" };

const AdminRevenue = () => {
  const { revenueEntries, addRevenueEntry, updateRevenueEntry, deleteRevenueEntry } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<RevenueEntry | null>(null);
  const [form, setForm] = useState(emptyEntry);

  const set = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  const totalRevenue = revenueEntries.filter(r => r.status === "paid").reduce((s, r) => s + r.amount, 0);
  const mrr = revenueEntries.filter(r => r.recurring && r.status === "paid" && r.interval === "monthly").reduce((s, r) => s + r.amount, 0);
  const totalSales = revenueEntries.filter(r => r.status === "paid").length;

  const openEdit = (r: RevenueEntry) => {
    setEditing(r);
    setForm({ description: r.description, customerName: r.customerName, amount: r.amount, date: r.date, status: r.status, recurring: r.recurring, interval: r.interval, notes: r.notes });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.description || !form.amount) { toast({ title: "Error", description: "Description and amount required.", variant: "destructive" }); return; }
    if (editing) {
      updateRevenueEntry({ ...editing, ...form });
      toast({ title: "Updated ✨" });
    } else {
      addRevenueEntry(form);
      toast({ title: "Added ✨", description: `LKR ${form.amount.toLocaleString()} recorded.` });
    }
    setShowForm(false); setEditing(null); setForm(emptyEntry);
  };

  const handleExport = () => {
    const csv = "Description,Customer,Amount,Date,Status,Recurring,Notes\n" + revenueEntries
      .map(r => `"${r.description}","${r.customerName}",${r.amount},${r.date},${r.status},${r.recurring},\"${r.notes}\"`)
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "revenue.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported" });
  };

  const trendData = revenueEntries
    .filter(r => r.status === "paid")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(r => ({ date: format(new Date(r.date), "MMM d"), amount: r.amount }));

  // Group by description for bar chart
  const byDescription: Record<string, number> = {};
  revenueEntries.filter(r => r.status === "paid").forEach(r => { byDescription[r.description] = (byDescription[r.description] || 0) + r.amount; });
  const barData = Object.entries(byDescription).map(([name, amount]) => ({ name: name.length > 15 ? name.slice(0, 15) + "…" : name, amount }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Revenue</h1>
          <p className="text-muted-foreground font-body text-sm">Track sales & financial performance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="font-body text-xs uppercase tracking-wider">
            <Download size={14} className="mr-2" /> Export CSV
          </Button>
          {!showForm && (
            <Button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyEntry); }} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
              <Plus size={16} className="mr-2" /> Add Entry
            </Button>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><DollarSign size={16} className="text-emerald-500" /><span className="text-xs font-body text-muted-foreground uppercase">Total Revenue</span></div>
          <p className="font-display text-2xl font-bold text-foreground">LKR {totalRevenue.toLocaleString()}</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><TrendingUp size={16} className="text-blue-500" /><span className="text-xs font-body text-muted-foreground uppercase">Monthly Recurring</span></div>
          <p className="font-display text-2xl font-bold text-foreground">LKR {mrr.toLocaleString()}</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><BarChart3 size={16} className="text-violet-500" /><span className="text-xs font-body text-muted-foreground uppercase">Total Sales</span></div>
          <p className="font-display text-2xl font-bold text-foreground">{totalSales}</p>
        </CardContent></Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-base">Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trendData}>
                  <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill="url(#areaGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm text-center py-10">No data</p>}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-base">Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm text-center py-10">No data</p>}
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-lg">{editing ? "Edit Entry" : "Add Revenue Entry"}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Description (e.g. Gold Facial)" value={form.description} onChange={e => set("description", e.target.value)} className="bg-background" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Customer Name" value={form.customerName} onChange={e => set("customerName", e.target.value)} className="bg-background" />
              <Input type="number" placeholder="Amount (LKR)" value={form.amount || ""} onChange={e => set("amount", Number(e.target.value))} className="bg-background" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input type="date" value={form.date} onChange={e => set("date", e.target.value)} className="bg-background" />
              <Select value={form.status} onValueChange={v => set("status", v)}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={form.recurring} onCheckedChange={v => set("recurring", v)} />
                <span className="text-sm font-body text-muted-foreground">Recurring</span>
              </div>
              {form.recurring && (
                <Select value={form.interval || "monthly"} onValueChange={v => set("interval", v)}>
                  <SelectTrigger className="bg-background w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <Textarea placeholder="Notes" value={form.notes} onChange={e => set("notes", e.target.value)} className="bg-background" rows={2} />
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">{editing ? "Update" : "Add"}</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyEntry); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entries list */}
      <div className="grid gap-2">
        {revenueEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(r => (
          <Card key={r.id} className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-sm font-semibold text-foreground">{r.description}</h3>
                  <Badge variant="outline" className={
                    r.status === "paid" ? "text-emerald-500 border-emerald-500/20 text-xs" :
                    r.status === "overdue" ? "text-destructive border-destructive/20 text-xs" :
                    "text-amber-500 border-amber-500/20 text-xs"
                  }>{r.status}</Badge>
                  {r.recurring && <Badge variant="secondary" className="text-[10px]">Recurring</Badge>}
                </div>
                <p className="text-muted-foreground font-body text-xs mt-0.5">{r.customerName} · {r.date ? format(new Date(r.date), "MMM d, yyyy") : "N/A"}</p>
              </div>
              <p className="font-display text-base font-bold text-foreground flex-shrink-0">LKR {r.amount.toLocaleString()}</p>
              <div className="flex gap-1 flex-shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(r)}><Pencil size={14} /></Button>
                <Button size="sm" variant="destructive" onClick={() => { deleteRevenueEntry(r.id); toast({ title: "Deleted" }); }}><Trash2 size={14} /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminRevenue;

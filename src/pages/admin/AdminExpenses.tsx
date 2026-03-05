import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Receipt, Plus, TrendingUp, TrendingDown, DollarSign, Trash2 } from "lucide-react";

const categoryColors: Record<string, string> = {
  "Rent & Utilities": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Products & Supplies": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Staff Payroll": "bg-green-600/20 text-green-400 border-green-600/30",
  Marketing: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  Equipment: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Insurance: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Maintenance: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Other: "bg-muted text-muted-foreground border-border",
};

const budgetData = [
  { category: "Rent & Utilities", budget: 4500, actual: 4500, icon: "🏠" },
  { category: "Products & Supplies", budget: 3200, actual: 3850, icon: "📦" },
  { category: "Staff Payroll", budget: 12000, actual: 11800, icon: "👥" },
  { category: "Marketing", budget: 2000, actual: 1650, icon: "📣" },
  { category: "Equipment", budget: 1500, actual: 2200, icon: "🔧" },
  { category: "Insurance", budget: 800, actual: 800, icon: "🛡️" },
  { category: "Maintenance", budget: 600, actual: 420, icon: "🧹" },
];

const initialExpenses = [
  { id: 1, date: "2026-03-02", description: "Monthly rent — Suite 200", category: "Rent & Utilities", amount: 3200, vendor: "Austin Realty LLC" },
  { id: 2, date: "2026-03-02", description: "Electricity bill", category: "Rent & Utilities", amount: 680, vendor: "Austin Energy" },
  { id: 3, date: "2026-03-01", description: "GlowLab serum restock (24 units)", category: "Products & Supplies", amount: 1440, vendor: "GlowLab Inc." },
  { id: 4, date: "2026-03-01", description: "Instagram ad campaign — March", category: "Marketing", amount: 850, vendor: "Meta Ads" },
  { id: 5, date: "2026-02-28", description: "Staff payroll — Feb cycle 2", category: "Staff Payroll", amount: 6200, vendor: "Internal" },
  { id: 6, date: "2026-02-28", description: "New LED therapy panel", category: "Equipment", amount: 2200, vendor: "DermaDevices Co." },
  { id: 7, date: "2026-02-27", description: "DermaCo cleanser & toner bulk", category: "Products & Supplies", amount: 960, vendor: "DermaCo" },
  { id: 8, date: "2026-02-26", description: "Google Ads — Feb", category: "Marketing", amount: 800, vendor: "Google Ads" },
  { id: 9, date: "2026-02-25", description: "Staff payroll — Feb cycle 1", category: "Staff Payroll", amount: 5600, vendor: "Internal" },
  { id: 10, date: "2026-02-24", description: "HVAC filter replacement", category: "Maintenance", amount: 420, vendor: "CoolAir Services" },
  { id: 11, date: "2026-02-20", description: "Liability insurance — Q1", category: "Insurance", amount: 800, vendor: "StateFarm" },
  { id: 12, date: "2026-02-18", description: "LuxSkin face masks (50 pk)", category: "Products & Supplies", amount: 1450, vendor: "LuxSkin" },
];

const AdminExpenses = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [catFilter, setCatFilter] = useState("all");
  const { toast } = useToast();

  const filtered = catFilter === "all" ? expenses : expenses.filter(e => e.category === catFilter);

  const totalBudget = budgetData.reduce((a, b) => a + b.budget, 0);
  const totalActual = budgetData.reduce((a, b) => a + b.actual, 0);
  const variance = totalBudget - totalActual;

  const deleteExpense = (id: number) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    toast({ title: "Expense Deleted" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Expense Tracking</h1>
          <p className="text-muted-foreground font-body text-sm">Track business expenses and compare against budget</p>
        </div>
        <Button className="font-body gap-1" onClick={() => toast({ title: "Add Expense", description: "Expense form would open here" })}>
          <Plus size={16} /> Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Monthly Budget", value: `$${totalBudget.toLocaleString()}`, icon: DollarSign },
          { label: "Actual Spending", value: `$${totalActual.toLocaleString()}`, icon: Receipt },
          { label: "Variance", value: `${variance >= 0 ? "+" : ""}$${variance.toLocaleString()}`, icon: variance >= 0 ? TrendingDown : TrendingUp, alert: variance < 0 },
          { label: "Transactions (MTD)", value: expenses.filter(e => e.date >= "2026-03-01").length.toString(), icon: Receipt },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.alert ? "bg-destructive/10" : "bg-primary/10"}`}>
                <s.icon size={18} className={s.alert ? "text-destructive" : "text-primary"} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground font-body">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget vs Actual */}
      <Card>
        <CardHeader><CardTitle className="font-display text-lg">Budget vs Actual — March 2026</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {budgetData.map(b => {
            const pct = Math.round((b.actual / b.budget) * 100);
            const over = b.actual > b.budget;
            return (
              <div key={b.category} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{b.icon}</span>
                    <span className="font-body text-sm text-foreground font-medium">{b.category}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-body">
                    <span className="text-muted-foreground">${b.actual.toLocaleString()} / ${b.budget.toLocaleString()}</span>
                    <Badge className={over ? "bg-destructive/20 text-destructive border-destructive/30" : "bg-green-600/20 text-green-400 border-green-600/30"}>
                      {pct}%
                    </Badge>
                  </div>
                </div>
                <Progress value={Math.min(pct, 100)} className={`h-2 ${over ? "[&>div]:bg-destructive" : ""}`} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Expense log */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 flex-wrap gap-3">
          <CardTitle className="font-display text-lg">Expense Log</CardTitle>
          <div className="flex gap-1 flex-wrap">
            <Button size="sm" variant={catFilter === "all" ? "default" : "outline"} className="font-body text-xs" onClick={() => setCatFilter("all")}>All</Button>
            {Object.keys(categoryColors).map(c => (
              <Button key={c} size="sm" variant={catFilter === c ? "default" : "outline"} className="font-body text-xs" onClick={() => setCatFilter(c)}>
                {c}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Date</TableHead>
                <TableHead className="font-body">Description</TableHead>
                <TableHead className="font-body">Category</TableHead>
                <TableHead className="font-body">Vendor</TableHead>
                <TableHead className="font-body text-right">Amount</TableHead>
                <TableHead className="font-body" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-body text-muted-foreground text-sm">{e.date}</TableCell>
                  <TableCell className="font-body text-foreground">{e.description}</TableCell>
                  <TableCell><Badge className={categoryColors[e.category]}>{e.category}</Badge></TableCell>
                  <TableCell className="font-body text-muted-foreground text-sm">{e.vendor}</TableCell>
                  <TableCell className="font-body font-semibold text-foreground text-right">${e.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteExpense(e.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminExpenses;

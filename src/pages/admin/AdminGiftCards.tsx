import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Plus, Search, Gift, DollarSign } from "lucide-react";

const statusMap: Record<string, { label: string; class: string }> = {
  active: { label: "Active", class: "bg-green-600/20 text-green-400 border-green-600/30" },
  redeemed: { label: "Fully Redeemed", class: "bg-muted text-muted-foreground border-border" },
  expired: { label: "Expired", class: "bg-destructive/20 text-destructive border-destructive/30" },
  partial: { label: "Partial", class: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30" },
};

const initialCards = [
  { id: 1, code: "GC-2026-0001", purchaser: "Emma Williams", recipient: "Sarah Johnson", originalValue: 200, balance: 200, status: "active", purchaseDate: "2026-02-14", expiresDate: "2027-02-14" },
  { id: 2, code: "GC-2026-0002", purchaser: "Olivia Brown", recipient: "Mia Anderson", originalValue: 100, balance: 35, status: "partial", purchaseDate: "2026-01-10", expiresDate: "2027-01-10" },
  { id: 3, code: "GC-2025-0048", purchaser: "Ava Martinez", recipient: "Charlotte Thomas", originalValue: 150, balance: 0, status: "redeemed", purchaseDate: "2025-06-20", expiresDate: "2026-06-20" },
  { id: 4, code: "GC-2025-0032", purchaser: "Sophia Davis", recipient: "Isabella Garcia", originalValue: 75, balance: 75, status: "expired", purchaseDate: "2025-01-05", expiresDate: "2026-01-05" },
  { id: 5, code: "GC-2026-0003", purchaser: "Amelia Wilson", recipient: "Priya Sharma", originalValue: 300, balance: 180, status: "partial", purchaseDate: "2026-02-28", expiresDate: "2027-02-28" },
  { id: 6, code: "GC-2026-0004", purchaser: "Online Store", recipient: "Jessica Park", originalValue: 50, balance: 50, status: "active", purchaseDate: "2026-03-01", expiresDate: "2027-03-01" },
];

const recentRedemptions = [
  { card: "GC-2026-0002", customer: "Mia Anderson", amount: 45, service: "Express Facial", date: "2026-03-02" },
  { card: "GC-2026-0003", customer: "Priya Sharma", amount: 120, service: "Spa Day Package", date: "2026-03-01" },
  { card: "GC-2025-0048", customer: "Charlotte Thomas", amount: 65, service: "Mani-Pedi Deluxe", date: "2026-02-28" },
  { card: "GC-2026-0002", customer: "Mia Anderson", amount: 20, service: "Brow Wax", date: "2026-02-25" },
];

const AdminGiftCards = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const filtered = initialCards
    .filter(c => filter === "all" || c.status === filter)
    .filter(c => c.code.toLowerCase().includes(search.toLowerCase()) || c.recipient.toLowerCase().includes(search.toLowerCase()));

  const totalOutstanding = initialCards.filter(c => c.status === "active" || c.status === "partial").reduce((a, c) => a + c.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Gift Cards</h1>
          <p className="text-muted-foreground font-body text-sm">Manage gift card balances, purchases, and redemptions</p>
        </div>
        <Button className="font-body gap-1" onClick={() => toast({ title: "Issue Gift Card", description: "Gift card creation form would open here" })}>
          <Plus size={16} /> Issue Card
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Issued", value: initialCards.length.toString(), icon: CreditCard },
          { label: "Active Cards", value: initialCards.filter(c => c.status === "active" || c.status === "partial").length.toString(), icon: Gift },
          { label: "Outstanding Balance", value: `$${totalOutstanding.toLocaleString()}`, icon: DollarSign },
          { label: "Redeemed This Month", value: "$250", icon: DollarSign },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground font-body">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 flex-wrap gap-3">
          <CardTitle className="font-display text-lg">All Gift Cards</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {["all", "active", "partial", "redeemed", "expired"].map(f => (
                <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} className="font-body text-xs capitalize" onClick={() => setFilter(f)}>
                  {f === "all" ? "All" : statusMap[f]?.label || f}
                </Button>
              ))}
            </div>
            <div className="relative w-48">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-body text-sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Code</TableHead>
                <TableHead className="font-body">Purchaser</TableHead>
                <TableHead className="font-body">Recipient</TableHead>
                <TableHead className="font-body">Original</TableHead>
                <TableHead className="font-body">Balance</TableHead>
                <TableHead className="font-body">Status</TableHead>
                <TableHead className="font-body">Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-sm text-foreground font-semibold">{c.code}</TableCell>
                  <TableCell className="font-body text-muted-foreground text-sm">{c.purchaser}</TableCell>
                  <TableCell className="font-body text-foreground">{c.recipient}</TableCell>
                  <TableCell className="font-body text-muted-foreground">${c.originalValue}</TableCell>
                  <TableCell className="font-body font-semibold text-foreground">${c.balance}</TableCell>
                  <TableCell><Badge className={statusMap[c.status].class}>{statusMap[c.status].label}</Badge></TableCell>
                  <TableCell className="font-body text-muted-foreground text-sm">{c.expiresDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-display text-lg">Recent Redemptions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Card</TableHead>
                <TableHead className="font-body">Customer</TableHead>
                <TableHead className="font-body">Service</TableHead>
                <TableHead className="font-body">Amount</TableHead>
                <TableHead className="font-body">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRedemptions.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-sm text-foreground">{r.card}</TableCell>
                  <TableCell className="font-body text-foreground">{r.customer}</TableCell>
                  <TableCell className="font-body text-muted-foreground">{r.service}</TableCell>
                  <TableCell className="font-body font-semibold text-foreground">${r.amount}</TableCell>
                  <TableCell className="font-body text-muted-foreground text-sm">{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGiftCards;

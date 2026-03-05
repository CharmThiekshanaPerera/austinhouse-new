import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Percent, Plus, Trash2, Copy } from "lucide-react";

const initialCoupons = [
  { id: 1, code: "GLOW20", type: "Percentage", discount: "20%", minSpend: "$50", uses: 145, maxUses: 500, status: "active", expires: "2026-04-30" },
  { id: 2, code: "NEWCLIENT", type: "Fixed", discount: "$25 off", minSpend: "$100", uses: 89, maxUses: 200, status: "active", expires: "2026-06-15" },
  { id: 3, code: "SUMMER15", type: "Percentage", discount: "15%", minSpend: "$0", uses: 312, maxUses: 300, status: "expired", expires: "2025-09-01" },
  { id: 4, code: "VIPGOLD", type: "Percentage", discount: "30%", minSpend: "$150", uses: 24, maxUses: 50, status: "active", expires: "2026-12-31" },
  { id: 5, code: "BUNDLE50", type: "Fixed", discount: "$50 off", minSpend: "$200", uses: 67, maxUses: 100, status: "active", expires: "2026-05-15" },
  { id: 6, code: "FLASH10", type: "Percentage", discount: "10%", minSpend: "$0", uses: 500, maxUses: 500, status: "expired", expires: "2025-12-25" },
];

const AdminPromotions = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const filtered = coupons.filter(c => filter === "all" || c.status === filter);

  const deleteCoupon = (id: number) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    toast({ title: "Coupon Deleted", description: "Promotion has been removed" });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `${code} copied to clipboard` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Promotions & Coupons</h1>
          <p className="text-muted-foreground font-body text-sm">Manage discount codes and special offers</p>
        </div>
        <Button className="font-body gap-1" onClick={() => toast({ title: "Create Coupon", description: "Coupon creation form would open here" })}>
          <Plus size={16} /> New Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Promotions", value: coupons.filter(c => c.status === "active").length },
          { label: "Total Redemptions", value: coupons.reduce((a, c) => a + c.uses, 0).toLocaleString() },
          { label: "Revenue Saved by Customers", value: "$12,450" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Percent size={18} className="text-primary" />
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
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="font-display text-lg">Coupons</CardTitle>
          <div className="flex gap-1">
            {["all", "active", "expired"].map(f => (
              <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} className="font-body text-xs capitalize" onClick={() => setFilter(f)}>
                {f}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Code</TableHead>
                <TableHead className="font-body">Type</TableHead>
                <TableHead className="font-body">Discount</TableHead>
                <TableHead className="font-body">Min Spend</TableHead>
                <TableHead className="font-body">Usage</TableHead>
                <TableHead className="font-body">Expires</TableHead>
                <TableHead className="font-body">Status</TableHead>
                <TableHead className="font-body">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-sm text-foreground font-semibold">{c.code}</TableCell>
                  <TableCell className="font-body text-muted-foreground text-sm">{c.type}</TableCell>
                  <TableCell className="font-body font-semibold text-foreground">{c.discount}</TableCell>
                  <TableCell className="font-body text-muted-foreground">{c.minSpend}</TableCell>
                  <TableCell className="font-body text-foreground">{c.uses}/{c.maxUses}</TableCell>
                  <TableCell className="font-body text-muted-foreground text-sm">{c.expires}</TableCell>
                  <TableCell>
                    <Badge className={c.status === "active" ? "bg-green-600/20 text-green-400 border-green-600/30" : "bg-muted text-muted-foreground"}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => copyCode(c.code)}><Copy size={14} /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteCoupon(c.id)}><Trash2 size={14} /></Button>
                    </div>
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

export default AdminPromotions;

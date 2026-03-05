import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Users, Search, Eye, Tag } from "lucide-react";

const tagColors: Record<string, string> = {
  VIP: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Regular: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  New: "bg-green-500/20 text-green-300 border-green-500/30",
  "At Risk": "bg-destructive/20 text-destructive border-destructive/30",
};

const initialCustomers = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", phone: "(512) 555-0101", visits: 28, totalSpent: 4250, lastVisit: "2026-02-28", tags: ["VIP"], notes: "Prefers morning appointments" },
  { id: 2, name: "Emma Williams", email: "emma@email.com", phone: "(512) 555-0102", visits: 56, totalSpent: 8900, lastVisit: "2026-03-01", tags: ["VIP"], notes: "Allergic to parabens" },
  { id: 3, name: "Olivia Brown", email: "olivia@email.com", phone: "(512) 555-0103", visits: 12, totalSpent: 1800, lastVisit: "2026-02-15", tags: ["Regular"], notes: "" },
  { id: 4, name: "Sophia Davis", email: "sophia@email.com", phone: "(512) 555-0104", visits: 4, totalSpent: 450, lastVisit: "2026-01-20", tags: ["New"], notes: "Referred by Emma W." },
  { id: 5, name: "Ava Martinez", email: "ava@email.com", phone: "(512) 555-0105", visits: 22, totalSpent: 3600, lastVisit: "2026-02-25", tags: ["Regular"], notes: "Birthday: March 15" },
  { id: 6, name: "Mia Anderson", email: "mia@email.com", phone: "(512) 555-0106", visits: 8, totalSpent: 1200, lastVisit: "2025-11-10", tags: ["At Risk"], notes: "Hasn't visited in 4 months" },
  { id: 7, name: "Charlotte Thomas", email: "charlotte@email.com", phone: "(512) 555-0107", visits: 3, totalSpent: 350, lastVisit: "2026-02-20", tags: ["New"], notes: "" },
  { id: 8, name: "Amelia Wilson", email: "amelia@email.com", phone: "(512) 555-0108", visits: 35, totalSpent: 5200, lastVisit: "2026-03-02", tags: ["VIP"], notes: "Prefers Maya Chen as aesthetician" },
];

const AdminCustomers = () => {
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const { toast } = useToast();

  const filtered = initialCustomers
    .filter(c => tagFilter === "all" || c.tags.includes(tagFilter))
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Customer CRM</h1>
        <p className="text-muted-foreground font-body text-sm">Customer profiles, history, and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: "1,247" },
          { label: "Active (30 days)", value: "389" },
          { label: "Avg. Lifetime Value", value: "$2,840" },
          { label: "At Risk", value: "42" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users size={18} className="text-primary" />
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
          <CardTitle className="font-display text-lg">Customers</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {["all", "VIP", "Regular", "New", "At Risk"].map(t => (
                <Button key={t} size="sm" variant={tagFilter === t ? "default" : "outline"} className="font-body text-xs" onClick={() => setTagFilter(t)}>
                  {t === "all" ? "All" : t}
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
                <TableHead className="font-body">Customer</TableHead>
                <TableHead className="font-body">Tags</TableHead>
                <TableHead className="font-body">Visits</TableHead>
                <TableHead className="font-body">Total Spent</TableHead>
                <TableHead className="font-body">Last Visit</TableHead>
                <TableHead className="font-body">Notes</TableHead>
                <TableHead className="font-body">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div>
                      <p className="font-body font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email} • {c.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {c.tags.map(t => <Badge key={t} className={tagColors[t]}>{t}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="font-body text-foreground">{c.visits}</TableCell>
                  <TableCell className="font-body font-semibold text-foreground">${c.totalSpent.toLocaleString()}</TableCell>
                  <TableCell className="font-body text-muted-foreground text-sm">{c.lastVisit}</TableCell>
                  <TableCell className="font-body text-muted-foreground text-xs max-w-[150px] truncate">{c.notes || "—"}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => toast({ title: "Customer Profile", description: `Viewing ${c.name}'s full profile` })}>
                      <Eye size={14} />
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

export default AdminCustomers;

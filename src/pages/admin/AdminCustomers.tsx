import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { Users, Search, Loader2, Trash2 } from "lucide-react";

const AdminCustomers = () => {
  const { customers, deleteCustomer, customersLoading } = useData();
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filtered = customers.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteCustomer(id);
      toast({ title: "Removed", description: `${name} removed from customers.` });
    } catch {
      toast({ title: "Error", description: "Failed to delete customer.", variant: "destructive" });
    }
  };

  if (customersLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="animate-spin" size={20} />
        <span className="font-body text-sm">Loading customers…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Customer CRM</h1>
        <p className="text-muted-foreground font-body text-sm">Customer profiles, history, and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: customers.length },
          { label: "Total Revenue", value: `$${customers.reduce((s, c) => s + (c.total_spent ?? 0), 0).toLocaleString()}` },
          { label: "Avg. Spend", value: customers.length ? `$${Math.round(customers.reduce((s, c) => s + (c.total_spent ?? 0), 0) / customers.length).toLocaleString()}` : "—" },
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
          <div className="relative w-56">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search name or email…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-body text-sm" />
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm text-center py-8">
              {customers.length === 0 ? "No customers yet." : "No results for your search."}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body">Customer</TableHead>
                  <TableHead className="font-body">Phone</TableHead>
                  {/* <TableHead className="font-body">Total Spent</TableHead> */}
                  <TableHead className="font-body">Last Visit</TableHead>
                  <TableHead className="font-body">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div>
                        <p className="font-body font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-body text-muted-foreground text-sm">{c.phone ?? "—"}</TableCell>
                    {/* <TableCell className="font-body font-semibold text-foreground">${(c.total_spent ?? 0).toLocaleString()}</TableCell> */}
                    <TableCell className="font-body text-muted-foreground text-sm">{c.last_visit ?? "—"}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id, c.name)}>
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;

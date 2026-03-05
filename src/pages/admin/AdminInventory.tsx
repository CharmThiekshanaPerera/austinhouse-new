import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Package, AlertTriangle, Search, RefreshCw, Plus, Pencil, Trash2 } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { inventoryApi, type InventoryRecord, type InventoryStatus } from "@/lib/inventoryApi";
import { productsApi } from "@/lib/productsApi";

const statusMap: Record<InventoryStatus, { label: string; class: string }> = {
  "In Stock": { label: "In Stock", class: "bg-green-600/20 text-green-400 border-green-600/30" },
  "Low Stock": { label: "Low Stock", class: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30" },
  "Out of Stock": { label: "Out of Stock", class: "bg-destructive/20 text-destructive border-destructive/30" },
};

const AdminInventory = () => {
  const { products } = useData();
  const [productsFallback, setProductsFallback] = useState<{ id: string; name: string }[]>([]);
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | InventoryStatus>("all");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<InventoryRecord | null>(null);
  const { toast } = useToast();

  type InventoryFormData = Omit<InventoryRecord, "status"> & { status?: InventoryStatus };
  const emptyForm: InventoryFormData = {
    id: "",
    product_id: "",
    sku: "",
    stock_qty: 0,
    reorder_level: 0,
    supplier: "",
  };
  const [form, setForm] = useState<InventoryFormData>(emptyForm);

  useEffect(() => {
    if (editing) setForm({ ...editing });
    else setForm(emptyForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, showForm]);

  const load = async () => {
    setLoading(true);
    try {
      const remote = await inventoryApi.list();
      setInventory(remote);
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to load inventory.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (products.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        const remote = await productsApi.list();
        if (cancelled) return;
        setProductsFallback(remote.map(p => ({ id: p.id, name: p.name })));
      } catch {
        // If products can't be loaded, keep dropdown empty with a hint.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [products.length]);

  const rows = useMemo(() => {
    const productNameById = new Map(products.map(p => [p.id, p.name] as const));
    return inventory.map(i => ({
      ...i,
      product_name: productNameById.get(i.product_id) ?? i.product_id,
    }));
  }, [inventory, products]);

  const productOptions = useMemo(() => {
    const list = products.length > 0 ? products.map(p => ({ id: p.id, name: p.name })) : productsFallback;
    return list.sort((a, b) => a.name.localeCompare(b.name)).map(p => [p.id, p.name] as const);
  }, [products, productsFallback]);

  const filtered = rows
    .filter(r => filter === "all" || r.status === filter)
    .filter(r => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        r.product_name.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q) ||
        r.supplier.toLowerCase().includes(q)
      );
    });

  const lowCount = rows.filter(r => r.status === "Low Stock").length;
  const outCount = rows.filter(r => r.status === "Out of Stock").length;
  const inCount = rows.filter(r => r.status === "In Stock").length;

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const submit = async () => {
    const productId = form.product_id.trim();
    const sku = form.sku.trim();
    const supplier = form.supplier.trim();

    if (!productId) return toast({ title: "Error", description: "Product is required.", variant: "destructive" });
    if (!sku) return toast({ title: "Error", description: "SKU is required.", variant: "destructive" });
    if (!supplier) return toast({ title: "Error", description: "Supplier is required.", variant: "destructive" });
    if (!Number.isInteger(form.stock_qty) || form.stock_qty < 0) return toast({ title: "Error", description: "Stock must be a whole number ≥ 0.", variant: "destructive" });
    if (!Number.isInteger(form.reorder_level) || form.reorder_level < 0) return toast({ title: "Error", description: "Reorder level must be a whole number ≥ 0.", variant: "destructive" });

    setSaving(true);
    try {
      if (editing) {
        const updated = await inventoryApi.update(editing.id, {
          product_id: productId,
          sku,
          supplier,
          stock_qty: form.stock_qty,
          reorder_level: form.reorder_level,
        });
        setInventory(prev => prev.map(x => (x.id === updated.id ? updated : x)));
        toast({ title: "Updated", description: "Inventory updated." });
      } else {
        const created = await inventoryApi.create({
          product_id: productId,
          sku,
          supplier,
          stock_qty: form.stock_qty,
          reorder_level: form.reorder_level,
        });
        setInventory(prev => [...prev, created]);
        toast({ title: "Added", description: "Inventory record created." });
      }
      closeForm();
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Request failed.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground font-body text-sm">Track stock levels and manage reorders</p>
        </div>
        {!showForm && !editing && (
          <Button onClick={() => setShowForm(true)} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
            <Plus size={16} className="mr-2" /> Add Inventory
          </Button>
        )}
      </div>

      {(showForm || editing) && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">{editing ? "Edit Inventory" : "Add Inventory"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={e => {
                e.preventDefault();
                void submit();
              }}
            >
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-body text-foreground">Product <span className="text-destructive">*</span></label>
                <select
                  value={form.product_id}
                  onChange={e => setForm(prev => ({ ...prev, product_id: e.target.value }))}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="" disabled>Select a product...</option>
                  {productOptions.length === 0 && (
                    <option value="" disabled>No products loaded (check backend)</option>
                  )}
                  {productOptions.map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground font-body">Inventory records must reference an existing product.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-body text-foreground">SKU <span className="text-destructive">*</span></label>
                <Input value={form.sku} onChange={e => setForm(prev => ({ ...prev, sku: e.target.value }))} className="bg-background" placeholder="e.g. SKU-001" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-body text-foreground">Supplier <span className="text-destructive">*</span></label>
                <Input value={form.supplier} onChange={e => setForm(prev => ({ ...prev, supplier: e.target.value }))} className="bg-background" placeholder="e.g. GlowLab" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-body text-foreground">Stock Quantity</label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={Number.isFinite(form.stock_qty) ? form.stock_qty : 0}
                  onChange={e => setForm(prev => ({ ...prev, stock_qty: Number(e.target.value) }))}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-body text-foreground">Reorder Level</label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={Number.isFinite(form.reorder_level) ? form.reorder_level : 0}
                  onChange={e => setForm(prev => ({ ...prev, reorder_level: Number(e.target.value) }))}
                  className="bg-background"
                />
              </div>

              <div className="flex gap-2 md:col-span-2">
                <Button type="submit" disabled={saving} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm} disabled={saving} className="font-body text-xs uppercase tracking-wider">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: rows.length, icon: Package },
          { label: "In Stock", value: inCount, icon: Package },
          { label: "Low Stock", value: lowCount, icon: AlertTriangle, alert: lowCount > 0 },
          { label: "Out of Stock", value: outCount, icon: AlertTriangle, alert: outCount > 0 },
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

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 flex-wrap gap-3">
          <CardTitle className="font-display text-lg">Stock Levels</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {(["all", "In Stock", "Low Stock", "Out of Stock"] as const).map(f => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? "default" : "outline"}
                  className="font-body text-xs capitalize"
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : statusMap[f].label}
                </Button>
              ))}
            </div>
            <div className="relative w-48">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-body text-sm" />
            </div>
            <Button size="sm" variant="outline" className="font-body text-xs gap-1" onClick={() => void load()} disabled={loading}>
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Product</TableHead>
                <TableHead className="font-body">SKU</TableHead>
                <TableHead className="font-body">Stock</TableHead>
                <TableHead className="font-body">Reorder At</TableHead>
                <TableHead className="font-body">Supplier</TableHead>
                <TableHead className="font-body">Status</TableHead>
                <TableHead className="font-body">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-body font-medium text-foreground">{r.product_name}</TableCell>
                  <TableCell className="font-body text-muted-foreground text-xs">{r.sku}</TableCell>
                  <TableCell className="font-body font-semibold text-foreground">{r.stock_qty}</TableCell>
                  <TableCell className="font-body text-muted-foreground">{r.reorder_level}</TableCell>
                  <TableCell className="font-body text-foreground">{r.supplier}</TableCell>
                  <TableCell><Badge className={statusMap[r.status].class}>{statusMap[r.status].label}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(r);
                          setShowForm(false);
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          void (async () => {
                            try {
                              await inventoryApi.remove(r.id);
                              setInventory(prev => prev.filter(x => x.id !== r.id));
                              toast({ title: "Deleted", description: "Inventory record removed." });
                            } catch (e) {
                              toast({ title: "Error", description: e instanceof Error ? e.message : "Request failed.", variant: "destructive" });
                            }
                          })();
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-body text-xs gap-1"
                        onClick={() => toast({ title: "Reorder Placed", description: `Reorder request sent for ${r.product_name}` })}
                      >
                        <RefreshCw size={12} /> Reorder
                      </Button>
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

export default AdminInventory;

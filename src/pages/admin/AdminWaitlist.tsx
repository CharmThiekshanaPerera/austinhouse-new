import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useData, WaitlistEntry } from "@/contexts/DataContext";
import { Clock, Check, X, Phone, Plus, Loader2 } from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  preferred_date: "",
  service_id: "",
  notes: "",
};

const AdminWaitlist = () => {
  const { waitlistEntries, addWaitlistEntry, deleteWaitlistEntry, waitlistLoading } = useData();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.preferred_date || !form.service_id) {
      toast({ title: "Missing fields", description: "Name, email, preferred date, and service ID are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await addWaitlistEntry({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        preferred_date: form.preferred_date,
        service_id: form.service_id,
        notes: form.notes || null,
      });
      toast({ title: "Added ✨", description: `${form.name} added to waitlist.` });
      setForm(emptyForm); setShowForm(false);
    } catch {
      toast({ title: "Error", description: "Failed to add to waitlist.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (entry: WaitlistEntry, reason: "booked" | "cancelled") => {
    try {
      await deleteWaitlistEntry(entry.id);
      toast({
        title: reason === "booked" ? "Appointment Booked" : "Removed from Waitlist",
        description: `${entry.name} has been ${reason === "booked" ? "booked for service " + entry.service_id : "removed"}`,
      });
    } catch {
      toast({ title: "Error", description: "Failed to remove entry.", variant: "destructive" });
    }
  };

  if (waitlistLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="animate-spin" size={20} />
        <span className="font-body text-sm">Loading waitlist…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground">Appointments Waitlist</h1>
          <p className="text-muted-foreground font-body text-sm">Manage customers waiting for cancellation slots</p>
        </div>
        <Button
          onClick={() => setShowForm(v => !v)}
          className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider"
        >
          <Plus size={16} className="mr-2" /> Add to Waitlist
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-lg">Add to Waitlist</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Customer Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              <Input placeholder="Email *" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              <Input placeholder="Phone (optional)" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              <Input placeholder="Service ID *" value={form.service_id} onChange={e => setForm(p => ({ ...p, service_id: e.target.value }))} />
              <Input type="date" value={form.preferred_date} onChange={e => setForm(p => ({ ...p, preferred_date: e.target.value }))} />
            </div>
            <Textarea placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} />
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={saving} className="bg-gold-gradient text-primary-foreground font-body text-xs uppercase">
                {saving ? <Loader2 className="animate-spin mr-2" size={14} /> : null} Add
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setForm(emptyForm); }} className="font-body text-xs uppercase">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Waiting", value: waitlistEntries.length },
          {
            label: "This Week", value: waitlistEntries.filter(w => {
              const d = new Date(w.preferred_date);
              const now = new Date();
              const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
              return diff >= 0 && diff <= 7;
            }).length
          },
          {
            label: "Upcoming (30 days)", value: waitlistEntries.filter(w => {
              const d = new Date(w.preferred_date);
              const now = new Date();
              const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
              return diff >= 0 && diff <= 30;
            }).length
          },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock size={18} className="text-primary" />
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
        <CardHeader><CardTitle className="font-display text-lg">Waitlist Queue</CardTitle></CardHeader>
        <CardContent>
          {waitlistEntries.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-8">Waitlist is empty — all slots are filled! 🎉</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body">Customer</TableHead>
                  <TableHead className="font-body">Service ID</TableHead>
                  <TableHead className="font-body">Preferred Date</TableHead>
                  <TableHead className="font-body">Notes</TableHead>
                  <TableHead className="font-body">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlistEntries.map(w => (
                  <TableRow key={w.id}>
                    <TableCell>
                      <div>
                        <p className="font-body font-medium text-foreground">{w.name}</p>
                        <p className="text-xs text-muted-foreground">{w.email}</p>
                        {w.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone size={10} /> {w.phone}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="font-body text-foreground font-mono text-xs">{w.service_id}</TableCell>
                    <TableCell className="font-body text-muted-foreground text-sm">{w.preferred_date}</TableCell>
                    <TableCell className="font-body text-muted-foreground text-xs max-w-[140px] truncate">{w.notes ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="font-body text-xs gap-1 text-green-400 border-green-600/30 hover:bg-green-600/10" onClick={() => handleRemove(w, "booked")}>
                          <Check size={12} /> Book
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleRemove(w, "cancelled")}>
                          <X size={14} />
                        </Button>
                      </div>
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

export default AdminWaitlist;

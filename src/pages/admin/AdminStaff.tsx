import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useData, Staff } from "@/contexts/DataContext";
import { UserCog, Clock, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const STAFF_COLORS = [
  "bg-purple-500", "bg-blue-500", "bg-green-500", "bg-pink-500",
  "bg-orange-500", "bg-teal-500", "bg-red-500", "bg-indigo-500",
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM"];

const emptyForm = { name: "", role: "", email: "", phone: "", bio: "" };

const AdminStaff = () => {
  const { staff, addStaff, updateStaff, deleteStaff, staffLoading } = useData();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const getColor = (id: string) =>
    STAFF_COLORS[Math.abs(id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % STAFF_COLORS.length];

  const openEdit = (s: Staff) => {
    setEditing(s);
    setForm({ name: s.name, role: s.role, email: s.email, phone: s.phone ?? "", bio: s.bio ?? "" });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role || !form.email) {
      toast({ title: "Missing fields", description: "Name, role, and email are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateStaff(editing.id, { ...form, phone: form.phone || null, bio: form.bio || null });
        toast({ title: "Updated ✨", description: `${form.name} updated.` });
      } else {
        await addStaff({ ...form, phone: form.phone || null, bio: form.bio || null, image: null });
        toast({ title: "Added ✨", description: `${form.name} added to staff.` });
      }
      setShowForm(false); setEditing(null); setForm(emptyForm);
    } catch {
      toast({ title: "Error", description: "Failed to save. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: Staff) => {
    try {
      await deleteStaff(s.id);
      toast({ title: "Removed", description: `${s.name} removed from staff.` });
    } catch {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    }
  };

  if (staffLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="animate-spin" size={20} />
        <span className="font-body text-sm">Loading staff…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground">Staff Scheduling</h1>
          <p className="text-muted-foreground font-body text-sm">Manage staff and availability — {staff.length} members</p>
        </div>
        <Button
          onClick={() => { setShowForm(v => !v); setEditing(null); setForm(emptyForm); }}
          className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider"
        >
          <Plus size={16} className="mr-2" /> Add Staff
        </Button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-lg">{editing ? "Edit Staff Member" : "Add Staff Member"}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Full Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              <Input placeholder="Role / Title *" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
              <Input placeholder="Email *" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              <Input placeholder="Phone (optional)" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <Textarea placeholder="Bio (optional)" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={2} />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="bg-gold-gradient text-primary-foreground font-body text-xs uppercase">
                {saving ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
                {editing ? "Update" : "Add"}
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }} className="font-body text-xs uppercase">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff cards */}
      {staff.length === 0 ? (
        <p className="text-muted-foreground font-body text-sm">No staff members yet. Add your first team member above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {staff.map(s => (
            <Card key={s.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${getColor(s.id)} flex items-center justify-center text-white text-sm font-bold`}>
                    {s.image ? <img src={s.image} alt={s.name} className="w-10 h-10 rounded-full object-cover" /> : getInitials(s.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-foreground text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.role}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                {s.phone && <p className="text-xs text-muted-foreground">{s.phone}</p>}
                {s.bio && <p className="text-xs text-muted-foreground italic line-clamp-2">{s.bio}</p>}
                <div className="flex gap-1 pt-1">
                  <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => openEdit(s)}>
                    <Pencil size={12} className="mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(s)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Weekly schedule grid (visual reference only) */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Clock size={18} className="text-primary" /> Weekly Schedule (Visual Reference)
          </CardTitle>
          <p className="text-xs text-muted-foreground font-body">Schedule visualisation — manage shifts by assigning bookings to staff</p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-8 gap-px bg-border rounded-lg overflow-hidden">
              <div className="bg-card p-2" />
              {days.map(d => (
                <div key={d} className="bg-card p-2 text-center font-body text-xs font-semibold text-foreground">{d}</div>
              ))}
              {hours.map(h => (
                <>
                  <div key={h} className="bg-card p-2 font-body text-xs text-muted-foreground">{h}</div>
                  {days.map(d => (
                    <div key={`${d}-${h}`} className="bg-card p-1 min-h-[36px]" />
                  ))}
                </>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStaff;

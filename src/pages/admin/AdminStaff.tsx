import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useData, Staff } from "@/contexts/DataContext";
import { UserCog, Clock, Plus, Pencil, Trash2, Loader2, Upload, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { uploadImage } from "@/lib/uploadsApi";
import { 
  format, startOfWeek, addDays, subWeeks, addWeeks, 
  isSameDay, parseISO 
} from "date-fns";

const STAFF_COLORS = [
  "bg-purple-500", "bg-blue-500", "bg-green-500", "bg-pink-500",
  "bg-orange-500", "bg-teal-500", "bg-red-500", "bg-indigo-500",
];

const hours = [
  { label: "9AM", value: 9 },
  { label: "10AM", value: 10 },
  { label: "11AM", value: 11 },
  { label: "12PM", value: 12 },
  { label: "1PM", value: 13 },
  { label: "2PM", value: 14 },
  { label: "3PM", value: 15 },
  { label: "4PM", value: 16 },
  { label: "5PM", value: 17 },
  { label: "6PM", value: 18 }
];

const emptyForm = { name: "", role: "", email: "", phone: "", bio: "", image: "", show_in_frontend: true };

const AdminStaff = () => {
  const { staff, addStaff, updateStaff, deleteStaff, staffLoading, bookings, services } = useData();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 })); // Start on Monday

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const getColor = (id: string) =>
    STAFF_COLORS[Math.abs(id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % STAFF_COLORS.length];

  const openEdit = (s: Staff) => {
    setEditing(s);
    setForm({
      name: s.name,
      role: s.role,
      email: s.email,
      phone: s.phone ?? "",
      bio: s.bio ?? "",
      image: s.image ?? "",
      show_in_frontend: s.show_in_frontend ?? true
    });
    setFile(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role || !form.email) {
      toast({ title: "Missing fields", description: "Name, role, and email are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      let imageUrl = form.image;
      if (file) imageUrl = await uploadImage(file);

      const payload = {
        name: form.name,
        role: form.role,
        email: form.email,
        phone: form.phone || null,
        bio: form.bio || null,
        image: imageUrl || null,
        show_in_frontend: form.show_in_frontend,
      };

      if (editing) {
        await updateStaff(editing.id, payload);
        toast({ title: "Updated ✨", description: `${form.name} updated.` });
      } else {
        await addStaff(payload);
        toast({ title: "Added ✨", description: `${form.name} added to staff.` });
      }
      setShowForm(false); setEditing(null); setForm(emptyForm); setFile(null);
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to save. Please try again.", variant: "destructive" });
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
            <div className="space-y-4 pt-2">
              <label className="text-sm font-body text-foreground">Profile Image (optional)</label>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1 space-y-2 w-full">
                  <Input
                    placeholder="Image URL (Or upload below)"
                    value={form.image}
                    onChange={e => { setForm(p => ({ ...p, image: e.target.value })); setFile(null); }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-body hidden md:inline">OR</span>
                  <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap bg-secondary/50 hover:bg-secondary px-4 py-2 rounded-md transition-colors border border-border">
                    <Upload size={14} />
                    <span className="font-semibold font-body">{file ? "Change File" : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          setFile(e.target.files[0]);
                          setForm(p => ({ ...p, image: "" }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Switch
                  checked={form.show_in_frontend}
                  onCheckedChange={v => setForm(p => ({ ...p, show_in_frontend: v }))}
                />
                <span className="text-sm font-body text-muted-foreground">
                  {form.show_in_frontend ? "Visible on Frontend" : "Hidden from Frontend"}
                </span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={saving} className="bg-gold-gradient text-primary-foreground font-body text-xs uppercase">
                {saving ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
                {editing ? "Update" : "Add"}
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); setFile(null); }} className="font-body text-xs uppercase">Cancel</Button>
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
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div>
                      <p className="font-body font-medium text-foreground text-sm truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.role}</p>
                    </div>
                    {s.show_in_frontend === false ? (
                      <span title="Hidden from frontend"><EyeOff size={14} className="text-muted-foreground ml-2 flex-shrink-0" /></span>
                    ) : (
                      <span title="Visible on frontend"><Eye size={14} className="text-emerald-500 ml-2 flex-shrink-0" /></span>
                    )}
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

      {/* Weekly schedule grid */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Clock size={18} className="text-gold" /> Weekly Staff Schedule
              </CardTitle>
              <p className="text-xs text-muted-foreground font-body">Assignments based on confirmed bookings for the week of {format(currentWeekStart, "MMM d, yyyy")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentWeekStart(prev => subWeeks(prev, 1))}>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-wider h-8" onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentWeekStart(prev => addWeeks(prev, 1))}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-px bg-border rounded-lg overflow-hidden border border-border">
              {/* Header row */}
              <div className="bg-muted/50 p-3 flex items-center justify-center font-bold text-[10px] uppercase tracking-widest text-muted-foreground border-b border-r border-border">Time</div>
              {daysOfWeek.map(day => (
                <div key={day.toISOString()} className={cn(
                  "bg-muted/50 p-3 text-center border-b border-border transition-colors",
                  isSameDay(day, new Date()) && "bg-gold/5"
                )}>
                  <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{format(day, "EEE")}</p>
                  <p className="font-display text-sm font-bold text-foreground">{format(day, "d")}</p>
                </div>
              ))}

              {/* Grid rows */}
              {hours.map(h => (
                <React.Fragment key={h.label}>
                  <div className="bg-card p-3 flex items-center justify-center font-body text-[10px] text-muted-foreground font-bold border-r border-border">{h.label}</div>
                  {daysOfWeek.map(day => {
                    // Find bookings for this day and hour
                    const slotBookings = bookings.filter(b => {
                      if (!b.date || !b.time || b.status === "Cancelled") return false;
                      const bDate = parseISO(b.date);
                      const bHour = parseInt(b.time.split(":")[0]);
                      return isSameDay(day, bDate) && bHour === h.value;
                    });

                    return (
                      <div key={`${day.toISOString()}-${h.label}`} className="bg-card p-1.5 min-h-[60px] relative group hover:bg-muted/5 transition-colors">
                        <div className="flex flex-col gap-1">
                          {slotBookings.map(b => {
                            const assignedStaff = b.staff_id ? staff.find(s => s.id === b.staff_id) : null;
                            const service = services.find(s => s.id === b.service_id);
                            
                            return (
                              <div 
                                key={b.id} 
                                className={cn(
                                  "p-1.5 rounded text-[9px] font-bold text-white shadow-sm border border-black/5 leading-tight",
                                  assignedStaff ? getColor(assignedStaff.id) : "bg-slate-400"
                                )}
                                title={`${b.customer_name} - ${service?.title ?? "Product/Service"}`}
                              >
                                <div className="flex flex-col truncate">
                                  <span>{assignedStaff ? getInitials(assignedStaff.name) : "Unassigned"}</span>
                                  <span className="opacity-80 font-normal">{(service?.title || "Booking").slice(0, 10)}...</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStaff;

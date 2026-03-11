import { useState } from "react";
import { Trash2, Check, XCircle, Clock, Plus, Loader2, Eye } from "lucide-react";
import {
  format, isSameDay, parseISO, startOfMonth, endOfMonth,
  eachDayOfInterval, getDay, isToday,
} from "date-fns";
import { useData, Booking } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusConfig: Record<Booking["status"], { label: string; icon: typeof Clock; className: string }> = {
  Pending: { label: "Pending", icon: Clock, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  Confirmed: { label: "Confirmed", icon: Check, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  Completed: { label: "Completed", icon: Check, className: "bg-primary/10 text-primary border-primary/20" },
  Cancelled: { label: "Cancelled", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const emptyForm = {
  customer_name: "",
  customer_email: "",
  service_id: "",
  staff_id: "",
  date: "",
  time: "",
  notes: "",
  status: "Pending" as Booking["status"],
};

const AdminBookings = () => {
  const { bookings, addBooking, updateBooking, deleteBooking, bookingsLoading, services, staff } = useData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [previewBooking, setPreviewBooking] = useState<Booking | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  // Build lookup maps so booking cards show human-readable names
  const serviceMap = Object.fromEntries(services.map(s => [s.id, s.title]));
  const staffMap = Object.fromEntries(staff.map(s => [s.id, s.name]));

  const getBookingsForDate = (date: Date) =>
    bookings.filter(b => b.date && isSameDay(parseISO(b.date), date));
  const selectedBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  const handleStatus = async (b: Booking, status: Booking["status"]) => {
    try {
      await updateBooking(b.id, { status });
      toast({ title: "Updated", description: `Status → ${status}` });
    } catch {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  const handleDelete = async (b: Booking) => {
    try {
      await deleteBooking(b.id);
      toast({ title: "Deleted", description: `Booking for ${b.customer_name} removed.` });
    } catch {
      toast({ title: "Error", description: "Failed to delete booking.", variant: "destructive" });
    }
  };

  const handleCreate = async () => {
    if (!form.customer_name || !form.customer_email || !form.service_id || !form.date || !form.time) {
      toast({ title: "Missing fields", description: "Name, email, service, date, and time are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await addBooking({
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        service_id: form.service_id,
        staff_id: form.staff_id || null,
        date: form.date,
        time: form.time,
        notes: form.notes || null,
        status: "Pending",
      });
      toast({ title: "Booking Created ✨", description: `Appointment for ${form.customer_name} added.` });
      setForm(emptyForm);
      setShowForm(false);
    } catch {
      toast({ title: "Error", description: "Failed to create booking.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (bookingsLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="animate-spin" size={20} />
        <span className="font-body text-sm">Loading bookings…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Bookings</h1>
          <p className="text-muted-foreground font-body text-sm">{bookings.length} total bookings</p>
        </div>
        <Button
          onClick={() => setShowForm(v => !v)}
          className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider"
        >
          <Plus size={16} className="mr-2" /> New Booking
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-lg">New Booking</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Customer Name *"
                value={form.customer_name}
                onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
                className="bg-background"
              />
              <Input
                placeholder="Customer Email *"
                type="email"
                value={form.customer_email}
                onChange={e => setForm(p => ({ ...p, customer_email: e.target.value }))}
                className="bg-background"
              />

              {/* ── Live service dropdown ── */}
              <select
                value={form.service_id}
                onChange={e => setForm(p => ({ ...p, service_id: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-md font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select Service *</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.title} — {s.duration} · {s.price}</option>
                ))}
              </select>

              {/* ── Live staff dropdown ── */}
              <select
                value={form.staff_id}
                onChange={e => setForm(p => ({ ...p, staff_id: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-md font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Assign Staff (optional)</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>{s.name} — {s.role}</option>
                ))}
              </select>

              <Input
                type="date"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="bg-background"
              />
              <Input
                type="time"
                value={form.time}
                onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                className="bg-background"
              />
            </div>
            <Textarea
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              rows={2}
              className="bg-background"
            />
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={saving} className="bg-gold-gradient text-primary-foreground font-body text-xs uppercase">
                {saving ? <Loader2 className="animate-spin mr-2" size={14} /> : null} Create
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setForm(emptyForm); }} className="font-body text-xs uppercase">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>←</Button>
            <CardTitle className="font-display text-lg">{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>→</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-xs font-body text-muted-foreground py-2 font-semibold">{d}</div>
            ))}
            {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
            {days.map(day => {
              const dayBookings = getBookingsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative p-2 rounded-lg text-sm font-body transition-all min-h-[48px] flex flex-col items-center justify-start gap-0.5",
                    isToday(day) && "ring-1 ring-primary",
                    isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                    dayBookings.length > 0 && !isSelected && "bg-accent/50",
                  )}
                >
                  <span>{format(day, "d")}</span>
                  {dayBookings.length > 0 && (
                    <span className={cn("text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center", isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/20 text-primary")}>
                      {dayBookings.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected date bookings */}
      {selectedDate && (
        <div>
          <h3 className="font-display text-lg text-foreground mb-4">Bookings for {format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
          {selectedBookings.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm">No bookings for this date.</p>
          ) : (
            <div className="grid gap-3">
              {selectedBookings.map(b => {
                const config = statusConfig[b.status];
                return (
                  <Card key={b.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-display text-base font-semibold text-foreground">{b.customer_name}</h4>
                            <Badge variant="outline" className={cn("text-xs font-body", config.className)}>
                              <config.icon size={12} className="mr-1" />{config.label}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground font-body text-sm">
                            {b.customer_email} · {b.time}
                          </p>
                          <p className="text-muted-foreground font-body text-sm">
                            Service: <span className="font-medium text-foreground">{serviceMap[b.service_id] ?? b.service_id}</span>
                            {b.staff_id && <> · Staff: <span className="font-medium text-foreground">{staffMap[b.staff_id] ?? b.staff_id}</span></>}
                          </p>
                          {b.notes && <p className="text-muted-foreground font-body text-xs italic">{b.notes}</p>}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {b.status === "Pending" && <Button size="sm" variant="outline" onClick={() => handleStatus(b, "Confirmed")} className="text-xs"><Check size={14} className="mr-1" />Confirm</Button>}
                          {b.status === "Confirmed" && <Button size="sm" variant="outline" onClick={() => handleStatus(b, "Completed")} className="text-xs"><Check size={14} className="mr-1" />Complete</Button>}
                          {(b.status === "Pending" || b.status === "Confirmed") && <Button size="sm" variant="outline" onClick={() => handleStatus(b, "Cancelled")} className="text-xs text-destructive"><XCircle size={14} className="mr-1" />Cancel</Button>}
                          <Button size="sm" variant="outline" onClick={() => setPreviewBooking(b)}><Eye size={14} /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(b)}><Trash2 size={14} /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* All bookings */}
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">All Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-muted-foreground font-body text-sm">No bookings yet.</p>
        ) : (
          <div className="grid gap-3">
            {[...bookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(b => {
              const config = statusConfig[b.status];
              return (
                <Card key={b.id} className="border-border">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display text-sm font-semibold text-foreground">{b.customer_name}</h4>
                        <Badge variant="outline" className={cn("text-xs font-body", config.className)}>{config.label}</Badge>
                      </div>
                      <p className="text-muted-foreground font-body text-xs mt-1">
                        {b.customer_email} · {b.date ? format(parseISO(b.date), "MMM d, yyyy") : "N/A"} · {b.time}
                      </p>
                      <p className="text-muted-foreground font-body text-xs">
                        {serviceMap[b.service_id] ?? b.service_id}
                        {b.staff_id && ` · ${staffMap[b.staff_id] ?? b.staff_id}`}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => setPreviewBooking(b)}><Eye size={14} /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(b)}><Trash2 size={14} /></Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>


      {/* Booking Preview Dialog */}
      <Dialog open={!!previewBooking} onOpenChange={(open) => !open && setPreviewBooking(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground">
              Booking <span className="text-gold-gradient">Details</span>
            </DialogTitle>
          </DialogHeader>
          {previewBooking && (
            <div className="space-y-4 font-body mt-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Customer Name</span>
                  <span className="font-medium text-foreground">{previewBooking.customer_name}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Status</span>
                  <Badge variant="outline" className={cn("text-xs", statusConfig[previewBooking.status].className)}>
                     {statusConfig[previewBooking.status].label}
                  </Badge>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Email</span>
                  <span className="text-foreground">{previewBooking.customer_email}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Phone</span>
                  <span className="text-foreground">{previewBooking.customer_phone || "Not provided"}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Date & Time</span>
                  <span className="text-foreground">{previewBooking.date ? format(parseISO(previewBooking.date), "PPP") : "N/A"} at {previewBooking.time}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Service</span>
                  <span className="font-medium text-primary">{serviceMap[previewBooking.service_id] ?? previewBooking.service_id}</span>
                </div>
                {previewBooking.staff_id && (
                  <div className="col-span-2">
                    <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Assigned Staff</span>
                    <span className="text-foreground">{staffMap[previewBooking.staff_id] ?? previewBooking.staff_id}</span>
                  </div>
                )}
                {previewBooking.notes && (
                  <div className="col-span-2 bg-accent/50 p-3 rounded-md">
                    <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Notes</span>
                    <span className="text-foreground italic">{previewBooking.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;

import { useState } from "react";
import { Trash2, Check, XCircle, Clock } from "lucide-react";
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from "date-fns";
import { useData, Booking } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  confirmed: { label: "Confirmed", icon: Check, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  completed: { label: "Completed", icon: Check, className: "bg-primary/10 text-primary border-primary/20" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const AdminBookings = () => {
  const { bookings, updateBooking, deleteBooking } = useData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const getBookingsForDate = (date: Date) => bookings.filter(b => b.date && isSameDay(parseISO(b.date), date));
  const selectedBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  const handleStatus = (b: Booking, status: Booking["status"]) => {
    updateBooking({ ...b, status });
    toast({ title: "Updated", description: `Status → ${status}` });
  };

  const handleDelete = (b: Booking) => {
    deleteBooking(b.id);
    toast({ title: "Deleted", description: `Booking for ${b.name} removed.` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground font-bold">Bookings</h1>
        <p className="text-muted-foreground font-body text-sm">{bookings.length} total bookings</p>
      </div>

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
                    dayBookings.length > 0 && !isSelected && "bg-accent/50"
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
                            <h4 className="font-display text-base font-semibold text-foreground">{b.treatment}</h4>
                            <Badge variant="outline" className={cn("text-xs font-body", config.className)}>
                              <config.icon size={12} className="mr-1" />{config.label}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground font-body text-sm">{b.name} · {b.phone} · {b.timeSlot}</p>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {b.status === "pending" && <Button size="sm" variant="outline" onClick={() => handleStatus(b, "confirmed")} className="text-xs"><Check size={14} className="mr-1" />Confirm</Button>}
                          {b.status === "confirmed" && <Button size="sm" variant="outline" onClick={() => handleStatus(b, "completed")} className="text-xs"><Check size={14} className="mr-1" />Complete</Button>}
                          {(b.status === "pending" || b.status === "confirmed") && <Button size="sm" variant="outline" onClick={() => handleStatus(b, "cancelled")} className="text-xs text-destructive"><XCircle size={14} className="mr-1" />Cancel</Button>}
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
            {bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(b => {
              const config = statusConfig[b.status];
              return (
                <Card key={b.id} className="border-border">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display text-sm font-semibold text-foreground">{b.treatment}</h4>
                        <Badge variant="outline" className={cn("text-xs font-body", config.className)}>{config.label}</Badge>
                      </div>
                      <p className="text-muted-foreground font-body text-xs mt-1">{b.name} · {b.phone} · {b.date ? format(parseISO(b.date), "MMM d, yyyy") : "N/A"} · {b.timeSlot}</p>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(b)}><Trash2 size={14} /></Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useData } from "@/contexts/DataContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedService?: string;
}

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const BookingModal = ({ open, onOpenChange, preselectedService }: BookingModalProps) => {
  const [date, setDate] = useState<Date>();
  const [serviceId, setServiceId] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addBooking, services } = useData();

  // Pre-select service by title match when preselectedService prop changes
  useEffect(() => {
    if (preselectedService && services.length > 0) {
      const match = services.find(s =>
        s.title.toLowerCase() === preselectedService.toLowerCase()
      );
      if (match) setServiceId(match.id);
    }
  }, [preselectedService, services]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setDate(undefined);
      setServiceId("");
      setTimeSlot("");
      setName("");
      setEmail("");
      setPhone("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !serviceId || !timeSlot || !name || !email || !phone) return;

    setSubmitting(true);
    try {
      await addBooking({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        service_id: serviceId,
        staff_id: null,
        date: format(date, "yyyy-MM-dd"),
        time: timeSlot,
        status: "Pending",
        notes: null,
      });

      const svcTitle = services.find(s => s.id === serviceId)?.title ?? "your treatment";
      toast({
        title: "Booking Confirmed! ✨",
        description: `${svcTitle} on ${format(date, "PPP")} at ${timeSlot}. We'll contact you shortly.`,
      });
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">
            Book Your <span className="text-gold-gradient">Treatment</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Treatment Selection — live from API */}
          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">Select Treatment</label>
            <select
              required
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
            >
              <option value="">Choose a treatment…</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} — {s.duration} · {s.price}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">Preferred Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "PPP") : "Pick a date"}
                  <CalendarIcon size={16} className="text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[100]" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">Preferred Time</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={cn(
                    "px-3 py-2 rounded-sm font-body text-xs tracking-wider transition-all border",
                    timeSlot === slot
                      ? "bg-gold-gradient text-primary-foreground border-transparent shadow-gold"
                      : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-body text-muted-foreground mb-2">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-body text-muted-foreground mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-body text-muted-foreground mb-2">Phone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="+94 7X XXX XXXX"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!date || !serviceId || !timeSlot || !name || !email || !phone || submitting}
            className="w-full py-4 bg-gold-gradient text-primary-foreground font-body font-bold tracking-wider uppercase text-sm rounded-sm shadow-gold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Confirming…" : "Confirm Booking"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;

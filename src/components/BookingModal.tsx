import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
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

const treatmentOptions = [
  "Signature Gold Facial",
  "Laser Hair Removal",
  "Luxury Manicure & Pedicure",
  "Full Body Waxing",
  "Microdermabrasion",
  "Relaxation Massage Therapy",
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const BookingModal = ({ open, onOpenChange, preselectedService }: BookingModalProps) => {
  const [date, setDate] = useState<Date>();
  const [treatment, setTreatment] = useState(preselectedService || "");
  const [timeSlot, setTimeSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { addBooking } = useData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBooking({
      name,
      phone,
      treatment,
      date: date ? date.toISOString() : "",
      timeSlot,
      status: "pending",
    });
    toast({
      title: "Booking Confirmed! ✨",
      description: `${treatment} on ${date ? format(date, "PPP") : ""} at ${timeSlot}. We'll contact you shortly to confirm.`,
    });
    onOpenChange(false);
    setDate(undefined);
    setTreatment("");
    setTimeSlot("");
    setName("");
    setPhone("");
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
          {/* Treatment Selection */}
          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">Select Treatment</label>
            <select
              required
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
            >
              <option value="">Choose a treatment...</option>
              {treatmentOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
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

          {/* Name & Phone */}
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-body text-muted-foreground mb-2">Phone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="+94..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!date || !treatment || !timeSlot}
            className="w-full py-4 bg-gold-gradient text-primary-foreground font-body font-bold tracking-wider uppercase text-sm rounded-sm shadow-gold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Booking
          </button>

          <p className="text-center text-xs text-muted-foreground font-body">
            This is a demo booking. No actual appointment will be scheduled.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;

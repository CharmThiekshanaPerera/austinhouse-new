import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Clock, ArrowUp, ArrowDown, Check, X, Phone } from "lucide-react";

const priorityMap: Record<string, { label: string; class: string }> = {
  high: { label: "High", class: "bg-destructive/20 text-destructive border-destructive/30" },
  medium: { label: "Medium", class: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30" },
  low: { label: "Low", class: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
};

const initialWaitlist = [
  { id: 1, name: "Rachel Green", phone: "(512) 555-0201", service: "HydraFacial", preferredStaff: "Maya Chen", preferredDays: "Mon, Wed, Fri", priority: "high", addedDate: "2026-02-20", notes: "Flexible on time, needs before 3 PM" },
  { id: 2, name: "Monica Geller", phone: "(512) 555-0202", service: "Chemical Peel", preferredStaff: "Dr. Elena Rodriguez", preferredDays: "Tue, Thu", priority: "high", addedDate: "2026-02-22", notes: "First-time client referral from VIP" },
  { id: 3, name: "Phoebe Buffay", phone: "(512) 555-0203", service: "Deep Tissue Massage", preferredStaff: "Any", preferredDays: "Sat", priority: "medium", addedDate: "2026-02-25", notes: "Weekend only" },
  { id: 4, name: "Amy Santiago", phone: "(512) 555-0204", service: "Laser Treatment", preferredStaff: "Dr. Elena Rodriguez", preferredDays: "Any weekday", priority: "medium", addedDate: "2026-02-26", notes: "Needs consultation first" },
  { id: 5, name: "Rosa Diaz", phone: "(512) 555-0205", service: "Mani-Pedi Deluxe", preferredStaff: "Priya Sharma", preferredDays: "Fri, Sat", priority: "low", addedDate: "2026-02-28", notes: "" },
  { id: 6, name: "Eleanor Shellstrop", phone: "(512) 555-0206", service: "Microdermabrasion", preferredStaff: "Maya Chen", preferredDays: "Mon, Tue", priority: "high", addedDate: "2026-03-01", notes: "Has existing membership — priority" },
  { id: 7, name: "Tahani Al-Jamil", phone: "(512) 555-0207", service: "Spa Day Package", preferredStaff: "Any", preferredDays: "Any", priority: "low", addedDate: "2026-03-02", notes: "Gift card holder, flexible schedule" },
];

const AdminWaitlist = () => {
  const [waitlist, setWaitlist] = useState(initialWaitlist);
  const { toast } = useToast();

  const movePriority = (id: number, direction: "up" | "down") => {
    const order = ["low", "medium", "high"];
    setWaitlist(prev => prev.map(w => {
      if (w.id !== id) return w;
      const idx = order.indexOf(w.priority);
      const newIdx = direction === "up" ? Math.min(idx + 1, 2) : Math.max(idx - 1, 0);
      return { ...w, priority: order[newIdx] };
    }));
    toast({ title: "Priority Updated" });
  };

  const removeFromWaitlist = (id: number, reason: "booked" | "cancelled") => {
    const entry = waitlist.find(w => w.id === id);
    setWaitlist(prev => prev.filter(w => w.id !== id));
    toast({
      title: reason === "booked" ? "Appointment Booked" : "Removed from Waitlist",
      description: `${entry?.name} has been ${reason === "booked" ? "booked for " + entry?.service : "removed"}`,
    });
  };

  const sorted = [...waitlist].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority as keyof typeof order] - order[b.priority as keyof typeof order];
  });

  const highCount = waitlist.filter(w => w.priority === "high").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Appointments Waitlist</h1>
        <p className="text-muted-foreground font-body text-sm">Manage customers waiting for cancellation slots</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Waiting", value: waitlist.length },
          { label: "High Priority", value: highCount },
          { label: "Avg. Wait Time", value: "4.2 days" },
          { label: "Filled This Week", value: "6" },
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
        <CardHeader>
          <CardTitle className="font-display text-lg">Waitlist Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Priority</TableHead>
                <TableHead className="font-body">Customer</TableHead>
                <TableHead className="font-body">Service</TableHead>
                <TableHead className="font-body">Preferred Staff</TableHead>
                <TableHead className="font-body">Preferred Days</TableHead>
                <TableHead className="font-body">Added</TableHead>
                <TableHead className="font-body">Notes</TableHead>
                <TableHead className="font-body">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map(w => (
                <TableRow key={w.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge className={priorityMap[w.priority].class}>{priorityMap[w.priority].label}</Badge>
                      <div className="flex flex-col">
                        <button onClick={() => movePriority(w.id, "up")} className="text-muted-foreground hover:text-foreground p-0.5"><ArrowUp size={12} /></button>
                        <button onClick={() => movePriority(w.id, "down")} className="text-muted-foreground hover:text-foreground p-0.5"><ArrowDown size={12} /></button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-body font-medium text-foreground">{w.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone size={10} /> {w.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-body text-foreground">{w.service}</TableCell>
                  <TableCell className="font-body text-muted-foreground text-sm">{w.preferredStaff}</TableCell>
                  <TableCell className="font-body text-muted-foreground text-sm">{w.preferredDays}</TableCell>
                  <TableCell className="font-body text-muted-foreground text-sm">{w.addedDate}</TableCell>
                  <TableCell className="font-body text-muted-foreground text-xs max-w-[140px] truncate">{w.notes || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="font-body text-xs gap-1 text-green-400 border-green-600/30 hover:bg-green-600/10" onClick={() => removeFromWaitlist(w.id, "booked")}>
                        <Check size={12} /> Book
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeFromWaitlist(w.id, "cancelled")}>
                        <X size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {sorted.length === 0 && (
            <p className="text-center text-muted-foreground font-body py-8">Waitlist is empty — all slots are filled!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWaitlist;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { UserCog, Clock } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM"];

const initialStaff = [
  { id: 1, name: "Dr. Elena Rodriguez", role: "Medical Director", available: true, hoursWeek: 40, color: "bg-purple-500" },
  { id: 2, name: "Maya Chen", role: "Senior Aesthetician", available: true, hoursWeek: 36, color: "bg-blue-500" },
  { id: 3, name: "Jessica Park", role: "Massage Therapist", available: false, hoursWeek: 0, color: "bg-green-500" },
  { id: 4, name: "Priya Sharma", role: "Nail Technician", available: true, hoursWeek: 32, color: "bg-pink-500" },
];

const scheduleData: Record<string, { staff: string; color: string }[]> = {
  "Mon-9AM": [{ staff: "Elena", color: "bg-purple-500" }],
  "Mon-10AM": [{ staff: "Elena", color: "bg-purple-500" }, { staff: "Maya", color: "bg-blue-500" }],
  "Mon-11AM": [{ staff: "Maya", color: "bg-blue-500" }],
  "Mon-2PM": [{ staff: "Priya", color: "bg-pink-500" }],
  "Tue-9AM": [{ staff: "Maya", color: "bg-blue-500" }],
  "Tue-11AM": [{ staff: "Elena", color: "bg-purple-500" }],
  "Tue-1PM": [{ staff: "Priya", color: "bg-pink-500" }],
  "Tue-3PM": [{ staff: "Maya", color: "bg-blue-500" }],
  "Wed-10AM": [{ staff: "Elena", color: "bg-purple-500" }, { staff: "Priya", color: "bg-pink-500" }],
  "Wed-2PM": [{ staff: "Maya", color: "bg-blue-500" }],
  "Thu-9AM": [{ staff: "Elena", color: "bg-purple-500" }],
  "Thu-11AM": [{ staff: "Maya", color: "bg-blue-500" }, { staff: "Priya", color: "bg-pink-500" }],
  "Thu-4PM": [{ staff: "Elena", color: "bg-purple-500" }],
  "Fri-10AM": [{ staff: "Maya", color: "bg-blue-500" }],
  "Fri-1PM": [{ staff: "Priya", color: "bg-pink-500" }],
  "Fri-3PM": [{ staff: "Elena", color: "bg-purple-500" }],
  "Sat-9AM": [{ staff: "Maya", color: "bg-blue-500" }, { staff: "Priya", color: "bg-pink-500" }],
  "Sat-11AM": [{ staff: "Elena", color: "bg-purple-500" }],
};

const AdminStaff = () => {
  const [staff, setStaff] = useState(initialStaff);
  const { toast } = useToast();

  const toggleAvailability = (id: number) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, available: !s.available } : s));
    const member = staff.find(s => s.id === id);
    toast({ title: "Availability Updated", description: `${member?.name} is now ${member?.available ? "unavailable" : "available"}` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Staff Scheduling</h1>
        <p className="text-muted-foreground font-body text-sm">Manage staff shifts and availability</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {staff.map(s => (
          <Card key={s.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-foreground text-sm truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-body">{s.hoursWeek}h / week</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{s.available ? "On" : "Off"}</span>
                  <Switch checked={s.available} onCheckedChange={() => toggleAvailability(s.id)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="font-display text-lg">Weekly Schedule</CardTitle></CardHeader>
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
                  {days.map(d => {
                    const key = `${d}-${h}`;
                    const slots = scheduleData[key];
                    return (
                      <div key={key} className="bg-card p-1 min-h-[36px]">
                        {slots?.map((s, i) => (
                          <div key={i} className={`${s.color}/20 text-[10px] px-1.5 py-0.5 rounded mb-0.5 font-body truncate`}>
                            {s.staff}
                          </div>
                        ))}
                      </div>
                    );
                  })}
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

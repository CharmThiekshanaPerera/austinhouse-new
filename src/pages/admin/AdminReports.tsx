import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileDown, FileText, BarChart3, DollarSign, Package, CalendarDays, Users } from "lucide-react";

const reports = [
  {
    title: "Revenue Report",
    description: "Monthly and yearly revenue breakdown by service category, product sales, and payment method.",
    icon: DollarSign,
    formats: ["PDF", "CSV"],
    lastGenerated: "2026-03-01",
    size: "2.4 MB",
  },
  {
    title: "Bookings Summary",
    description: "Appointment volume, no-show rates, peak hours analysis, and staff utilization metrics.",
    icon: CalendarDays,
    formats: ["PDF", "CSV"],
    lastGenerated: "2026-03-01",
    size: "1.8 MB",
  },
  {
    title: "Inventory Status",
    description: "Current stock levels, reorder alerts, product movement history, and supplier performance.",
    icon: Package,
    formats: ["PDF", "CSV", "Excel"],
    lastGenerated: "2026-02-28",
    size: "3.1 MB",
  },
  {
    title: "Customer Analytics",
    description: "Customer acquisition, retention rates, lifetime value distribution, and demographic insights.",
    icon: Users,
    formats: ["PDF", "CSV"],
    lastGenerated: "2026-02-28",
    size: "1.5 MB",
  },
  {
    title: "Marketing Performance",
    description: "Campaign ROI, coupon redemption rates, email open rates, and social media engagement.",
    icon: BarChart3,
    formats: ["PDF"],
    lastGenerated: "2026-02-25",
    size: "4.2 MB",
  },
  {
    title: "Staff Performance",
    description: "Individual staff metrics including booking rates, revenue generated, customer ratings, and hours worked.",
    icon: Users,
    formats: ["PDF", "CSV"],
    lastGenerated: "2026-02-27",
    size: "1.1 MB",
  },
];

const AdminReports = () => {
  const { toast } = useToast();

  const handleExport = (title: string, format: string) => {
    toast({
      title: `Generating ${format}...`,
      description: `${title} is being prepared for download. This is a demo — no file will be generated.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Reports & Export</h1>
        <p className="text-muted-foreground font-body text-sm">Generate and download business reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Reports Generated (MTD)", value: "47" },
          { label: "Last Full Export", value: "Mar 1, 2026" },
          { label: "Scheduled Reports", value: "5 active" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground font-body">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map(r => (
          <Card key={r.title}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <r.icon size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="font-display text-base">{r.title}</CardTitle>
                  <CardDescription className="font-body text-xs mt-1">{r.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground font-body space-y-0.5">
                  <p>Last: {r.lastGenerated} • {r.size}</p>
                </div>
                <div className="flex gap-1">
                  {r.formats.map(f => (
                    <Button key={f} size="sm" variant="outline" className="font-body text-xs gap-1" onClick={() => handleExport(r.title, f)}>
                      <FileDown size={12} /> {f}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;

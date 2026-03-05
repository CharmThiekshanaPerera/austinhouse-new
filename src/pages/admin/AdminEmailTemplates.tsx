import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Mail, Eye, Save, Copy, Pencil, X } from "lucide-react";

const categoryColors: Record<string, string> = {
  Booking: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Reminder: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  Promotion: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Loyalty: "bg-green-600/20 text-green-400 border-green-600/30",
  System: "bg-muted text-muted-foreground border-border",
};

interface Template {
  id: number;
  name: string;
  category: string;
  subject: string;
  body: string;
  active: boolean;
  lastEdited: string;
  variables: string[];
}

const initialTemplates: Template[] = [
  {
    id: 1, name: "Booking Confirmation", category: "Booking",
    subject: "Your appointment is confirmed — {{service_name}}",
    body: "Hi {{customer_name}},\n\nYour appointment has been confirmed!\n\n📅 Date: {{appointment_date}}\n🕐 Time: {{appointment_time}}\n💆 Service: {{service_name}}\n👩‍⚕️ With: {{staff_name}}\n\nPlease arrive 10 minutes early. If you need to reschedule, contact us at least 24 hours in advance.\n\nSee you soon!\n— Austin House Beauty & Spa",
    active: true, lastEdited: "2026-03-01",
    variables: ["customer_name", "service_name", "appointment_date", "appointment_time", "staff_name"],
  },
  {
    id: 2, name: "Appointment Reminder (24h)", category: "Reminder",
    subject: "Reminder: {{service_name}} tomorrow at {{appointment_time}}",
    body: "Hi {{customer_name}},\n\nJust a friendly reminder about your appointment tomorrow:\n\n📅 {{appointment_date}} at {{appointment_time}}\n💆 {{service_name}} with {{staff_name}}\n\nNeed to reschedule? Reply to this email or call us at (512) 555-0100.\n\nWe look forward to seeing you!\n— Austin House Beauty & Spa",
    active: true, lastEdited: "2026-02-28",
    variables: ["customer_name", "service_name", "appointment_date", "appointment_time", "staff_name"],
  },
  {
    id: 3, name: "Post-Visit Thank You", category: "Booking",
    subject: "Thank you for visiting us, {{customer_name}}! 💛",
    body: "Hi {{customer_name}},\n\nThank you for choosing Austin House Beauty & Spa! We hope you enjoyed your {{service_name}} session.\n\nWe'd love to hear your feedback — it takes just 30 seconds:\n{{feedback_link}}\n\nBook your next appointment and earn {{loyalty_points}} loyalty points!\n\nWarm regards,\n— The Austin House Team",
    active: true, lastEdited: "2026-02-25",
    variables: ["customer_name", "service_name", "feedback_link", "loyalty_points"],
  },
  {
    id: 4, name: "Flash Sale Announcement", category: "Promotion",
    subject: "⚡ {{discount_percent}}% OFF — This Weekend Only!",
    body: "Hi {{customer_name}},\n\n🎉 FLASH SALE — This Weekend Only!\n\nGet {{discount_percent}}% off all {{service_category}} services.\n\nUse code: {{coupon_code}}\nValid: {{start_date}} – {{end_date}}\n\nBook now before slots fill up!\n{{booking_link}}\n\n— Austin House Beauty & Spa",
    active: true, lastEdited: "2026-03-02",
    variables: ["customer_name", "discount_percent", "service_category", "coupon_code", "start_date", "end_date", "booking_link"],
  },
  {
    id: 5, name: "Loyalty Tier Upgrade", category: "Loyalty",
    subject: "🎖️ Congratulations! You've reached {{new_tier}} status!",
    body: "Hi {{customer_name}},\n\nAmazing news — you've been upgraded to {{new_tier}} tier! 🎉\n\nYour new benefits:\n{{tier_benefits}}\n\nCurrent points: {{total_points}}\n\nThank you for being a valued member of our community.\n\n— Austin House Beauty & Spa",
    active: true, lastEdited: "2026-02-20",
    variables: ["customer_name", "new_tier", "tier_benefits", "total_points"],
  },
  {
    id: 6, name: "Password Reset", category: "System",
    subject: "Reset your password",
    body: "Hi {{customer_name}},\n\nWe received a request to reset your password. Click the link below:\n\n{{reset_link}}\n\nThis link expires in 1 hour. If you didn't request this, please ignore this email.\n\n— Austin House Beauty & Spa",
    active: false, lastEdited: "2026-01-15",
    variables: ["customer_name", "reset_link"],
  },
];

const AdminEmailTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [previewId, setPreviewId] = useState<number | null>(null);
  const { toast } = useToast();

  const startEdit = (t: Template) => {
    setEditingId(t.id);
    setEditSubject(t.subject);
    setEditBody(t.body);
    setPreviewId(null);
  };

  const saveEdit = () => {
    setTemplates(prev => prev.map(t =>
      t.id === editingId ? { ...t, subject: editSubject, body: editBody, lastEdited: "2026-03-03" } : t
    ));
    toast({ title: "Template Saved", description: "Email template has been updated" });
    setEditingId(null);
  };

  const toggleActive = (id: number) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));
    const tmpl = templates.find(t => t.id === id);
    toast({ title: tmpl?.active ? "Template Disabled" : "Template Enabled" });
  };

  const duplicateTemplate = (t: Template) => {
    const newT = { ...t, id: Date.now(), name: `${t.name} (Copy)`, lastEdited: "2026-03-03" };
    setTemplates(prev => [...prev, newT]);
    toast({ title: "Template Duplicated", description: `"${newT.name}" created` });
  };

  const previewTemplate = templates.find(t => t.id === previewId);
  const previewBody = previewTemplate?.body
    .replace(/\{\{customer_name\}\}/g, "Sarah Johnson")
    .replace(/\{\{service_name\}\}/g, "HydraFacial")
    .replace(/\{\{appointment_date\}\}/g, "March 10, 2026")
    .replace(/\{\{appointment_time\}\}/g, "2:00 PM")
    .replace(/\{\{staff_name\}\}/g, "Maya Chen")
    .replace(/\{\{feedback_link\}\}/g, "https://example.com/feedback")
    .replace(/\{\{loyalty_points\}\}/g, "150")
    .replace(/\{\{discount_percent\}\}/g, "25")
    .replace(/\{\{service_category\}\}/g, "Facial")
    .replace(/\{\{coupon_code\}\}/g, "FLASH25")
    .replace(/\{\{start_date\}\}/g, "Mar 8")
    .replace(/\{\{end_date\}\}/g, "Mar 9")
    .replace(/\{\{booking_link\}\}/g, "https://example.com/book")
    .replace(/\{\{new_tier\}\}/g, "Gold")
    .replace(/\{\{tier_benefits\}\}/g, "• 20% off all services\n• Priority booking\n• Free birthday treatment")
    .replace(/\{\{total_points\}\}/g, "5,200")
    .replace(/\{\{reset_link\}\}/g, "https://example.com/reset/abc123");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Email Templates</h1>
        <p className="text-muted-foreground font-body text-sm">Customize automated email templates with dynamic variables</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Templates", value: templates.length },
          { label: "Active", value: templates.filter(t => t.active).length },
          { label: "Emails Sent (MTD)", value: "1,247" },
          { label: "Open Rate", value: "68.4%" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground font-body">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview modal */}
      {previewId && previewTemplate && (
        <Card className="border-primary/30">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="font-display text-lg">Preview: {previewTemplate.name}</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setPreviewId(null)}><X size={16} /></Button>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg p-6 bg-background space-y-3">
              <p className="text-xs text-muted-foreground font-body">Subject:</p>
              <p className="font-body font-medium text-foreground text-sm">
                {previewTemplate.subject.replace(/\{\{.*?\}\}/g, m => {
                  const key = m.slice(2, -2);
                  const map: Record<string, string> = { customer_name: "Sarah Johnson", service_name: "HydraFacial", appointment_time: "2:00 PM", discount_percent: "25", new_tier: "Gold" };
                  return map[key] || m;
                })}
              </p>
              <hr className="border-border" />
              <pre className="font-body text-sm text-foreground whitespace-pre-wrap leading-relaxed">{previewBody}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit modal */}
      {editingId && (
        <Card className="border-primary/30">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="font-display text-lg">Edit Template</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X size={16} /></Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-body text-sm">Subject Line</Label>
              <Input value={editSubject} onChange={e => setEditSubject(e.target.value)} className="font-body text-sm mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">Email Body</Label>
              <Textarea value={editBody} onChange={e => setEditBody(e.target.value)} className="font-body text-sm mt-1 min-h-[200px]" />
            </div>
            <div className="flex items-center gap-2">
              <Label className="font-body text-xs text-muted-foreground">Variables:</Label>
              <div className="flex flex-wrap gap-1">
                {templates.find(t => t.id === editingId)?.variables.map(v => (
                  <Badge key={v} variant="outline" className="text-[10px] font-mono cursor-pointer" onClick={() => {
                    setEditBody(prev => prev + `{{${v}}}`);
                    toast({ title: "Variable Inserted" });
                  }}>{`{{${v}}}`}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="font-body gap-1" onClick={saveEdit}><Save size={14} /> Save</Button>
              <Button variant="outline" className="font-body" onClick={() => setEditingId(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(t => (
          <Card key={t.id} className={!t.active ? "opacity-60" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-display text-base">{t.name}</CardTitle>
                    <Badge className={categoryColors[t.category]}>{t.category}</Badge>
                  </div>
                  <CardDescription className="font-body text-xs font-mono">{t.subject}</CardDescription>
                </div>
                <Switch checked={t.active} onCheckedChange={() => toggleActive(t.id)} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-body text-xs text-muted-foreground line-clamp-2 mb-3">{t.body}</p>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground font-body">Last edited: {t.lastEdited} • {t.variables.length} variables</p>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setPreviewId(t.id)} title="Preview"><Eye size={14} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => startEdit(t)} title="Edit"><Pencil size={14} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => duplicateTemplate(t)} title="Duplicate"><Copy size={14} /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminEmailTemplates;

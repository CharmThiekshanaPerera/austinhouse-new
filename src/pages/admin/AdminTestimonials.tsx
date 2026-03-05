import { useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { useData, Testimonial } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const emptyTestimonial = { name: "", company: "", role: "", content: "", avatarUrl: "", rating: 5, featured: false };

const AdminTestimonials = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyTestimonial);

  const set = (key: string, val: string | number | boolean) => setForm(prev => ({ ...prev, [key]: val }));

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, company: t.company, role: t.role, content: t.content, avatarUrl: t.avatarUrl, rating: t.rating, featured: t.featured });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.content) { toast({ title: "Error", description: "Name and content required.", variant: "destructive" }); return; }
    if (editing) {
      updateTestimonial({ ...editing, ...form });
      toast({ title: "Updated ✨", description: `${form.name}'s testimonial updated.` });
    } else {
      addTestimonial(form);
      toast({ title: "Added ✨", description: `${form.name}'s testimonial added.` });
    }
    setShowForm(false); setEditing(null); setForm(emptyTestimonial);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Testimonials</h1>
          <p className="text-muted-foreground font-body text-sm">{testimonials.length} testimonials · {testimonials.filter(t => t.featured).length} featured</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyTestimonial); }} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
            <Plus size={16} className="mr-2" /> Add Testimonial
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-lg">{editing ? "Edit Testimonial" : "Add Testimonial"}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Client Name" value={form.name} onChange={e => set("name", e.target.value)} className="bg-background" />
              <Input placeholder="Company / Title" value={form.company} onChange={e => set("company", e.target.value)} className="bg-background" />
            </div>
            <Input placeholder="Role (e.g. Client, Bride)" value={form.role} onChange={e => set("role", e.target.value)} className="bg-background" />
            <Input placeholder="Avatar URL" value={form.avatarUrl} onChange={e => set("avatarUrl", e.target.value)} className="bg-background" />
            <Textarea placeholder="Testimonial content" value={form.content} onChange={e => set("content", e.target.value)} className="bg-background" rows={3} />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-body text-muted-foreground">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => set("rating", n)}>
                      <Star size={18} className={n <= form.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Switch checked={form.featured} onCheckedChange={v => set("featured", v)} />
                <span className="text-sm font-body text-muted-foreground">Featured</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
                {editing ? "Update" : "Add"}
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyTestimonial); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {testimonials.map(t => (
          <Card key={t.id} className="border-border">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0 font-display text-sm font-bold text-foreground">
                {t.avatarUrl ? <img src={t.avatarUrl} alt={t.name} className="w-full h-full rounded-full object-cover" /> : t.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-sm font-semibold text-foreground">{t.name}</h3>
                  {t.featured && <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px]">Featured</Badge>}
                </div>
                <p className="text-muted-foreground font-body text-xs">{t.role} · {t.company}</p>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map(n => <Star key={n} size={12} className={n <= t.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"} />)}
                </div>
                <p className="text-foreground font-body text-sm mt-2 line-clamp-2">"{t.content}"</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(t)}><Pencil size={14} /></Button>
                <Button size="sm" variant="destructive" onClick={() => { deleteTestimonial(t.id); toast({ title: "Deleted" }); }}><Trash2 size={14} /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;

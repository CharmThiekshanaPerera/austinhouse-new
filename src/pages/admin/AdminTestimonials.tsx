import { useState } from "react";
import { Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { useData, Testimonial } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const emptyTestimonial = { author: "", text: "", rating: 5 };

const AdminTestimonials = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial, testimonialsLoading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyTestimonial);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (key: string, val: string | number) => setForm(prev => ({ ...prev, [key]: val }));

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ author: t.author, text: t.text, rating: t.rating });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.author || !form.text) {
      toast({ title: "Error", description: "Author and text required.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      if (editing) {
        await updateTestimonial(editing.id, form);
        toast({ title: "Updated ✨", description: `Testimonial updated.` });
      } else {
        await addTestimonial(form);
        toast({ title: "Added ✨", description: `Testimonial added.` });
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyTestimonial);
    } catch (e) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (testimonialsLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Testimonials</h1>
          <p className="text-muted-foreground font-body text-sm">{testimonials.length} testimonials</p>
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
            <Input placeholder="Author Name" value={form.author} onChange={e => set("author", e.target.value)} className="bg-background" />
            <Textarea placeholder="Testimonial text" value={form.text} onChange={e => set("text", e.target.value)} className="bg-background" rows={3} />
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
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={isSubmitting} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : editing ? "Update" : "Add"}
              </Button>
              <Button variant="outline" disabled={isSubmitting} onClick={() => { setShowForm(false); setEditing(null); setForm(emptyTestimonial); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {testimonials.map(t => (
          <Card key={t.id} className="border-border">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0 font-display text-sm font-bold text-foreground">
                {t.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-semibold text-foreground">{t.author}</h3>
                <div className="flex gap-0.5 mt-1 mb-2">
                  {[1, 2, 3, 4, 5].map(n => <Star key={n} size={12} className={n <= t.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"} />)}
                </div>
                <p className="text-foreground font-body text-sm line-clamp-2">"{t.text}"</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(t)}><Pencil size={14} /></Button>
                <Button size="sm" variant="destructive" onClick={async () => { await deleteTestimonial(t.id); toast({ title: "Deleted" }); }}><Trash2 size={14} /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;

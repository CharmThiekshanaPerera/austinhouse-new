import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Upload, Eye } from "lucide-react";
import { useData, Service } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { uploadImage } from "@/lib/uploadsApi";
import ServiceModal from "@/components/ServiceModal";

const SERVICE_CATEGORIES = [
  "Facials",
  "Chemical Peels",
  "Waxing Treatments",
  "Specialized Procedures",
  "Anti-aging Skin Tightening Treatments",
  "Intimate Area Services",
  "Wart Removal",
  "Micro-Dermabrasion",
  "Other",
] as const;

type ServiceFormData = Omit<Service, "id"> & { id?: string };

const emptyService: ServiceFormData = {
  image: "",
  category: "Facials",
  title: "",
  duration: "",
  price: "",
  rating: 5.0,
  description: "",
  benefits: ["", "", "", ""],
};

const ServiceForm = ({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Service;
  onSave: (data: ServiceFormData) => Promise<void>;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState<ServiceFormData>(initial ? { ...initial } : emptyService);
  const [customCategory, setCustomCategory] = useState<string>(() => (initial?.category && !SERVICE_CATEGORIES.includes(initial.category as any) ? initial.category : ""));
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : form.image), [file, form.image]);
  useEffect(() => {
    if (!file) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [file, previewUrl]);

  const set = (key: keyof ServiceFormData, val: ServiceFormData[keyof ServiceFormData]) => setForm(prev => ({ ...prev, [key]: val }));
  const updateBenefit = (i: number, val: string) => {
    const b = [...form.benefits];
    b[i] = val;
    set("benefits", b);
  };

  const resolvedCategory = form.category === "Other" ? customCategory.trim() : (form.category ?? "Services");

  const save = async () => {
    const title = form.title.trim();
    const duration = form.duration.trim();
    const price = form.price.trim();
    const description = form.description.trim();
    const category = resolvedCategory.trim();

    if (!title) {
      toast({ title: "Error", description: "Title is required.", variant: "destructive" });
      return;
    }
    if (!price) {
      toast({ title: "Error", description: "Price is required.", variant: "destructive" });
      return;
    }
    if (!duration) {
      toast({ title: "Error", description: "Duration is required.", variant: "destructive" });
      return;
    }
    if (!description) {
      toast({ title: "Error", description: "Description is required.", variant: "destructive" });
      return;
    }
    if (form.category === "Other" && !category) {
      toast({ title: "Error", description: "Please enter a category.", variant: "destructive" });
      return;
    }
    if (!Number.isFinite(form.rating) || form.rating < 0 || form.rating > 5) {
      toast({ title: "Error", description: "Rating must be a number between 0 and 5.", variant: "destructive" });
      return;
    }
    if (!file && !form.image) {
      toast({ title: "Error", description: "Please upload an image.", variant: "destructive" });
      return;
    }
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({ title: "Error", description: "Only image files are allowed.", variant: "destructive" });
        return;
      }
      const maxBytes = 5 * 1024 * 1024;
      if (file.size > maxBytes) {
        toast({ title: "Error", description: "Image must be 5MB or smaller.", variant: "destructive" });
        return;
      }
    }

    setSaving(true);
    try {
      let imageUrl = form.image;
      if (file) imageUrl = await uploadImage(file);

      await onSave({
        ...form,
        title,
        duration,
        price,
        description,
        image: imageUrl,
        category: category || "Services",
        benefits: form.benefits.filter(b => b.trim() !== ""),
      });
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Request failed.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const isEditing = Boolean(initial?.id);

  return (
    <form
      className="space-y-5"
      onSubmit={e => {
        e.preventDefault();
        void save();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-body text-foreground">Title <span className="text-destructive">*</span></label>
          <Input
            placeholder="e.g. Signature Gold Facial"
            value={form.title}
            onChange={e => set("title", e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-body text-foreground">Category</label>
          <select
            value={form.category ?? "Facials"}
            onChange={e => set("category", e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {SERVICE_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {form.category === "Other" && (
            <Input
              placeholder="Enter category name"
              value={customCategory}
              onChange={e => setCustomCategory(e.target.value)}
              className="bg-background"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-body text-foreground">Duration</label>
          <Input placeholder="e.g. 90 min" value={form.duration} onChange={e => set("duration", e.target.value)} className="bg-background" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-body text-foreground">Price <span className="text-destructive">*</span></label>
          <Input placeholder="e.g. LKR 12,500" value={form.price} onChange={e => set("price", e.target.value)} className="bg-background" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-body text-foreground">Rating</label>
          <Input
            type="number"
            step="0.1"
            min={0}
            max={5}
            placeholder="0 - 5"
            value={Number.isFinite(form.rating) ? form.rating : ""}
            onChange={e => set("rating", e.target.value === "" ? Number.NaN : Number(e.target.value))}
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-body text-foreground">Image <span className="text-destructive">*</span></label>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1 space-y-2 w-full">
            <Input
              placeholder="https://... (Or upload below)"
              value={form.image}
              onChange={e => {
                set("image", e.target.value);
                setFile(null); // Clear file if user types a URL
              }}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground font-body">Or upload a file from your computer below. Note: uploading a file overrides the URL above.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-body hidden md:inline">OR</span>
            <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap bg-secondary/50 hover:bg-secondary px-4 py-2 rounded-md transition-colors border border-border">
              <Upload size={14} />
              <span className="font-semibold font-body">{file ? "Change File" : "Upload File"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                    set("image", ""); // Clear text URL since we have a file
                  }
                }}
              />
            </label>
          </div>
        </div>

        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-28 h-28 rounded-md object-cover border border-border" />
        ) : (
          <p className="text-xs text-muted-foreground font-body">No image selected.</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-body text-foreground">Description</label>
        <Textarea placeholder="Write a short service description..." value={form.description} onChange={e => set("description", e.target.value)} className="bg-background" rows={4} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-body text-foreground">Benefits</label>
          <span className="text-xs text-muted-foreground font-body">Up to 4</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {form.benefits.map((b, i) => (
            <Input key={i} placeholder={`Benefit ${i + 1}`} value={b} onChange={e => updateBenefit(i, e.target.value)} className="bg-background" />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={saving}
          className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider"
        >
          {saving ? "Saving..." : isEditing ? "Update Service" : "Create Service"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving} className="font-body text-xs uppercase tracking-wider">Cancel</Button>
      </div>
    </form>
  );
};

const AdminServices = () => {
  const { services, addService, updateService, deleteService } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [previewing, setPreviewing] = useState<Service | null>(null);

  const handleSave = async (data: ServiceFormData) => {
    try {
      if (data.id) {
        await updateService(data as Service);
        toast({ title: "Updated", description: `${data.title} updated.` });
      } else {
        await addService(data);
        toast({ title: "Added", description: `${data.title} added.` });
      }
      setShowForm(false);
      setEditing(null);
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Request failed.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Services</h1>
          <p className="text-muted-foreground font-body text-sm">{services.length} services</p>
        </div>
        {!showForm && !editing && (
          <Button onClick={() => setShowForm(true)} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
            <Plus size={16} className="mr-2" /> Add Service
          </Button>
        )}
      </div>

      {(showForm || editing) && (
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-lg">{editing ? "Edit Service" : "Add New Service"}</CardTitle></CardHeader>
          <CardContent>
            <ServiceForm initial={editing || undefined} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {services.map(s => (
          <Card key={s.id} className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              {s.image && <img src={s.image} alt={s.title} className="w-14 h-14 rounded-md object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-semibold text-foreground truncate">{s.title}</h3>
                <p className="text-muted-foreground font-body text-xs">
                  {(s.category || "Services")} · {s.duration} · {s.price} · ⭐ {s.rating}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" onClick={() => setPreviewing(s)}><Eye size={14} /></Button>
                <Button size="sm" variant="outline" onClick={() => { setEditing(s); setShowForm(false); }}><Pencil size={14} /></Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    void (async () => {
                      try {
                        await deleteService(s.id);
                        toast({ title: "Deleted", description: `${s.title} removed.` });
                      } catch (e) {
                        toast({
                          title: "Error",
                          description: e instanceof Error ? e.message : "Request failed.",
                          variant: "destructive",
                        });
                      }
                    })();
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Preview Modal */}
      {previewing && (
        <ServiceModal
          service={previewing}
          isOpen={!!previewing}
          onClose={() => setPreviewing(null)}
          onBookNow={() => {
             setPreviewing(null);
             toast({ title: "Preview Mode", description: "Booking is disabled in admin preview." });
          }}
        />
      )}
    </div>
  );
};

export default AdminServices;

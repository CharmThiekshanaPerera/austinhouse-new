import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { useData, Product } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { uploadImage } from "@/lib/uploadsApi";

const BASE_PRODUCT_CATEGORIES = [
  "After Chemical Peels",
  "Daily Care",
  "Sun Protection",
  "After Manicure & Pedicure",
  "Anti-Aging",
] as const;

const CUSTOM_CATEGORIES_KEY = "admin_product_custom_categories";

function loadCustomCategories(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is string => typeof x === "string")
      .map(x => x.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function saveCustomCategories(values: string[]) {
  const cleaned = Array.from(new Set(values.map(v => v.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(cleaned));
  return cleaned;
}

type ProductFormData = Omit<Product, "id"> & { id?: string };

const emptyProduct: ProductFormData = { image: "", name: "", category: BASE_PRODUCT_CATEGORIES[0], price: "", priceNum: 0, description: "" };

const ProductForm = ({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Product;
  onSave: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState<ProductFormData>(initial ? { ...initial } : emptyProduct);
  const [customCategories, setCustomCategories] = useState<string[]>(() => loadCustomCategories());

  const categoryOptions = useMemo(() => {
    const merged = Array.from(new Set([...BASE_PRODUCT_CATEGORIES, ...customCategories]));
    return merged.sort((a, b) => a.localeCompare(b));
  }, [customCategories]);

  const initialCategoryIsKnown = Boolean(initial?.category && categoryOptions.includes(initial.category));
  const [categorySelect, setCategorySelect] = useState<string>(() => {
    if (!initial?.category) return BASE_PRODUCT_CATEGORIES[0];
    return initialCategoryIsKnown ? initial.category : "Other";
  });
  const [customCategory, setCustomCategory] = useState<string>(() => (initial?.category && !initialCategoryIsKnown ? initial.category : ""));

  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : form.image), [file, form.image]);
  useEffect(() => {
    if (!file) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [file, previewUrl]);

  const set = (key: keyof ProductFormData, val: ProductFormData[keyof ProductFormData]) => setForm(prev => ({ ...prev, [key]: val }));
  const resolvedCategory = categorySelect === "Other" ? customCategory.trim() : categorySelect.trim();

  const save = async () => {
    const name = form.name.trim();
    const price = form.price.trim();
    const description = form.description.trim();
    const category = resolvedCategory.trim();

    if (!name) return toast({ title: "Error", description: "Product name is required.", variant: "destructive" });
    if (!price) return toast({ title: "Error", description: "Price is required.", variant: "destructive" });
    if (!category) return toast({ title: "Error", description: "Category is required.", variant: "destructive" });
    if (!description) return toast({ title: "Error", description: "Description is required.", variant: "destructive" });

    if (!file && !form.image) return toast({ title: "Error", description: "Please upload an image.", variant: "destructive" });
    if (file) {
      if (!file.type.startsWith("image/")) return toast({ title: "Error", description: "Only image files are allowed.", variant: "destructive" });
      const maxBytes = 5 * 1024 * 1024;
      if (file.size > maxBytes) return toast({ title: "Error", description: "Image must be 5MB or smaller.", variant: "destructive" });
    }

    setSaving(true);
    try {
      let imageUrl = form.image;
      if (file) imageUrl = await uploadImage(file);

      if (categorySelect === "Other" && category) {
        const next = saveCustomCategories([...customCategories, category]);
        setCustomCategories(next);
        setCategorySelect(category);
        setCustomCategory("");
      }

      await onSave({ ...form, name, price, description, category, image: imageUrl });
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Request failed.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const isEditing = Boolean(initial?.id);

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        void save();
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-body text-foreground">Product Name <span className="text-destructive">*</span></label>
        <Input placeholder="e.g. Radiance Revival Serum" value={form.name} onChange={e => set("name", e.target.value)} className="bg-background" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-body text-foreground">Category <span className="text-destructive">*</span></label>
        <select
          value={categorySelect}
          onChange={e => setCategorySelect(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {categoryOptions.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
          <option value="Other">Other</option>
        </select>
        {categorySelect === "Other" && (
          <Input
            placeholder="Enter category name"
            value={customCategory}
            onChange={e => setCustomCategory(e.target.value)}
            className="bg-background"
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-body text-foreground">Price <span className="text-destructive">*</span></label>
          <Input placeholder="e.g. LKR 8,500" value={form.price} onChange={e => set("price", e.target.value)} className="bg-background" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-body text-foreground">Price Number</label>
          <Input
            type="number"
            placeholder="e.g. 8500"
            value={Number.isFinite(form.priceNum) && form.priceNum > 0 ? form.priceNum : ""}
            onChange={e => set("priceNum", e.target.value === "" ? 0 : Number(e.target.value))}
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-body text-foreground">Image <span className="text-destructive">*</span></label>
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <Upload size={14} />
            <span>{file ? "Change image" : "Upload image"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <p className="text-xs text-muted-foreground font-body">Uploads to the backend and saves the image URL on the product.</p>
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-28 h-28 rounded-md object-cover border border-border" />
        ) : (
          <p className="text-xs text-muted-foreground font-body">No image selected.</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-body text-foreground">Description <span className="text-destructive">*</span></label>
        <Textarea placeholder="Description" value={form.description} onChange={e => set("description", e.target.value)} className="bg-background" rows={3} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={saving} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
          {saving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving} className="font-body text-xs uppercase tracking-wider">
          Cancel
        </Button>
      </div>
    </form>
  );
};

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const handleSave = async (data: ProductFormData) => {
    try {
      if (data.id) {
        await updateProduct(data as Product);
        toast({ title: "Updated", description: `${data.name} updated.` });
      } else {
        await addProduct(data);
        toast({ title: "Added", description: `${data.name} added.` });
      }
      setShowForm(false);
      setEditing(null);
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Request failed.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Products</h1>
          <p className="text-muted-foreground font-body text-sm">{products.length} products</p>
        </div>
        {!showForm && !editing && (
          <Button onClick={() => setShowForm(true)} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
            <Plus size={16} className="mr-2" /> Add Product
          </Button>
        )}
      </div>

      {(showForm || editing) && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">{editing ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              initial={editing || undefined}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {products.map(p => (
          <Card key={p.id} className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              {p.image && <img src={p.image} alt={p.name} className="w-14 h-14 rounded-md object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-semibold text-foreground truncate">{p.name}</h3>
                <p className="text-muted-foreground font-body text-xs">
                  {p.category} · {p.price}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" onClick={() => { setEditing(p); setShowForm(false); }}>
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    void (async () => {
                      try {
                        await deleteProduct(p.id);
                        toast({ title: "Deleted", description: `${p.name} removed.` });
                      } catch (e) {
                        toast({ title: "Error", description: e instanceof Error ? e.message : "Request failed.", variant: "destructive" });
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
    </div>
  );
};

export default AdminProducts;

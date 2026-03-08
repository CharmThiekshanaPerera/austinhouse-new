import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, Search, Loader2 } from "lucide-react";
import { useData, BlogPost } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const ADMIN_AUTHOR_ID = "admin";

const emptyPost = {
  title: "",
  slug: "",
  content: "",
  author_id: ADMIN_AUTHOR_ID,
  published: false,
  image: "" as string | null,
};

const toSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminBlog = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, blogLoading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyPost);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (key: string, val: string | boolean | null) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      author_id: post.author_id,
      published: post.published,
      image: post.image ?? "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title) {
      toast({ title: "Error", description: "Title is required.", variant: "destructive" });
      return;
    }
    const slug = form.slug.trim() || toSlug(form.title);
    setSaving(true);
    try {
      const payload = { ...form, slug, image: form.image || null };
      if (editing) {
        await updateBlogPost(editing.id, payload);
        toast({ title: "Updated ✨", description: `"${form.title}" updated.` });
      } else {
        await addBlogPost({ ...payload, author_id: ADMIN_AUTHOR_ID });
        toast({ title: "Created ✨", description: `"${form.title}" published.` });
      }
      setShowForm(false); setEditing(null); setForm(emptyPost);
    } catch {
      toast({ title: "Error", description: "Failed to save post.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    try {
      await deleteBlogPost(post.id);
      toast({ title: "Deleted", description: `"${post.title}" removed.` });
    } catch {
      toast({ title: "Error", description: "Failed to delete post.", variant: "destructive" });
    }
  };

  const filtered = blogPosts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase()),
  );

  if (blogLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="animate-spin" size={20} />
        <span className="font-body text-sm">Loading blog posts…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Blog Posts</h1>
          <p className="text-muted-foreground font-body text-sm">
            {blogPosts.length} posts · {blogPosts.filter(p => p.published).length} published
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => { setShowForm(true); setEditing(null); setForm(emptyPost); }}
            className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider"
          >
            <Plus size={16} className="mr-2" /> New Post
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-lg">{editing ? "Edit Post" : "New Blog Post"}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Post Title *"
              value={form.title}
              onChange={e => {
                const title = e.target.value;
                setForm(prev => ({ ...prev, title, slug: toSlug(title) }));
              }}
              className="bg-background"
            />
            <Input
              placeholder="Slug (auto-generated)"
              value={form.slug}
              onChange={e => set("slug", e.target.value)}
              className="bg-background font-mono text-sm"
            />
            <Input placeholder="Header Image URL (optional)" value={form.image ?? ""} onChange={e => set("image", e.target.value)} className="bg-background" />
            <Textarea
              placeholder="Content (Markdown supported)"
              value={form.content}
              onChange={e => set("content", e.target.value)}
              className="bg-background font-mono text-sm"
              rows={10}
            />
            <div className="flex items-center gap-3">
              <Switch checked={form.published} onCheckedChange={v => set("published", v)} />
              <span className="text-sm font-body text-muted-foreground">{form.published ? "Published" : "Draft"}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
                {saving ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
                {editing ? "Update" : "Create"} Post
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyPost); }} className="font-body text-xs uppercase tracking-wider">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {preview && (
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Preview: {preview.title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>✕</Button>
          </CardHeader>
          <CardContent>
            {preview.image && <img src={preview.image} alt={preview.title} className="w-full h-48 object-cover rounded-lg mb-4" />}
            <div className="font-body text-sm text-foreground whitespace-pre-wrap">{preview.content}</div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)} className="bg-background pl-9" />
      </div>

      {/* Post list */}
      <div className="grid gap-3">
        {filtered.map(post => (
          <Card key={post.id} className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              {post.image && <img src={post.image} alt={post.title} className="w-14 h-14 rounded-md object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-sm font-semibold text-foreground truncate">{post.title}</h3>
                  <Badge variant="outline" className={post.published ? "text-emerald-500 border-emerald-500/20" : "text-muted-foreground"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="text-muted-foreground font-body text-[10px] mt-0.5 font-mono">/blog/{post.slug}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button size="sm" variant="ghost" onClick={() => setPreview(post)} title="Preview"><Eye size={14} /></Button>
                <Button size="sm" variant="outline" onClick={() => openEdit(post)}><Pencil size={14} /></Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(post)}><Trash2 size={14} /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground font-body text-sm text-center py-8">
            {blogPosts.length === 0 ? "No blog posts yet. Create your first post above." : "No posts match your search."}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;

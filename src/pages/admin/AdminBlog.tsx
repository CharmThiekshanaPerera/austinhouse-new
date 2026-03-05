import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { useData, BlogPost } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const emptyPost = { title: "", excerpt: "", content: "", category: "", imageUrl: "", published: false };

const AdminBlog = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyPost);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<BlogPost | null>(null);

  const set = (key: string, val: string | boolean) => setForm(prev => ({ ...prev, [key]: val }));

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({ title: post.title, excerpt: post.excerpt, content: post.content, category: post.category, imageUrl: post.imageUrl, published: post.published });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title) { toast({ title: "Error", description: "Title is required.", variant: "destructive" }); return; }
    if (editing) {
      updateBlogPost({ ...editing, ...form });
      toast({ title: "Updated ✨", description: `"${form.title}" updated.` });
    } else {
      addBlogPost(form);
      toast({ title: "Published ✨", description: `"${form.title}" created.` });
    }
    setShowForm(false); setEditing(null); setForm(emptyPost);
  };

  const filtered = blogPosts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Blog Posts</h1>
          <p className="text-muted-foreground font-body text-sm">{blogPosts.length} posts · {blogPosts.filter(p => p.published).length} published</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyPost); }} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
            <Plus size={16} className="mr-2" /> New Post
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-lg">{editing ? "Edit Post" : "New Blog Post"}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Post Title" value={form.title} onChange={e => set("title", e.target.value)} className="bg-background" />
            <Input placeholder="Category (e.g. Skincare Tips)" value={form.category} onChange={e => set("category", e.target.value)} className="bg-background" />
            <Input placeholder="Header Image URL" value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} className="bg-background" />
            <Textarea placeholder="Excerpt / Summary" value={form.excerpt} onChange={e => set("excerpt", e.target.value)} className="bg-background" rows={2} />
            <Textarea placeholder="Content (Markdown supported)" value={form.content} onChange={e => set("content", e.target.value)} className="bg-background font-mono text-sm" rows={10} />
            <div className="flex items-center gap-3">
              <Switch checked={form.published} onCheckedChange={v => set("published", v)} />
              <span className="text-sm font-body text-muted-foreground">{form.published ? "Published" : "Draft"}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
                {editing ? "Update" : "Create"} Post
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyPost); }} className="font-body text-xs uppercase tracking-wider">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      {preview && (
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Preview: {preview.title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>✕</Button>
          </CardHeader>
          <CardContent>
            {preview.imageUrl && <img src={preview.imageUrl} alt={preview.title} className="w-full h-48 object-cover rounded-lg mb-4" />}
            <p className="text-muted-foreground font-body text-sm italic mb-4">{preview.excerpt}</p>
            <div className="font-body text-sm text-foreground whitespace-pre-wrap">{preview.content}</div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="bg-background pl-9" />
      </div>

      {/* Posts list */}
      <div className="grid gap-3">
        {filtered.map(post => (
          <Card key={post.id} className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-14 h-14 rounded-md object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-sm font-semibold text-foreground truncate">{post.title}</h3>
                  <Badge variant="outline" className={post.published ? "text-emerald-500 border-emerald-500/20" : "text-muted-foreground"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                  {post.category && <Badge variant="secondary" className="text-xs">{post.category}</Badge>}
                </div>
                <p className="text-muted-foreground font-body text-xs mt-0.5 truncate">{post.excerpt || "No excerpt"}</p>
                <p className="text-muted-foreground font-body text-[10px] mt-0.5">{format(new Date(post.createdAt), "MMM d, yyyy")}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button size="sm" variant="ghost" onClick={() => setPreview(post)} title="Preview">
                  <Eye size={14} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => openEdit(post)}><Pencil size={14} /></Button>
                <Button size="sm" variant="destructive" onClick={() => { deleteBlogPost(post.id); toast({ title: "Deleted", description: `"${post.title}" removed.` }); }}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground font-body text-sm text-center py-8">No blog posts found.</p>}
      </div>
    </div>
  );
};

export default AdminBlog;

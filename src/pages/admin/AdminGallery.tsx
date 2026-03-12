import { useState } from "react";
import { Image, Trash2, Plus, Upload, Loader2, LayoutGrid } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import type { GalleryCategory } from "@/lib/galleryApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const AdminGallery = () => {
    const { galleryImages, beforeAfterPairs, addGalleryImage, deleteGalleryImage, addBeforeAfterPair, deleteBeforeAfterPair } = useData();

    const [activeTab, setActiveTab] = useState<"grid" | "beforeAfter">("grid");
    const [isUploading, setIsUploading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form states for Grid Image
    const [gridForm, setGridForm] = useState({ image: "", alt: "", category: "Environment" as GalleryCategory, type: "image" as "image" | "video" });

    // Form states for Before/After Pair
    const [pairForm, setPairForm] = useState({ before_image: "", after_image: "", title: "", description: "" });

    const handleAddGridImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gridForm.image || !gridForm.alt) return;

        setIsUploading(true);
        try {
            await addGalleryImage(gridForm);
            toast({ title: "Image/Video Added ✨" });
            setGridForm({ image: "", alt: "", category: "Environment", type: "image" });
            setIsDialogOpen(false);
        } catch {
            toast({ title: "Error", description: "Failed to upload image.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddPair = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pairForm.before_image || !pairForm.after_image || !pairForm.title) return;

        setIsUploading(true);
        try {
            await addBeforeAfterPair(pairForm);
            toast({ title: "Before/After Uploaded ✨" });
            setPairForm({ before_image: "", after_image: "", title: "", description: "" });
            setIsDialogOpen(false);
        } catch {
            toast({ title: "Error", description: "Failed to upload before/after pair.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">Gallery Management</h1>
                    <p className="text-muted-foreground font-body text-sm mt-1">Manage standard gallery photos and before/after treatments</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gold-gradient text-primary-foreground">
                            <Plus size={16} className="mr-2" /> Upload New
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Upload Image</DialogTitle>
                        </DialogHeader>
                        <div className="flex gap-4 mb-4">
                            <Button variant={activeTab === "grid" ? "default" : "outline"} onClick={() => setActiveTab("grid")} className="flex-1">
                                Standard Photo
                            </Button>
                            <Button variant={activeTab === "beforeAfter" ? "default" : "outline"} onClick={() => setActiveTab("beforeAfter")} className="flex-1">
                                Before / After
                            </Button>
                        </div>

                        {activeTab === "grid" ? (
                            <form onSubmit={handleAddGridImage} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Image URL</label>
                                    <Input required placeholder="https://..." value={gridForm.image} onChange={(e) => setGridForm({ ...gridForm, image: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Alt Title</label>
                                    <Input required placeholder="e.g. Luxurious Spa Lounge" value={gridForm.alt} onChange={(e) => setGridForm({ ...gridForm, alt: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Category</label>
                                    <Select value={gridForm.category} onValueChange={(v) => setGridForm({ ...gridForm, category: v as GalleryCategory })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["Environment", "Treatments", "Results", "Products"].map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Type</label>
                                    <Select value={gridForm.type} onValueChange={(v) => setGridForm({ ...gridForm, type: v as "image" | "video" })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="image">Standard Image</SelectItem>
                                            <SelectItem value="video">YouTube Video</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {gridForm.type === "video" && (
                                    <p className="text-[10px] text-muted-foreground mt-1 italic">
                                        Paste the full YouTube URL (e.g., https://www.youtube.com/watch?v=...)
                                    </p>
                                )}
                                <Button type="submit" disabled={isUploading} className="w-full bg-gold-gradient text-primary-foreground">
                                    {isUploading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
                                    Save Photo
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleAddPair} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Before URL</label>
                                        <Input required placeholder="https://..." value={pairForm.before_image} onChange={(e) => setPairForm({ ...pairForm, before_image: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">After URL</label>
                                        <Input required placeholder="https://..." value={pairForm.after_image} onChange={(e) => setPairForm({ ...pairForm, after_image: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Treatment Name</label>
                                    <Input required placeholder="e.g. Signature Gold Facial" value={pairForm.title} onChange={(e) => setPairForm({ ...pairForm, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Description</label>
                                    <Textarea required placeholder="Describe the results..." value={pairForm.description} onChange={(e) => setPairForm({ ...pairForm, description: e.target.value })} />
                                </div>
                                <Button type="submit" disabled={isUploading} className="w-full bg-gold-gradient text-primary-foreground">
                                    {isUploading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
                                    Save Transformation
                                </Button>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Standard Gallery Grid List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><LayoutGrid size={20} className="text-gold" /> Photo Gallery</CardTitle>
                        <CardDescription>{galleryImages.length} images assigned to categories</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                        {galleryImages.map((img) => {
                            const isVideo = img.type === "video";
                            let displayImage = img.image;
                            
                            if (isVideo) {
                                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                                const match = img.image.match(regExp);
                                const youtubeId = (match && match[2].length === 11) ? match[2] : null;
                                if (youtubeId) {
                                    displayImage = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
                                }
                            }

                            return (
                                <div key={img.id} className="group relative rounded-lg overflow-hidden border border-border">
                                    <div className="relative group">
                                        <img src={displayImage} alt={img.alt} className="w-full h-32 object-cover" />
                                        {isVideo && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
                                                    <Plus className="rotate-45" size={24} /> {/* Placeholder for play icon, using Plus rotated as X/Playish */}
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="destructive" 
                                                size="icon" 
                                                className="h-8 w-8" 
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete this image?")) {
                                                        deleteGalleryImage(img.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-card border-t border-border">
                                        <p className="font-semibold text-sm truncate">{img.alt}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs text-muted-foreground">{img.category}</p>
                                            <span className="text-[10px] uppercase font-bold text-gold">{img.type}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Before/After List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Image size={20} className="text-gold" /> Before & After Treatments</CardTitle>
                        <CardDescription>{beforeAfterPairs.length} transformational pairings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {beforeAfterPairs.map((pair) => (
                            <div key={pair.id} className="relative rounded-lg overflow-hidden border border-border bg-card">
                                <div className="grid grid-cols-2">
                                    <img src={pair.before_image} alt={`${pair.title} before`} className="w-full h-32 object-cover border-r border-border" />
                                    <img src={pair.after_image} alt={`${pair.title} after`} className="w-full h-32 object-cover" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold">{pair.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{pair.description}</p>
                                </div>
                                <div className="absolute top-2 right-2">
                                    <Button 
                                        variant="destructive" 
                                        size="icon" 
                                        className="h-8 w-8" 
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this transformation?")) {
                                                deleteBeforeAfterPair(pair.id);
                                            }
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminGallery;

import { useState } from "react";
import { Trash2, Search, Download, UserPlus, Loader2 } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const AdminNewsletter = () => {
  const { newsletterSubscribers, subscribersLoading, addNewsletterSubscriber, updateNewsletterSubscriber, deleteNewsletterSubscriber } = useData();
  const [search, setSearch] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const active = newsletterSubscribers.filter(s => s.active).length;
  const inactive = newsletterSubscribers.filter(s => !s.active).length;
  const thisMonth = newsletterSubscribers.filter(s => {
    const d = new Date(s.subscribedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const filtered = newsletterSubscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if (!newEmail || !newEmail.includes("@")) { 
      toast({ title: "Error", description: "Enter a valid email.", variant: "destructive" }); 
      return; 
    }
    try {
      await addNewsletterSubscriber(newEmail);
      setNewEmail("");
      toast({ title: "Added ✨", description: `${newEmail} subscribed.` });
    } catch (e) {
      toast({ title: "Error", description: "Failed to subscribe or email already exists.", variant: "destructive" });
    }
  };

  const handleExport = () => {
    const csv = "Email,Status,Subscribed Date\n" + newsletterSubscribers
      .filter(s => s.active)
      .map(s => `${s.email},Active,${format(new Date(s.subscribedAt), "yyyy-MM-dd")}`)
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "CSV downloaded." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Newsletter</h1>
          <p className="text-muted-foreground font-body text-sm">{newsletterSubscribers.length} total · {active} active · {inactive} unsubscribed · {thisMonth} new this month</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="font-body text-xs uppercase tracking-wider">
          <Download size={14} className="mr-2" /> Export CSV
        </Button>
      </div>

      {/* Add subscriber */}
      <div className="flex gap-2">
        <Input placeholder="Add subscriber email..." value={newEmail} onChange={e => setNewEmail(e.target.value)} className="bg-background max-w-sm" />
        <Button onClick={handleAdd} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
          <UserPlus size={14} className="mr-2" /> Add
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search subscribers..." value={search} onChange={e => setSearch(e.target.value)} className="bg-background pl-9" />
      </div>

      {/* List */}
      {subscribersLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gold" size={32} /></div>
      ) : (
        <div className="grid gap-2">
          {filtered.map(s => (
            <Card key={s.id} className="border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-foreground">{s.email}</p>
                  <p className="text-muted-foreground font-body text-xs">Subscribed: {s.subscribedAt ? format(new Date(s.subscribedAt), "MMM d, yyyy") : "Unknown"}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={s.active} 
                      onCheckedChange={async (v) => {
                        try {
                          await updateNewsletterSubscriber({ ...s, active: v });
                          toast({ title: "Updated", description: "Subscriber status updated." });
                        } catch (e) {
                          toast({ title: "Error", description: "Failed to update subscriber.", variant: "destructive" });
                        }
                      }} 
                    />
                    <Badge variant="outline" className={s.active ? "text-emerald-500 border-emerald-500/20 text-xs" : "text-muted-foreground text-xs"}>
                      {s.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={async () => { 
                      try {
                        await deleteNewsletterSubscriber(s.id); 
                        toast({ title: "Removed" }); 
                      } catch (e) {
                        toast({ title: "Error", description: "Failed to remove subscriber.", variant: "destructive" });
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-muted-foreground font-body text-sm text-center py-8">No subscribers found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminNewsletter;

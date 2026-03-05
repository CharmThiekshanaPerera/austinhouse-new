import { useState } from "react";
import { Trash2, Mail, MailOpen, Reply, Search, ExternalLink } from "lucide-react";
import { useData, ContactMessage } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const AdminMessages = () => {
  const { contactMessages, updateContactMessage, deleteContactMessage } = useData();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const unread = contactMessages.filter(m => !m.read).length;

  const filtered = contactMessages
    .filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const openMessage = (m: ContactMessage) => {
    if (!m.read) updateContactMessage({ ...m, read: true });
    setSelected(m);
  };

  const toggleReplied = (m: ContactMessage) => {
    updateContactMessage({ ...m, replied: !m.replied });
    toast({ title: m.replied ? "Marked as unreplied" : "Marked as replied" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Messages</h1>
          <p className="text-muted-foreground font-body text-sm">{contactMessages.length} messages · {unread} unread</p>
        </div>
      </div>

      {/* Detail view */}
      {selected && (
        <Card className="border-border">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="font-display text-lg">{selected.subject}</CardTitle>
              <p className="text-muted-foreground font-body text-sm mt-1">
                From: <strong>{selected.name}</strong> &lt;{selected.email}&gt; · {format(new Date(selected.createdAt), "MMM d, yyyy 'at' HH:mm")}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>✕</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-accent/30 rounded-lg p-4 font-body text-sm text-foreground whitespace-pre-wrap">
              {selected.message}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${selected.email}?subject=Re: ${selected.subject}`, "_blank")}>
                <Reply size={14} className="mr-1" /> Reply via Email <ExternalLink size={12} className="ml-1" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => toggleReplied(selected)}>
                {selected.replied ? "Mark Unreplied" : "Mark Replied"}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => { deleteContactMessage(selected.id); setSelected(null); toast({ title: "Deleted" }); }}>
                <Trash2 size={14} className="mr-1" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} className="bg-background pl-9" />
      </div>

      {/* Messages list */}
      <div className="grid gap-2">
        {filtered.map(m => (
          <button
            key={m.id}
            onClick={() => openMessage(m)}
            className={cn(
              "w-full text-left p-4 rounded-lg border border-border transition-all hover:bg-accent/30",
              !m.read && "bg-primary/5 border-primary/20"
            )}
          >
            <div className="flex items-center gap-3">
              {!m.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("font-display text-sm", !m.read ? "font-bold text-foreground" : "text-foreground")}>{m.name}</span>
                  <span className="text-muted-foreground font-body text-xs">· {m.email}</span>
                  {m.replied && <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/20">Replied</Badge>}
                </div>
                <p className={cn("font-body text-sm truncate", !m.read ? "font-semibold text-foreground" : "text-muted-foreground")}>{m.subject}</p>
                <p className="text-muted-foreground font-body text-xs mt-0.5 truncate">{m.message}</p>
              </div>
              <span className="text-xs text-muted-foreground font-body flex-shrink-0">{format(new Date(m.createdAt), "MMM d")}</span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground font-body text-sm text-center py-8">No messages found.</p>}
      </div>
    </div>
  );
};

export default AdminMessages;

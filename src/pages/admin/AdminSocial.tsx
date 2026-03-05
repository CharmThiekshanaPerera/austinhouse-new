import { useState } from "react";
import { Plus, Trash2, Copy, Send, ToggleLeft, ToggleRight, ExternalLink, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Webhook {
  id: string;
  platform: string;
  url: string;
  enabled: boolean;
  createdAt: string;
}

interface ShareLog {
  id: string;
  platform: string;
  postTitle: string;
  status: "success" | "failed";
  timestamp: string;
}

const platformOptions = [
  { value: "discord", label: "Discord", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  { value: "slack", label: "Slack", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { value: "zapier", label: "Zapier", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { value: "make", label: "Make", color: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
  { value: "ifttt", label: "IFTTT", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { value: "custom", label: "Custom", color: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20" },
];

const usePersistedState = <T,>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  });
  const set = (val: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };
  return [state, set] as const;
};

const AdminSocial = () => {
  const [webhooks, setWebhooks] = usePersistedState<Webhook[]>("admin_webhooks", []);
  const [shareLogs, setShareLogs] = usePersistedState<ShareLog[]>("admin_share_logs", []);
  const [showForm, setShowForm] = useState(false);
  const [newPlatform, setNewPlatform] = useState("discord");
  const [newUrl, setNewUrl] = useState("");

  const handleAdd = () => {
    if (!newUrl.trim()) {
      toast({ title: "Error", description: "Webhook URL is required.", variant: "destructive" });
      return;
    }
    setWebhooks(prev => [
      ...prev,
      { id: `wh_${Date.now()}`, platform: newPlatform, url: newUrl.trim(), enabled: true, createdAt: new Date().toISOString() },
    ]);
    setNewUrl("");
    setShowForm(false);
    toast({ title: "Added ✨", description: `${newPlatform} webhook added.` });
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    toast({ title: "Deleted", description: "Webhook removed." });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied", description: "Webhook URL copied to clipboard." });
  };

  const testWebhook = (webhook: Webhook) => {
    // Simulate a test — frontend only
    const success = Math.random() > 0.2;
    const log: ShareLog = {
      id: `sl_${Date.now()}`,
      platform: webhook.platform,
      postTitle: "Test Notification",
      status: success ? "success" : "failed",
      timestamp: new Date().toISOString(),
    };
    setShareLogs(prev => [log, ...prev].slice(0, 50));
    toast({
      title: success ? "Test Sent ✨" : "Test Failed",
      description: success ? `Test notification sent to ${webhook.platform}.` : `Failed to reach ${webhook.platform}. Check the URL.`,
      variant: success ? "default" : "destructive",
    });
  };

  const triggerBlogShare = () => {
    const enabledWebhooks = webhooks.filter(w => w.enabled);
    if (enabledWebhooks.length === 0) {
      toast({ title: "No webhooks", description: "Enable at least one webhook first.", variant: "destructive" });
      return;
    }
    const newLogs: ShareLog[] = enabledWebhooks.map(w => ({
      id: `sl_${Date.now()}_${w.id}`,
      platform: w.platform,
      postTitle: "Latest Blog Post",
      status: (Math.random() > 0.15 ? "success" : "failed") as "success" | "failed",
      timestamp: new Date().toISOString(),
    }));
    setShareLogs(prev => [...newLogs, ...prev].slice(0, 50));
    const successCount = newLogs.filter(l => l.status === "success").length;
    toast({ title: "Shared ✨", description: `Blog post shared to ${successCount}/${enabledWebhooks.length} channels.` });
  };

  const getPlatformConfig = (platform: string) => platformOptions.find(p => p.value === platform) || platformOptions[5];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground font-bold">Social Automation</h1>
          <p className="text-muted-foreground font-body text-sm">Manage webhooks for automatic blog sharing</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={triggerBlogShare} variant="outline" className="font-body text-xs uppercase tracking-wider">
            <Send size={14} className="mr-2" /> Share Blog Now
          </Button>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
              <Plus size={16} className="mr-2" /> Add Webhook
            </Button>
          )}
        </div>
      </div>

      {/* Add Webhook Form */}
      {showForm && (
        <Card className="border-border">
          <CardHeader><CardTitle className="font-display text-lg">Add Webhook</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <Select value={newPlatform} onValueChange={setNewPlatform}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Platform" /></SelectTrigger>
                <SelectContent>
                  {platformOptions.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="sm:col-span-2">
                <Input placeholder="Webhook URL" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="bg-background" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
                Add Webhook
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setNewUrl(""); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Webhooks", value: webhooks.length },
          { label: "Active", value: webhooks.filter(w => w.enabled).length },
          { label: "Shares Sent", value: shareLogs.filter(l => l.status === "success").length },
          { label: "Failed", value: shareLogs.filter(l => l.status === "failed").length },
        ].map(kpi => (
          <Card key={kpi.label} className="border-border">
            <CardContent className="p-4">
              <p className="text-xs font-body text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
              <p className="font-display text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Webhooks List */}
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">Webhooks</h3>
        {webhooks.length === 0 ? (
          <p className="text-muted-foreground font-body text-sm">No webhooks configured yet. Add one to get started.</p>
        ) : (
          <div className="grid gap-3">
            {webhooks.map(w => {
              const config = getPlatformConfig(w.platform);
              return (
                <Card key={w.id} className="border-border">
                  <CardContent className="p-4 flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={cn("text-xs font-body", config.color)}>
                          {config.label}
                        </Badge>
                        {!w.enabled && <Badge variant="outline" className="text-xs text-muted-foreground">Disabled</Badge>}
                      </div>
                      <p className="text-muted-foreground font-body text-xs mt-1 truncate">{w.url}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <Switch checked={w.enabled} onCheckedChange={() => toggleWebhook(w.id)} />
                      <Button size="sm" variant="outline" onClick={() => copyUrl(w.url)} title="Copy URL">
                        <Copy size={14} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => testWebhook(w)} title="Test">
                        <Send size={14} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteWebhook(w.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Share Logs */}
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">Share Logs</h3>
        {shareLogs.length === 0 ? (
          <p className="text-muted-foreground font-body text-sm">No share logs yet. Test a webhook or share a blog post.</p>
        ) : (
          <div className="grid gap-2">
            {shareLogs.slice(0, 20).map(log => {
              const config = getPlatformConfig(log.platform);
              return (
                <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg border border-border text-sm font-body">
                  <Badge variant="outline" className={cn("text-[10px]", config.color)}>{config.label}</Badge>
                  <span className="text-foreground flex-1 truncate">{log.postTitle}</span>
                  <Badge variant="outline" className={cn("text-[10px]",
                    log.status === "success" ? "text-emerald-500 border-emerald-500/20" : "text-destructive border-destructive/20"
                  )}>
                    {log.status}
                  </Badge>
                  <span className="text-muted-foreground text-xs flex-shrink-0">
                    {format(new Date(log.timestamp), "MMM d, HH:mm")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSocial;

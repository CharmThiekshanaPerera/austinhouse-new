import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Heart, Gift, Trophy, Search } from "lucide-react";

const tierColors: Record<string, string> = {
  Bronze: "bg-orange-700/20 text-orange-400 border-orange-700/30",
  Silver: "bg-gray-400/20 text-gray-300 border-gray-500/30",
  Gold: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  Platinum: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const initialMembers = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", tier: "Gold", points: 4200, nextTier: 5000, visits: 28 },
  { id: 2, name: "Emma Williams", email: "emma@email.com", tier: "Platinum", points: 8900, nextTier: 10000, visits: 56 },
  { id: 3, name: "Olivia Brown", email: "olivia@email.com", tier: "Silver", points: 1800, nextTier: 3000, visits: 12 },
  { id: 4, name: "Sophia Davis", email: "sophia@email.com", tier: "Bronze", points: 450, nextTier: 1000, visits: 4 },
  { id: 5, name: "Ava Martinez", email: "ava@email.com", tier: "Gold", points: 3600, nextTier: 5000, visits: 22 },
  { id: 6, name: "Isabella Garcia", email: "isabella@email.com", tier: "Silver", points: 2100, nextTier: 3000, visits: 15 },
];

const rewards = [
  { name: "Free Facial Add-On", points: 500, claimed: 34 },
  { name: "20% Off Any Service", points: 1000, claimed: 21 },
  { name: "Complimentary Massage", points: 2500, claimed: 8 },
  { name: "VIP Spa Day Package", points: 5000, claimed: 3 },
];

const AdminLoyalty = () => {
  const [members] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Loyalty Program</h1>
        <p className="text-muted-foreground font-body text-sm">Manage member tiers, points, and rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Members", value: "1,247", icon: Heart },
          { label: "Active This Month", value: "389", icon: Trophy },
          { label: "Points Redeemed", value: "45.2K", icon: Gift },
          { label: "Avg. Points/Member", value: "2,840", icon: Heart },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground font-body">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="font-display text-lg">Members</CardTitle>
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-body text-sm" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Member</TableHead>
                <TableHead className="font-body">Tier</TableHead>
                <TableHead className="font-body">Points</TableHead>
                <TableHead className="font-body">Progress</TableHead>
                <TableHead className="font-body">Visits</TableHead>
                <TableHead className="font-body">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(m => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div>
                      <p className="font-body font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge className={tierColors[m.tier]}>{m.tier}</Badge></TableCell>
                  <TableCell className="font-body font-semibold text-foreground">{m.points.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="w-32 space-y-1">
                      <Progress value={(m.points / m.nextTier) * 100} className="h-2" />
                      <p className="text-[10px] text-muted-foreground">{m.nextTier - m.points} pts to next tier</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-body text-foreground">{m.visits}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="font-body text-xs" onClick={() => toast({ title: "Points Added", description: `+100 bonus points for ${m.name}` })}>
                      +100 pts
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-display text-lg">Reward Catalog</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewards.map(r => (
              <div key={r.name} className="border border-border rounded-lg p-4 space-y-2">
                <Gift size={20} className="text-primary" />
                <p className="font-body font-medium text-foreground text-sm">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.points.toLocaleString()} points • {r.claimed} claimed</p>
                <Button size="sm" variant="outline" className="w-full font-body text-xs" onClick={() => toast({ title: "Reward Updated", description: `"${r.name}" settings saved` })}>
                  Edit Reward
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoyalty;

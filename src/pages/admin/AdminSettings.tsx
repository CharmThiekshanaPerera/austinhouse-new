import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const ADMIN_PASSWORD_KEY = "admin_custom_password";

const AdminSettings = () => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY) || "admin123";

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPass !== storedPassword) {
      toast({ title: "Error", description: "Current password is incorrect.", variant: "destructive" });
      return;
    }
    if (newPass.length < 6) {
      toast({ title: "Error", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPass !== confirmPass) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPass);
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
    toast({ title: "Success ✨", description: "Password has been updated." });
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="font-display text-2xl text-foreground font-bold">Settings</h1>
        <p className="text-muted-foreground font-body text-sm">Manage your admin account</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display text-lg">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="Current Password"
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
                className="bg-background pr-10"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                placeholder="New Password (min 6 chars)"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                className="bg-background pr-10"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              className="bg-background"
            />
            <Button type="submit" className="bg-gold-gradient text-primary-foreground font-body font-bold text-xs uppercase tracking-wider">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;

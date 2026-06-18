import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Mail, Moon, Sun, User } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/mock-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Outlook AI" },
      { name: "description", content: "Manage your profile, notifications, and appearance." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [isDark, setIsDark] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [calendarNotif, setCalendarNotif] = useState(true);
  const [priorityOnly, setPriorityOnly] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = (next: boolean) => {
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your profile, notifications, and appearance.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <User className="h-4 w-4" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={profile.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={profile.email} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Job title</Label>
              <Input id="title" defaultValue={profile.jobTitle} />
            </div>
            <Button className="w-fit">Save profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Bell className="h-4 w-4" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row
              icon={<Mail className="h-4 w-4 text-muted-foreground" />}
              title="Email notifications"
              description="Get notified when new mail arrives."
              checked={emailNotif}
              onChange={setEmailNotif}
            />
            <Row
              icon={<Bell className="h-4 w-4 text-muted-foreground" />}
              title="Calendar reminders"
              description="Alert me 10 minutes before each meeting."
              checked={calendarNotif}
              onChange={setCalendarNotif}
            />
            <Row
              icon={<Bell className="h-4 w-4 text-muted-foreground" />}
              title="Priority only"
              description="Only notify for high-importance messages."
              checked={priorityOnly}
              onChange={setPriorityOnly}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Row
              icon={
                isDark ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                )
              }
              title="Dark mode"
              description="Switch between light and dark themes."
              checked={isDark}
              onChange={toggleTheme}
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Row({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

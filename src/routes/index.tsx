import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmailMetrics } from "@/components/email-metrics";
import { RecentEmails } from "@/components/recent-emails";
import { UpcomingEvents } from "@/components/upcoming-events";
import { EmailActivityChart } from "@/components/email-activity-chart";
import { SmartInsights } from "@/components/smart-insights";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { emails, events, profile } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Outlook AI" },
      {
        name: "description",
        content: "AI-powered Outlook dashboard with unified email, calendar, and smart insights.",
      },
      { property: "og:title", content: "Dashboard — Outlook AI" },
      {
        property: "og:description",
        content: "Unified email, calendar and AI insights for Microsoft Outlook.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const unread = emails.filter((e) => !e.isRead).length;
  const read = emails.length - unread;
  const priority = emails.filter((e) => e.isPriority).length;
  const upcoming = events.filter((e) => new Date(e.end).getTime() > Date.now());

  const [greeting, setGreeting] = useState("Hello");
  const [today, setToday] = useState("");
  useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
    setToday(now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }));
  }, []);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,oklch(0.30_0.10_252)_0%,oklch(0.20_0.07_255)_60%,oklch(0.14_0.04_260)_100%)] px-6 py-7 text-white shadow-elevated sm:px-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white/20">
                <AvatarFallback className="bg-white/15 text-sm font-semibold text-white backdrop-blur-sm">
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {greeting}, {profile.name.split(" ")[0]}
                </h1>
                <p className="mt-0.5 text-sm text-white/70">
                  {today || "Here's your day at a glance."}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {priority} priority {priority === 1 ? "item" : "items"} today
            </div>
          </div>
        </header>

        <EmailMetrics total={emails.length} unread={unread} read={read} priority={priority} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <EmailActivityChart />
            <RecentEmails emails={emails} limit={5} />
          </div>
          <div className="space-y-4">
            <UpcomingEvents events={upcoming} limit={4} />
            <SmartInsights />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EmailMetrics } from "@/components/email-metrics";
import { RecentEmails } from "@/components/recent-emails";
import { UpcomingEvents } from "@/components/upcoming-events";
import { EmailActivityChart } from "@/components/email-activity-chart";
import { SmartInsights } from "@/components/smart-insights";
import { emails, events, profile } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Outlook AI" },
      {
        name: "description",
        content:
          "AI-powered Outlook dashboard with unified email, calendar, and smart insights.",
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

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {greeting}, {profile.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening across your inbox and calendar today.
          </p>
        </header>

        <EmailMetrics
          total={emails.length}
          unread={unread}
          read={read}
          priority={priority}
        />

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

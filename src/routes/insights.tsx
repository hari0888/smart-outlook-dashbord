import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SmartInsights } from "@/components/smart-insights";
import { EmailActivityChart } from "@/components/email-activity-chart";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — Outlook AI" },
      {
        name: "description",
        content: "AI-generated summaries of your inbox, agenda, and suggested priorities.",
      },
      { property: "og:title", content: "Insights — Outlook AI" },
      {
        property: "og:description",
        content: "Smart summaries and priority suggestions based on email and calendar.",
      },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Smart insights</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-generated summaries of your day, drawn from your email and calendar.
          </p>
        </header>
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SmartInsights />
          </div>
          <div className="lg:col-span-2">
            <EmailActivityChart />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

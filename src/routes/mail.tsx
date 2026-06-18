import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmailMetrics } from "@/components/email-metrics";
import { RecentEmails } from "@/components/recent-emails";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { emails } from "@/lib/mock-data";

export const Route = createFileRoute("/mail")({
  head: () => ({
    meta: [
      { title: "Email — Outlook AI" },
      { name: "description", content: "Browse, search, and prioritize your Outlook inbox." },
      { property: "og:title", content: "Email — Outlook AI" },
      { property: "og:description", content: "Inbox overview with search and priority filters." },
    ],
  }),
  component: MailPage,
});

function MailPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "priority">("all");

  const filtered = emails.filter((e) => {
    if (filter === "unread" && e.isRead) return false;
    if (filter === "priority" && !e.isPriority) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      e.subject.toLowerCase().includes(q) ||
      e.from.name.toLowerCase().includes(q) ||
      e.preview.toLowerCase().includes(q)
    );
  });

  const unread = emails.filter((e) => !e.isRead).length;
  const priority = emails.filter((e) => e.isPriority).length;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {emails.length} messages · {unread} unread · {priority} priority
          </p>
        </header>

        <EmailMetrics
          total={emails.length}
          unread={unread}
          read={emails.length - unread}
          priority={priority}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by sender, subject, or content…"
              className="pl-9"
            />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="priority">Priority</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-16 text-center">
            <p className="text-sm text-muted-foreground">No emails match your filters.</p>
          </div>
        ) : (
          <RecentEmails emails={filtered} />
        )}
      </div>
    </AppShell>
  );
}

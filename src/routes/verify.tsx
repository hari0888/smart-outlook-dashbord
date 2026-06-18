import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Circle, PlayCircle, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { emails, events, profile } from "@/lib/mock-data";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify setup — Outlook AI" },
      {
        name: "description",
        content:
          "End-to-end verification of login, profile, email, and calendar data so you can confirm everything works.",
      },
    ],
  }),
  component: VerifyPage,
});

type StepStatus = "idle" | "running" | "pass" | "fail";

type StepResult = {
  status: StepStatus;
  detail?: string;
  data?: Record<string, unknown>;
  error?: string;
};

type StepDef = {
  id: string;
  title: string;
  description: string;
  run: () => Promise<{ detail: string; data?: Record<string, unknown> }>;
};

function VerifyPage() {
  const { user, signIn, signOut } = useAuth();
  const [results, setResults] = useState<Record<string, StepResult>>({});
  const [runningAll, setRunningAll] = useState(false);

  const setResult = useCallback((id: string, r: StepResult) => {
    setResults((prev) => ({ ...prev, [id]: r }));
  }, []);

  const steps: StepDef[] = [
    {
      id: "auth",
      title: "1. Authentication",
      description:
        "Confirms you are signed in. With the demo build, sign in once at /login before running this.",
      run: async () => {
        if (!user) throw new Error("Not signed in. Visit /login first.");
        return {
          detail: `Signed in as ${user.email}`,
          data: { email: user.email, name: user.name },
        };
      },
    },
    {
      id: "profile",
      title: "2. Profile data",
      description:
        "Verifies the profile object that drives the header avatar, greeting, and settings form.",
      run: async () => {
        if (!profile?.name || !profile?.email)
          throw new Error("profile.name or profile.email is missing in src/lib/mock-data.ts");
        return {
          detail: `${profile.name} · ${profile.email}`,
          data: { ...profile },
        };
      },
    },
    {
      id: "emails",
      title: "3. Email inbox",
      description:
        "Loads the emails array and checks shape (from, subject, receivedAt). On real Graph data this verifies your /me/messages access.",
      run: async () => {
        if (!Array.isArray(emails) || emails.length === 0) throw new Error("No emails available.");
        const bad = emails.find((e) => !e.from?.email || !e.subject || !e.receivedAt);
        if (bad) throw new Error(`Malformed email id=${bad.id}`);
        const unread = emails.filter((e) => !e.isRead).length;
        const priority = emails.filter((e) => e.isPriority).length;
        return {
          detail: `${emails.length} messages · ${unread} unread · ${priority} priority`,
          data: { count: emails.length, unread, priority, first: emails[0].subject },
        };
      },
    },
    {
      id: "calendar",
      title: "4. Calendar events",
      description:
        "Loads the events array and checks shape (title, start, end). On real Graph data this verifies your /me/calendarView access.",
      run: async () => {
        if (!Array.isArray(events) || events.length === 0)
          throw new Error("No calendar events available.");
        const bad = events.find((e) => !e.title || !e.start || !e.end);
        if (bad) throw new Error(`Malformed event id=${bad.id}`);
        const upcoming = events.filter((e) => new Date(e.start) >= new Date()).length;
        return {
          detail: `${events.length} events · ${upcoming} upcoming`,
          data: { count: events.length, upcoming, next: events[0].title },
        };
      },
    },
  ];

  const runStep = useCallback(
    async (step: StepDef) => {
      setResult(step.id, { status: "running" });
      try {
        const { detail, data } = await step.run();
        setResult(step.id, { status: "pass", detail, data });
        return true;
      } catch (err) {
        setResult(step.id, {
          status: "fail",
          error: err instanceof Error ? err.message : String(err),
        });
        return false;
      }
    },
    [setResult],
  );

  const runAll = useCallback(async () => {
    setRunningAll(true);
    for (const step of steps) {
      const ok = await runStep(step);
      if (!ok) break;
    }
    setRunningAll(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runStep, user]);

  const reset = () => setResults({});

  const passed = Object.values(results).filter((r) => r.status === "pass").length;
  const failed = Object.values(results).filter((r) => r.status === "fail").length;
  const total = steps.length;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Setup verification</h1>
          <p className="text-sm text-muted-foreground">
            Step through login, profile, email, and calendar to confirm everything is wired up.
          </p>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>End-to-end checks</CardTitle>
              <CardDescription>
                Run individual steps or all of them. Each step shows what it checked and the value
                it observed.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {passed}/{total} passed{failed ? ` · ${failed} failed` : ""}
              </Badge>
              <Button size="sm" variant="outline" onClick={reset} disabled={runningAll}>
                <RotateCcw className="mr-1.5 h-4 w-4" />
                Reset
              </Button>
              <Button size="sm" onClick={runAll} disabled={runningAll}>
                {runningAll ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="mr-1.5 h-4 w-4" />
                )}
                Run all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {!user && (
              <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm">
                You're not signed in. The auth step will fail. Use the button below or go to{" "}
                <a href="/login" className="underline">
                  /login
                </a>
                .
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        await signIn();
                      } catch {
                        /* ignored; the auth step will surface the error */
                      }
                    }}
                  >
                    Sign in with Microsoft
                  </Button>
                </div>
              </div>
            )}

            {user && (
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                <span>
                  Signed in as <span className="font-medium">{user.email}</span>
                </span>
                <Button size="sm" variant="ghost" onClick={signOut}>
                  Sign out
                </Button>
              </div>
            )}

            <ol className="space-y-3">
              {steps.map((step) => {
                const r = results[step.id] ?? { status: "idle" as StepStatus };
                return (
                  <li key={step.id} className="rounded-md border border-border bg-card p-4">
                    <div className="flex items-start gap-3">
                      <StatusIcon status={r.status} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium">{step.title}</div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => runStep(step)}
                            disabled={r.status === "running" || runningAll}
                          >
                            {r.status === "running" ? "Running…" : "Run"}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        {r.status === "pass" && r.detail && (
                          <div className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                            ✓ {r.detail}
                          </div>
                        )}
                        {r.status === "fail" && r.error && (
                          <div className="rounded border border-destructive/30 bg-destructive/10 px-2 py-1 text-xs text-destructive">
                            ✗ {r.error}
                          </div>
                        )}
                        {r.data && (
                          <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-2 text-xs">
                            {JSON.stringify(r.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">What this verifies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              On the demo build this confirms the mock pipeline is intact. After you switch to real
              Microsoft Graph (see the README), the same checks exercise your live OAuth token,{" "}
              <code>/me</code>, <code>/me/messages</code>, and <code>/me/calendarView</code> calls —
              so a green run means your Outlook account is fully wired up.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === "running")
    return <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-muted-foreground" />;
  if (status === "pass") return <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />;
  if (status === "fail") return <XCircle className="mt-0.5 h-5 w-5 text-destructive" />;
  return <Circle className="mt-0.5 h-5 w-5 text-muted-foreground" />;
}

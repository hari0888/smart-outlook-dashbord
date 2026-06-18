import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { UpcomingEvents } from "@/components/upcoming-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { events } from "@/lib/mock-data";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Outlook AI" },
      {
        name: "description",
        content: "Today's schedule, ongoing meetings, and upcoming events for the next 7 days.",
      },
      { property: "og:title", content: "Calendar — Outlook AI" },
      { property: "og:description", content: "Today's agenda plus a 7-day calendar overview." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const now = Date.now();
  const today = new Date();
  const todayStr = today.toDateString();

  const todays = events
    .filter((e) => new Date(e.start).toDateString() === todayStr)
    .sort((a, b) => +new Date(a.start) - +new Date(b.start));

  const ongoing = events.filter(
    (e) => new Date(e.start).getTime() <= now && new Date(e.end).getTime() >= now,
  );
  const upcoming = events
    .filter((e) => new Date(e.start).getTime() > now)
    .sort((a, b) => +new Date(a.start) - +new Date(b.start));

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {today.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}{" "}
            · {todays.length} meetings today
          </p>
        </header>

        {ongoing.length > 0 && <UpcomingEvents events={ongoing} title="Happening now" />}

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Today's schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {todays.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nothing scheduled for today.
                </p>
              ) : (
                <ol className="relative space-y-4 border-l-2 border-border pl-5">
                  {todays.map((e) => (
                    <li key={e.id} className="relative">
                      <span className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                      <div className="text-xs font-medium text-muted-foreground">
                        {new Date(e.start).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        –{" "}
                        {new Date(e.end).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="text-sm font-semibold text-foreground">{e.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {e.location} · {e.attendees.length} attendees
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>

          <UpcomingEvents events={upcoming} title="Next 7 days" />
        </div>
      </div>
    </AppShell>
  );
}

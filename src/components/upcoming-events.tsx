import { Calendar, MapPin, Users, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/mock-data";

function eventStatus(e: CalendarEvent) {
  const now = Date.now();
  const s = new Date(e.start).getTime();
  const en = new Date(e.end).getTime();
  if (now >= s && now <= en) return "now";
  if (s > now && s - now < 30 * 60_000) return "soon";
  return "upcoming";
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function fmtDay(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return "Today";
  const tomorrow = new Date(today.getTime() + 86400000);
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function UpcomingEvents({
  events,
  title = "Upcoming events",
  limit,
}: {
  events: CalendarEvent[];
  title?: string;
  limit?: number;
}) {
  const list = limit ? events.slice(0, limit) : events;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Calendar className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        <Badge variant="secondary" className="text-[10px]">
          Next 7 days
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.map((e) => {
          const status = eventStatus(e);
          return (
            <div
              key={e.id}
              className={cn(
                "group relative flex gap-3 rounded-lg border border-border p-3 transition-all hover:border-primary/40 hover:shadow-card",
                status === "now" && "border-success/60 bg-success/5",
              )}
            >
              <div className="flex w-16 flex-col items-center justify-center rounded-md bg-secondary/60 px-2 py-1.5 text-center">
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {fmtDay(e.start)}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {fmtTime(e.start)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-sm font-semibold text-foreground">{e.title}</h4>
                  {status === "now" && (
                    <Badge className="h-5 gap-1 border-0 bg-success px-1.5 text-[10px] text-success-foreground">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success-foreground" />
                      Live
                    </Badge>
                  )}
                  {status === "soon" && (
                    <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                      Starting soon
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {e.attendees.length} attendees
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {e.location}
                  </span>
                  <span>Organizer: {e.organizer}</span>
                </div>
              </div>
              {e.meetingLink && (
                <Button
                  size="sm"
                  variant={status === "now" ? "default" : "outline"}
                  className="h-8 self-center"
                >
                  <Video className="mr-1 h-3.5 w-3.5" />
                  Join
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

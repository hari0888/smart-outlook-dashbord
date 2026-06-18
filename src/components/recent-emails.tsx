import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Email } from "@/lib/mock-data";

function formatTime(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 60000;
  if (diff < 1) return "just now";
  if (diff < 60) return `${Math.round(diff)}m ago`;
  if (diff < 60 * 24) return `${Math.round(diff / 60)}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function RecentEmails({ emails, limit }: { emails: Email[]; limit?: number }) {
  const list = limit ? emails.slice(0, limit) : emails;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">Recent emails</CardTitle>
        <Badge variant="secondary" className="text-[10px]">
          {emails.filter((e) => !e.isRead).length} unread
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {list.map((e) => (
            <li
              key={e.id}
              className={cn(
                "flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-accent/40",
                !e.isRead && "bg-primary/[0.03]",
              )}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-secondary text-xs font-medium">
                    {initials(e.from.name)}
                  </AvatarFallback>
                </Avatar>
                {!e.isRead && (
                  <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "truncate text-sm",
                      !e.isRead ? "font-semibold text-foreground" : "text-foreground/90",
                    )}
                  >
                    {e.from.name}
                  </span>
                  <span className="flex-shrink-0 text-[11px] text-muted-foreground">
                    {formatTime(e.receivedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {e.isPriority && (
                    <span className="inline-flex items-center rounded-sm bg-destructive/10 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-destructive">
                      Priority
                    </span>
                  )}
                  <p
                    className={cn(
                      "truncate text-sm",
                      !e.isRead ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {e.subject}
                  </p>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{e.preview}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

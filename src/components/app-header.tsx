import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Bell, Plug, Mail, Calendar, LogOut, User as UserIcon, Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { emails, events, profile } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";

export function AppHeader() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [q, setQ] = useState("");

  const unread = emails.filter((e) => !e.isRead);
  const soon = events
    .filter((e) => {
      const start = new Date(e.start).getTime();
      const diff = start - Date.now();
      return diff > -15 * 60_000 && diff < 60 * 60_000; // happening or starting within 1h
    })
    .slice(0, 3);
  const notifCount = unread.length + soon.length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <div className="hidden flex-1 md:block">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/mail", search: { q: q || undefined, filter: "all" } });
          }}
          className="relative max-w-md"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search mail, events, people…"
            className="h-9 pl-9"
          />
        </form>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Badge
          variant="outline"
          className="hidden gap-1.5 border-warning/40 bg-warning/10 text-warning-foreground sm:inline-flex"
        >
          <Plug className="h-3 w-3" />
          Demo data
        </Badge>
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {notifCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {notifCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-xs font-normal text-muted-foreground">{notifCount} new</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {soon.length > 0 && (
              <>
                {soon.map((e) => (
                  <DropdownMenuItem
                    key={e.id}
                    className="flex items-start gap-2"
                    onClick={() => navigate({ to: "/calendar" })}
                  >
                    <Calendar className="mt-0.5 h-4 w-4 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{e.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Starts{" "}
                        {new Date(e.start).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {unread.length === 0 && soon.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                You're all caught up.
              </div>
            ) : (
              unread.slice(0, 5).map((m) => (
                <DropdownMenuItem
                  key={m.id}
                  className="flex items-start gap-2"
                  onClick={() => navigate({ to: "/mail", search: { filter: "unread" } })}
                >
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{m.from.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{m.subject}</div>
                  </div>
                </DropdownMenuItem>
              ))
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate({ to: "/mail", search: { filter: "unread" } })}
              className="justify-center text-sm font-medium text-primary"
            >
              View all
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-1 flex items-center gap-2 pl-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {profile.initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left lg:block">
            <div className="text-xs font-semibold leading-tight">{profile.name}</div>
            <div className="text-[11px] leading-tight text-muted-foreground">
              {profile.jobTitle}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

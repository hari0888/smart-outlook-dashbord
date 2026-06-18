import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Bell, Plug } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/lib/mock-data";

export function AppHeader() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

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
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
        </Button>
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

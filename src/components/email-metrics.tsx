import { Link } from "@tanstack/react-router";
import { Mail, MailOpen, AlertCircle, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type MailFilter = "all" | "unread" | "read" | "priority";

type Metric = {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: string;
  delta?: string;
  filter: MailFilter;
};

export function EmailMetrics({
  total,
  unread,
  read,
  priority,
}: {
  total: number;
  unread: number;
  read: number;
  priority: number;
}) {
  const metrics: (Metric & { bar: string })[] = [
    {
      label: "Total emails",
      value: total,
      icon: Inbox,
      accent: "text-primary bg-primary/10",
      bar: "bg-primary",
      delta: "+12 today",
      filter: "all",
    },
    {
      label: "Unread",
      value: unread,
      icon: Mail,
      accent: "text-info bg-info/10",
      bar: "bg-info",
      delta: `${unread} need reply`,
      filter: "unread",
    },
    {
      label: "Read",
      value: read,
      icon: MailOpen,
      accent: "text-success bg-success/10",
      bar: "bg-success",
      filter: "read",
    },
    {
      label: "Priority",
      value: priority,
      icon: AlertCircle,
      accent: "text-destructive bg-destructive/10",
      bar: "bg-destructive",
      filter: "priority",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {metrics.map((m) => (
        <Link key={m.label} to="/mail" search={{ filter: m.filter }} className="block">
          <Card className="group relative overflow-hidden shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated">
            <div className={`absolute inset-x-0 top-0 h-1 ${m.bar}`} />
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{m.value}</p>
                  {m.delta && <p className="mt-0.5 text-[11px] text-muted-foreground">{m.delta}</p>}
                </div>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${m.accent}`}
                >
                  <m.icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

import { Mail, MailOpen, AlertCircle, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type Metric = {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: string;
  delta?: string;
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
  const metrics: Metric[] = [
    { label: "Total emails", value: total, icon: Inbox, accent: "text-primary bg-primary/10", delta: "+12 today" },
    { label: "Unread", value: unread, icon: Mail, accent: "text-info bg-info/10", delta: `${unread} need reply` },
    { label: "Read", value: read, icon: MailOpen, accent: "text-success bg-success/10" },
    { label: "Priority", value: priority, icon: AlertCircle, accent: "text-destructive bg-destructive/10" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label} className="shadow-card transition-shadow hover:shadow-elevated">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{m.value}</p>
                {m.delta && (
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{m.delta}</p>
                )}
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${m.accent}`}>
                <m.icon className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

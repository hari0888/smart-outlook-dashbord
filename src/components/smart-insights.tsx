import { Sparkles, CalendarClock, ListChecks, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { insights } from "@/lib/mock-data";

export function SmartInsights() {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          Smart insights
          <Badge variant="outline" className="ml-auto text-[10px]">
            AI-generated
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Mail className="h-3 w-3" /> Unread summary
          </h4>
          <p className="text-sm leading-relaxed text-foreground/90">{insights.unreadSummary}</p>
        </section>
        <section>
          <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <CalendarClock className="h-3 w-3" /> Daily agenda
          </h4>
          <p className="text-sm leading-relaxed text-foreground/90">{insights.dailyAgenda}</p>
        </section>
        <section>
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <ListChecks className="h-3 w-3" /> Suggested priorities
          </h4>
          <ul className="space-y-1.5">
            {insights.priorities.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                <span className="mt-1.5 flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                {p}
              </li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

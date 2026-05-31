import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/store/useApp";
import { PageHeader, Card } from "@/components/AppShell";

export const Route = createFileRoute("/_app/calendar")({
  head: () => ({ meta: [{ title: "Kalender — QRight" }] }),
  component: CalendarView,
});

const typeColors: Record<string, string> = {
  meeting: "bg-primary text-primary-foreground",
  lieferung: "bg-warning text-warning-foreground",
  abnahme: "bg-success text-success-foreground",
  termin: "bg-accent text-accent-foreground",
};

function CalendarView() {
  const { events, projects } = useApp();
  // Group by date - next 7 days
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  return (
    <>
      <PageHeader title="Kalender" subtitle="Timeline deiner nächsten 14 Tage" />

      <div className="space-y-3">
        {days.map(d => {
          const dayEvents = events.filter(e => e.date === d).sort((a,b) => a.time.localeCompare(b.time));
          if (dayEvents.length === 0) return null;
          const date = new Date(d);
          const isToday = d === today.toISOString().slice(0,10);
          return (
            <Card key={d} className="p-4">
              <div className="flex items-baseline gap-3 mb-3">
                <div className={`text-2xl font-bold ${isToday ? "text-primary" : ""}`}>{date.getDate()}</div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {date.toLocaleDateString("de-DE", { month: "short" })}
                  </div>
                  <div className="text-sm font-medium">
                    {date.toLocaleDateString("de-DE", { weekday: "long" })}
                    {isToday && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground">HEUTE</span>}
                  </div>
                </div>
              </div>
              <div className="space-y-2 pl-2 border-l-2 border-border ml-3">
                {dayEvents.map(e => {
                  const p = e.projectId ? projects.find(x => x.id === e.projectId) : null;
                  return (
                    <div key={e.id} className="flex items-start gap-3 pl-3 -ml-px relative">
                      <div className="absolute -left-[5px] top-2 size-2 rounded-full bg-primary" />
                      <div className="text-sm font-mono font-semibold w-12 shrink-0 pt-0.5">{e.time}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{e.title}</span>
                          <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${typeColors[e.type]}`}>{e.type}</span>
                        </div>
                        {p && <div className="text-xs text-muted-foreground mt-0.5">{p.name}</div>}
                        <div className="text-[11px] text-muted-foreground">{e.duration} Min.</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

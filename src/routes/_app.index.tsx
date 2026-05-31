import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, fmtEUR, fmtDate } from "@/store/useApp";
import { Card, PageHeader } from "@/components/AppShell";
import { TrendingUp, Clock, Euro, CheckCircle2, AlertCircle, ArrowRight, QrCode, Plus, Camera, Receipt } from "lucide-react";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "QRight — Dashboard" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { projects, tasks, timeEntries, invoices, events, materials } = useApp();
  const active = projects.filter(p => p.status === "in_arbeit");
  const openTasks = tasks.filter(t => t.status !== "erledigt");
  const hoursThisWeek = timeEntries.reduce((a, t) => a + t.hours, 0);
  const unpaid = invoices.filter(i => i.status === "versendet" || i.status === "überfällig").reduce((a, i) => a + i.amount, 0);
  const lowStock = materials.filter(m => m.stock < m.minStock);
  const today = new Date().toISOString().slice(0, 10);
  const todaysEvents = events.filter(e => e.date === today);

  const kpis = [
    { label: "Aktive Projekte", value: active.length, sub: `${projects.length} insgesamt`, icon: TrendingUp, tone: "primary" },
    { label: "Offene Aufgaben", value: openTasks.length, sub: `${tasks.filter(t=>t.status==="erledigt").length} erledigt`, icon: CheckCircle2, tone: "success" },
    { label: "Stunden Woche", value: hoursThisWeek.toFixed(1), sub: "Team gesamt", icon: Clock, tone: "warning" },
    { label: "Offene Rechnungen", value: fmtEUR(unpaid), sub: `${invoices.filter(i=>i.status==="überfällig").length} überfällig`, icon: Euro, tone: "destructive" },
  ];

  return (
    <>
      <PageHeader title="Guten Morgen, Markus" subtitle="Hier ist dein Überblick für heute." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4 lg:p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`size-9 rounded-lg grid place-items-center ${
                k.tone === "primary" ? "bg-primary-soft text-primary" :
                k.tone === "success" ? "bg-success-soft text-success" :
                k.tone === "warning" ? "bg-warning/20 text-warning-foreground" :
                "bg-destructive/10 text-destructive"
              }`}>
                <k.icon className="size-5" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold tracking-tight">{k.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
            <div className="text-[11px] text-muted-foreground/70 mt-0.5">{k.sub}</div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { to: "/scanner", label: "QR scannen", icon: QrCode },
          { to: "/projects", label: "Neue Aufgabe", icon: Plus },
          { to: "/projects", label: "Foto hochladen", icon: Camera },
          { to: "/billing", label: "Rechnung erstellen", icon: Receipt },
        ].map((a) => (
          <Link key={a.label} to={a.to} className="bg-card border border-border rounded-xl p-3 lg:p-4 flex items-center gap-3 hover:border-primary hover:bg-primary-soft/30 transition-colors">
            <div className="size-9 rounded-lg gradient-primary grid place-items-center text-white"><a.icon className="size-4" /></div>
            <span className="text-sm font-medium">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Active projects */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Aktive Projekte</h2>
            <Link to="/projects" className="text-xs text-primary flex items-center gap-1">Alle anzeigen <ArrowRight className="size-3"/></Link>
          </div>
          <div className="space-y-3">
            {active.map((p) => (
              <Link key={p.id} to="/projects/$id" params={{ id: p.id }} className="block p-3 rounded-lg border border-border hover:border-primary transition-colors">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.client} · {p.address}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold">{p.progress}%</div>
                    <div className="text-[11px] text-muted-foreground">{fmtEUR(p.spent)} / {fmtEUR(p.budget)}</div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full gradient-primary" style={{ width: `${p.progress}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Today */}
        <Card className="p-5">
          <h2 className="font-semibold mb-4">Heute</h2>
          {todaysEvents.length === 0 && <p className="text-sm text-muted-foreground">Keine Termine heute.</p>}
          <div className="space-y-3">
            {todaysEvents.map(e => (
              <div key={e.id} className="flex gap-3">
                <div className="text-sm font-semibold text-primary w-12 shrink-0">{e.time}</div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{e.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{e.type}</div>
                </div>
              </div>
            ))}
          </div>
          {lowStock.length > 0 && (
            <div className="mt-5 pt-5 border-t border-border">
              <div className="flex items-center gap-2 text-sm font-medium text-warning-foreground mb-2">
                <AlertCircle className="size-4" /> Niedriger Lagerbestand
              </div>
              <div className="space-y-1.5">
                {lowStock.map(m => (
                  <div key={m.id} className="text-xs flex justify-between">
                    <span className="truncate">{m.name}</span>
                    <span className="text-muted-foreground shrink-0 ml-2">{m.stock} {m.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-5 mt-5">
        <h2 className="font-semibold mb-4">Anstehende Aufgaben</h2>
        <div className="space-y-2">
          {openTasks.slice(0, 5).map(t => {
            const proj = projects.find(p => p.id === t.projectId);
            return (
              <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <div className={`size-2 rounded-full ${t.priority === "hoch" ? "bg-destructive" : t.priority === "mittel" ? "bg-warning" : "bg-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{proj?.name}</div>
                </div>
                {t.dueDate && <div className="text-xs text-muted-foreground shrink-0">{fmtDate(t.dueDate)}</div>}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

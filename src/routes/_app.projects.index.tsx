import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, fmtEUR, fmtDate } from "@/store/useApp";
import { PageHeader, Card } from "@/components/AppShell";
import { MapPin, Plus, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/projects/")({
  head: () => ({ meta: [{ title: "Projekte — QRight" }] }),
  component: Projects,
});

const statusLabel = { planung: "Planung", in_arbeit: "In Arbeit", pausiert: "Pausiert", abgeschlossen: "Abgeschlossen" };
const statusClass = {
  planung: "bg-warning/15 text-warning-foreground",
  in_arbeit: "bg-primary-soft text-primary",
  pausiert: "bg-muted text-muted-foreground",
  abgeschlossen: "bg-success-soft text-success",
};

function Projects() {
  const projects = useApp(s => s.projects);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("alle");
  const filtered = projects.filter(p =>
    (filter === "alle" || p.status === filter) &&
    (p.name.toLowerCase().includes(q.toLowerCase()) || p.client.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      <PageHeader title="Projekte" subtitle={`${projects.length} Projekte gesamt`}
        action={<button className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-lg gradient-primary text-white text-sm font-medium"><Plus className="size-4"/> Neues Projekt</button>} />

      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Projekt oder Kunde suchen…"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:border-primary" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {["alle", "in_arbeit", "planung", "pausiert", "abgeschlossen"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${filter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
              {s === "alle" ? "Alle" : statusLabel[s as keyof typeof statusLabel]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {filtered.map(p => (
          <Link key={p.id} to="/projects/$id" params={{ id: p.id }}>
            <Card className="p-5 hover:border-primary transition-colors h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="size-3" /> {p.address}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass[p.status]}`}>{statusLabel[p.status]}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-3">{p.client}</div>
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
                <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{p.progress}% · bis {fmtDate(p.endDate)}</span>
                <span className="font-medium">{fmtEUR(p.spent)} / {fmtEUR(p.budget)}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useApp, fmtEUR, fmtDate } from "@/store/useApp";
import { PageHeader, Card } from "@/components/AppShell";
import { ArrowLeft, MapPin, Calendar, Clock, Camera, Plus, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/projects/$id")({
  head: ({ params }) => ({ meta: [{ title: `Projekt — QRight` }] }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { id } = Route.useParams();
  const { projects, tasks, timeEntries, photos, members, toggleTask, addTask, addTimeEntry, addPhoto } = useApp();
  const project = projects.find(p => p.id === id);
  const [tab, setTab] = useState<"aufgaben" | "zeit" | "fotos">("aufgaben");
  const [newTask, setNewTask] = useState("");

  if (!project) return <div>Projekt nicht gefunden. <Link to="/projects" className="text-primary underline">Zurück</Link></div>;

  const projTasks = tasks.filter(t => t.projectId === id);
  const projTime = timeEntries.filter(t => t.projectId === id);
  const projPhotos = photos.filter(p => p.projectId === id);
  const totalHours = projTime.reduce((a, t) => a + t.hours, 0);

  return (
    <>
      <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-3 hover:text-foreground">
        <ArrowLeft className="size-4" /> Alle Projekte
      </Link>

      <div className="rounded-2xl p-5 lg:p-6 text-white mb-5 shadow-elevated" style={{ background: `linear-gradient(135deg, ${project.color}, oklch(0.4 0.15 252))` }}>
        <div className="text-xs opacity-80 uppercase tracking-wider mb-1">{project.client}</div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">{project.name}</h1>
        <div className="flex items-center gap-2 text-sm opacity-90 mb-4"><MapPin className="size-4" /> {project.address}</div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="opacity-75 text-xs">Fortschritt</div>
            <div className="font-bold text-lg">{project.progress}%</div>
          </div>
          <div>
            <div className="opacity-75 text-xs">Budget</div>
            <div className="font-bold text-lg">{fmtEUR(project.spent)}</div>
            <div className="text-[11px] opacity-75">von {fmtEUR(project.budget)}</div>
          </div>
          <div>
            <div className="opacity-75 text-xs">Stunden</div>
            <div className="font-bold text-lg">{totalHours.toFixed(1)} h</div>
          </div>
        </div>
        <div className="h-2 rounded-full bg-white/20 mt-4 overflow-hidden">
          <div className="h-full bg-white" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <div className="flex gap-1 mb-4 border-b border-border">
        {[["aufgaben","Aufgaben"],["zeit","Zeit"],["fotos","Fotos"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab===k ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "aufgaben" && (
        <Card className="p-4">
          <form onSubmit={(e) => { e.preventDefault(); if (!newTask.trim()) return;
            addTask({ id: crypto.randomUUID(), projectId: id, title: newTask, status: "offen", priority: "mittel" });
            setNewTask(""); }} className="flex gap-2 mb-4">
            <input value={newTask} onChange={(e)=>setNewTask(e.target.value)} placeholder="Neue Aufgabe…"
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            <button className="px-3 py-2 rounded-lg gradient-primary text-white"><Plus className="size-4"/></button>
          </form>
          <div className="space-y-1.5">
            {projTasks.map(t => {
              const m = members.find(x => x.id === t.assigneeId);
              const done = t.status === "erledigt";
              return (
                <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50">
                  <button onClick={() => toggleTask(t.id)}>
                    {done ? <CheckCircle2 className="size-5 text-success" /> : <Circle className="size-5 text-muted-foreground" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${done ? "line-through text-muted-foreground" : "font-medium"}`}>{t.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {m?.name ?? "Nicht zugewiesen"} {t.dueDate && `· ${fmtDate(t.dueDate)}`}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    t.priority === "hoch" ? "bg-destructive/15 text-destructive" :
                    t.priority === "mittel" ? "bg-warning/20 text-warning-foreground" : "bg-muted text-muted-foreground"
                  }`}>{t.priority}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {tab === "zeit" && (
        <Card className="p-4">
          <form onSubmit={(e) => { e.preventDefault();
            const f = e.currentTarget as any;
            addTimeEntry({ id: crypto.randomUUID(), projectId: id, memberId: f.member.value, date: new Date().toISOString().slice(0,10), hours: parseFloat(f.hours.value), note: f.note.value });
            f.reset();
          }} className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
            <select name="member" className="px-3 py-2 rounded-lg border border-border bg-background text-sm">
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <input name="hours" type="number" step="0.5" required placeholder="Stunden" className="px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            <input name="note" placeholder="Notiz" className="px-3 py-2 rounded-lg border border-border bg-background text-sm col-span-2 lg:col-span-1" />
            <button className="px-3 py-2 rounded-lg gradient-primary text-white text-sm">Erfassen</button>
          </form>
          <div className="space-y-1.5">
            {projTime.map(t => {
              const m = members.find(x => x.id === t.memberId);
              return (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary-soft text-primary grid place-items-center text-xs font-semibold">{m?.initials}</div>
                    <div>
                      <div className="text-sm font-medium">{m?.name}</div>
                      <div className="text-xs text-muted-foreground">{t.note} · {fmtDate(t.date)}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-primary">{t.hours} h</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex justify-between">
            <span className="text-sm text-muted-foreground">Gesamt</span>
            <span className="font-bold">{totalHours.toFixed(1)} h</span>
          </div>
        </Card>
      )}

      {tab === "fotos" && (
        <div>
          <button onClick={() => addPhoto({ id: crypto.randomUUID(), projectId: id, caption: "Neues Foto", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600", date: new Date().toISOString().slice(0,10) })}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white text-sm">
            <Camera className="size-4" /> Foto hinzufügen
          </button>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {projPhotos.map(p => (
              <Card key={p.id} className="overflow-hidden">
                <img src={p.url} alt={p.caption} loading="lazy" className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <div className="text-sm font-medium truncate">{p.caption}</div>
                  <div className="text-xs text-muted-foreground">{fmtDate(p.date)}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/store/useApp";
import { PageHeader, Card } from "@/components/AppShell";
import { Phone, Mail, UserPlus } from "lucide-react";

export const Route = createFileRoute("/_app/team")({
  head: () => ({ meta: [{ title: "Team — QRight" }] }),
  component: Team,
});

function Team() {
  const { members, tasks, timeEntries } = useApp();
  return (
    <>
      <PageHeader title="Teammitglieder" subtitle={`${members.length} Mitglieder · ${members.filter(m=>m.online).length} online`}
        action={<button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg gradient-primary text-white text-sm font-medium"><UserPlus className="size-4"/> Einladen</button>} />

      <div className="grid lg:grid-cols-2 gap-4">
        {members.map(m => {
          const openTasks = tasks.filter(t => t.assigneeId === m.id && t.status !== "erledigt").length;
          const hours = timeEntries.filter(t => t.memberId === m.id).reduce((a,t) => a+t.hours, 0);
          return (
            <Card key={m.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="size-14 rounded-full gradient-primary grid place-items-center text-white font-semibold">{m.initials}</div>
                  <span className={`absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-card ${m.online ? "bg-success" : "bg-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.role}</div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">{m.hourlyRate}€/h</div>
                  </div>
                  <div className="flex flex-col gap-1 mt-3 text-xs text-muted-foreground">
                    <a href={`mailto:${m.email}`} className="flex items-center gap-2 hover:text-foreground"><Mail className="size-3"/> {m.email}</a>
                    <a href={`tel:${m.phone}`} className="flex items-center gap-2 hover:text-foreground"><Phone className="size-3"/> {m.phone}</a>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <span className="text-[11px] px-2 py-1 rounded-md bg-primary-soft text-primary font-medium">{openTasks} offene Aufgaben</span>
                    <span className="text-[11px] px-2 py-1 rounded-md bg-muted text-muted-foreground font-medium">{hours.toFixed(1)} h diese Woche</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

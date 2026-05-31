import { createFileRoute } from "@tanstack/react-router";
import { useApp, fmtEUR } from "@/store/useApp";
import { PageHeader, Card } from "@/components/AppShell";
import { Sparkles, Send, Bot, User as UserIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/ai")({
  head: () => ({ meta: [{ title: "KI-Assistent — QRight" }] }),
  component: AI,
});

interface Msg { role: "user" | "ai"; text: string; }

const suggestions = [
  "Welches Projekt ist überfällig?",
  "Wie viele Stunden hat das Team diese Woche geleistet?",
  "Welche Materialien müssen nachbestellt werden?",
  "Wer hat die meisten offenen Aufgaben?",
  "Was ist mein offener Rechnungsbetrag?",
  "Welche Termine stehen diese Woche an?",
];

function AI() {
  const state = useApp();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hallo Markus! Ich bin dein QRight-Assistent. Ich kenne deine Projekte, Aufgaben, Stunden, Rechnungen und Materialien. Frag mich etwas." },
  ]);
  const [input, setInput] = useState("");

  function answer(q: string): string {
    const t = q.toLowerCase();
    const { projects, tasks, timeEntries, invoices, materials, events, members } = state;
    if (t.includes("überfäll") || t.includes("verzug")) {
      const over = invoices.filter(i => i.status === "überfällig");
      if (over.length === 0) return "Keine überfälligen Rechnungen — sehr gut!";
      return `Du hast ${over.length} überfällige Rechnung(en) mit ${fmtEUR(over.reduce((a,i)=>a+i.amount,0))}. Größter Posten: ${over[0].client} (${fmtEUR(over[0].amount)}).`;
    }
    if (t.includes("stunden") || t.includes("zeit")) {
      const total = timeEntries.reduce((a,e)=>a+e.hours,0);
      const top = members.map(m => ({n:m.name, h:timeEntries.filter(e=>e.memberId===m.id).reduce((a,e)=>a+e.hours,0)})).sort((a,b)=>b.h-a.h)[0];
      return `Das Team hat diese Woche ${total.toFixed(1)} Stunden geleistet. Top: ${top.n} mit ${top.h.toFixed(1)} h.`;
    }
    if (t.includes("material") || t.includes("bestand") || t.includes("nachbest")) {
      const low = materials.filter(m => m.stock < m.minStock);
      if (low.length === 0) return "Alle Materialien sind ausreichend auf Lager.";
      return `${low.length} Material(ien) unter Mindestbestand: ${low.map(m => `${m.name} (${m.stock} ${m.unit})`).join(", ")}.`;
    }
    if (t.includes("aufgab")) {
      const open = tasks.filter(t=>t.status!=="erledigt");
      const byMember = members.map(m => ({n:m.name, c:open.filter(t=>t.assigneeId===m.id).length})).sort((a,b)=>b.c-a.c)[0];
      return `Es gibt ${open.length} offene Aufgaben. ${byMember.n} hat die meisten (${byMember.c}).`;
    }
    if (t.includes("rechnung") || t.includes("offen")) {
      const open = invoices.filter(i => i.status === "versendet" || i.status === "überfällig").reduce((a,i)=>a+i.amount,0);
      return `Offene Rechnungssumme: ${fmtEUR(open)}.`;
    }
    if (t.includes("termin") || t.includes("woche")) {
      const today = new Date();
      const week = new Date(today); week.setDate(week.getDate()+7);
      const upcoming = events.filter(e => new Date(e.date) >= today && new Date(e.date) <= week);
      return `Diese Woche stehen ${upcoming.length} Termine an. Nächster: "${upcoming[0]?.title}" am ${upcoming[0]?.date} um ${upcoming[0]?.time}.`;
    }
    if (t.includes("projekt") && t.includes("aktiv")) {
      const a = projects.filter(p => p.status === "in_arbeit");
      return `${a.length} aktive Projekte: ${a.map(p => `${p.name} (${p.progress}%)`).join(", ")}.`;
    }
    return `Ich habe Daten zu ${state.projects.length} Projekten, ${state.tasks.length} Aufgaben, ${state.members.length} Mitarbeitern und ${state.invoices.length} Rechnungen. Frag z.B. nach offenen Rechnungen, Stunden, Aufgaben oder Material.`;
  }

  function send(q: string) {
    if (!q.trim()) return;
    setMessages(m => [...m, { role: "user", text: q }, { role: "ai", text: answer(q) }]);
    setInput("");
  }

  return (
    <>
      <PageHeader title="KI-Assistent" subtitle="Basiert auf deinen echten Projektdaten" />

      <div className="grid lg:grid-cols-[1fr_280px] gap-4">
        <Card className="flex flex-col h-[calc(100vh-220px)]">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <div className="size-8 rounded-lg gradient-primary grid place-items-center text-white"><Sparkles className="size-4"/></div>
            <div>
              <div className="font-semibold text-sm">QRight Assistent</div>
              <div className="text-[11px] text-success flex items-center gap-1"><span className="size-1.5 rounded-full bg-success"/> Online</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`size-8 rounded-full grid place-items-center shrink-0 ${m.role === "user" ? "bg-primary text-primary-foreground" : "gradient-primary text-white"}`}>
                  {m.role === "user" ? <UserIcon className="size-4"/> : <Bot className="size-4"/>}
                </div>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-border p-3 flex gap-2">
            <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Frag den Assistenten…"
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
            <button className="px-3 py-2 rounded-lg gradient-primary text-white"><Send className="size-4"/></button>
          </form>
        </Card>

        <Card className="p-4 h-fit">
          <h3 className="font-semibold text-sm mb-3">Beispielfragen</h3>
          <div className="space-y-1.5">
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)}
                className="w-full text-left text-xs p-2.5 rounded-lg border border-border hover:border-primary hover:bg-primary-soft/30 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

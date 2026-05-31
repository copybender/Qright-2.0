import { createFileRoute } from "@tanstack/react-router";
import { useApp, fmtEUR, fmtDate } from "@/store/useApp";
import { PageHeader, Card } from "@/components/AppShell";
import { useState } from "react";

export const Route = createFileRoute("/_app/billing")({
  head: () => ({ meta: [{ title: "Abrechnung — QRight" }] }),
  component: Billing,
});

const invStatus = {
  entwurf: "bg-muted text-muted-foreground",
  versendet: "bg-primary-soft text-primary",
  bezahlt: "bg-success-soft text-success",
  überfällig: "bg-destructive/15 text-destructive",
};

const qStatus = {
  entwurf: "bg-muted text-muted-foreground",
  versendet: "bg-primary-soft text-primary",
  angenommen: "bg-success-soft text-success",
  abgelehnt: "bg-destructive/15 text-destructive",
};

function Billing() {
  const { invoices, quotes } = useApp();
  const [tab, setTab] = useState<"rg"|"an">("rg");

  const totals = {
    paid: invoices.filter(i=>i.status==="bezahlt").reduce((a,i)=>a+i.amount,0),
    open: invoices.filter(i=>i.status==="versendet").reduce((a,i)=>a+i.amount,0),
    overdue: invoices.filter(i=>i.status==="überfällig").reduce((a,i)=>a+i.amount,0),
  };

  return (
    <>
      <PageHeader title="Abrechnung" subtitle="Rechnungen und Angebote verwalten" />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Bezahlt</div>
          <div className="text-xl lg:text-2xl font-bold text-success mt-1">{fmtEUR(totals.paid)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Offen</div>
          <div className="text-xl lg:text-2xl font-bold text-primary mt-1">{fmtEUR(totals.open)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Überfällig</div>
          <div className="text-xl lg:text-2xl font-bold text-destructive mt-1">{fmtEUR(totals.overdue)}</div>
        </Card>
      </div>

      <div className="flex gap-1 mb-4 border-b border-border">
        {[["rg","Rechnungen"],["an","Angebote"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab===k ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
            {l}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="divide-y divide-border">
          {tab === "rg" && invoices.map(i => (
            <div key={i.id} className="p-4 flex items-center justify-between gap-3 hover:bg-muted/30">
              <div className="min-w-0">
                <div className="font-mono text-xs text-muted-foreground">{i.number}</div>
                <div className="font-medium truncate">{i.client}</div>
                <div className="text-xs text-muted-foreground">Fällig {fmtDate(i.dueDate)}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold">{fmtEUR(i.amount)}</div>
                <span className={`inline-block mt-1 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${invStatus[i.status]}`}>{i.status}</span>
              </div>
            </div>
          ))}
          {tab === "an" && quotes.map(q => (
            <div key={q.id} className="p-4 flex items-center justify-between gap-3 hover:bg-muted/30">
              <div className="min-w-0">
                <div className="font-mono text-xs text-muted-foreground">{q.number}</div>
                <div className="font-medium truncate">{q.client}</div>
                <div className="text-xs text-muted-foreground truncate">{q.projectName} · {fmtDate(q.date)}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold">{fmtEUR(q.amount)}</div>
                <span className={`inline-block mt-1 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${qStatus[q.status]}`}>{q.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

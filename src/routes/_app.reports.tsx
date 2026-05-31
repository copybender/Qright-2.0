import { createFileRoute } from "@tanstack/react-router";
import { useApp, fmtEUR } from "@/store/useApp";
import { PageHeader, Card } from "@/components/AppShell";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Berichte — QRight" }] }),
  component: Reports,
});

function Reports() {
  const { projects, timeEntries, invoices, members } = useApp();

  // Revenue per month (last 6 months mock)
  const revenueData = [
    { m: "Aug", v: 48000 }, { m: "Sep", v: 62000 }, { m: "Okt", v: 71000 },
    { m: "Nov", v: 58000 }, { m: "Dez", v: 84000 }, { m: "Jan", v: 96000 },
  ];
  const maxRev = Math.max(...revenueData.map(d => d.v));

  // Hours per member
  const memberHours = members.map(m => ({
    name: m.name.split(" ")[0],
    hours: timeEntries.filter(t => t.memberId === m.id).reduce((a,t) => a+t.hours, 0),
  })).sort((a,b) => b.hours - a.hours);
  const maxH = Math.max(...memberHours.map(d => d.hours), 1);

  // Budget vs spent per project
  const budgetData = projects.filter(p => p.status !== "abgeschlossen");

  const W = 600, H = 220, PAD = 30;
  const stepX = (W - PAD*2) / (revenueData.length - 1);
  const pts = revenueData.map((d, i) => `${PAD + i*stepX},${H - PAD - (d.v / maxRev) * (H - PAD*2)}`);
  const areaPath = `M${pts[0]} L${pts.join(" L")} L${PAD + (revenueData.length-1)*stepX},${H-PAD} L${PAD},${H-PAD} Z`;

  return (
    <>
      <PageHeader title="Berichte" subtitle="Auswertungen & Analytics" />

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <Card className="p-5">
          <h2 className="font-semibold mb-1">Umsatz</h2>
          <p className="text-xs text-muted-foreground mb-4">Letzte 6 Monate</p>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.55 0.16 252)" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="oklch(0.55 0.16 252)" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {[0,1,2,3].map(i => (
              <line key={i} x1={PAD} x2={W-PAD} y1={PAD + i*((H-PAD*2)/3)} y2={PAD + i*((H-PAD*2)/3)} stroke="oklch(0.92 0.008 250)" strokeDasharray="3 3"/>
            ))}
            <path d={areaPath} fill="url(#rev)"/>
            <polyline points={pts.join(" ")} fill="none" stroke="oklch(0.55 0.16 252)" strokeWidth="2.5" strokeLinejoin="round"/>
            {revenueData.map((d, i) => (
              <g key={i}>
                <circle cx={PAD + i*stepX} cy={H - PAD - (d.v/maxRev)*(H-PAD*2)} r="4" fill="white" stroke="oklch(0.55 0.16 252)" strokeWidth="2"/>
                <text x={PAD + i*stepX} y={H-10} textAnchor="middle" fontSize="11" fill="oklch(0.5 0.02 250)">{d.m}</text>
              </g>
            ))}
          </svg>
          <div className="text-2xl font-bold mt-2">{fmtEUR(revenueData.reduce((a,d)=>a+d.v,0))}</div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold mb-1">Stunden pro Mitarbeiter</h2>
          <p className="text-xs text-muted-foreground mb-4">Diese Woche</p>
          <div className="space-y-3">
            {memberHours.map(d => (
              <div key={d.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{d.name}</span>
                  <span className="text-muted-foreground">{d.hours.toFixed(1)} h</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-success rounded-full" style={{ width: `${(d.hours/maxH)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Budget vs. Ausgaben</h2>
        <svg viewBox={`0 0 ${W} ${budgetData.length * 50 + 20}`} className="w-full h-auto">
          {budgetData.map((p, i) => {
            const y = i * 50 + 10;
            const ratio = p.spent / p.budget;
            const over = ratio > 0.9;
            return (
              <g key={p.id}>
                <text x="0" y={y+12} fontSize="12" fill="oklch(0.18 0.03 250)" fontWeight="500">{p.name.slice(0,30)}</text>
                <rect x="0" y={y+18} width={W} height="14" rx="7" fill="oklch(0.96 0.005 250)"/>
                <rect x="0" y={y+18} width={W * ratio} height="14" rx="7" fill={over ? "oklch(0.72 0.18 25)" : "oklch(0.55 0.16 252)"}/>
                <text x={W} y={y+12} textAnchor="end" fontSize="11" fill="oklch(0.5 0.02 250)">{fmtEUR(p.spent)} / {fmtEUR(p.budget)}</text>
              </g>
            );
          })}
        </svg>
      </Card>
    </>
  );
}

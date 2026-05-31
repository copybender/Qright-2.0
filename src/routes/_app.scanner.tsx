import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/store/useApp";
import { PageHeader, Card } from "@/components/AppShell";
import { QrCode, ScanLine, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/scanner")({
  head: () => ({ meta: [{ title: "QR-Scanner — QRight" }] }),
  component: Scanner,
});

function Scanner() {
  const { projects, members, scanLogs, addScanLog } = useApp();
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  function simulate(projId: string) {
    setScanning(true);
    setTimeout(() => {
      addScanLog({ id: crypto.randomUUID(), projectId: projId, memberId: "m1", time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }), direction: "ein" });
      setScanning(false);
      const p = projects.find(x => x.id === projId);
      setSuccess(p?.name ?? null);
      setTimeout(() => setSuccess(null), 2500);
    }, 1200);
  }

  return (
    <>
      <PageHeader title="QR-Scanner" subtitle="Baustellenzugang & Anwesenheit erfassen" />

      <Card className="p-6 mb-5 text-center">
        <div className={`mx-auto size-56 lg:size-72 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft/30 grid place-items-center relative overflow-hidden ${scanning ? "animate-pulse" : ""}`}>
          {success ? (
            <div className="text-success">
              <Check className="size-16 mx-auto mb-2" strokeWidth={3} />
              <div className="font-semibold">Eingecheckt</div>
              <div className="text-sm text-muted-foreground mt-1">{success}</div>
            </div>
          ) : scanning ? (
            <>
              <ScanLine className="size-16 text-primary" />
              <div className="absolute inset-x-4 top-0 h-1 gradient-primary animate-[scan_1.2s_ease-in-out]" style={{ animation: "scan 1.2s ease-in-out" }} />
            </>
          ) : (
            <div>
              <QrCode className="size-20 mx-auto text-primary mb-2" />
              <div className="text-sm text-muted-foreground">QR-Code in den Rahmen halten</div>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-4">Demo: wähle eine Baustelle, um einen Scan zu simulieren.</p>
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          {projects.filter(p => p.status === "in_arbeit").map(p => (
            <button key={p.id} onClick={() => simulate(p.id)} disabled={scanning}
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium hover:border-primary disabled:opacity-50">
              {p.qrCode}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Letzte Scans</h2>
        <div className="space-y-2">
          {scanLogs.map(log => {
            const p = projects.find(x => x.id === log.projectId);
            const m = members.find(x => x.id === log.memberId);
            return (
              <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <div className={`size-9 rounded-lg grid place-items-center ${log.direction === "ein" ? "bg-success-soft text-success" : "bg-warning/20 text-warning-foreground"}`}>
                  <ScanLine className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p?.name}</div>
                  <div className="text-xs text-muted-foreground">{m?.name} · Check-{log.direction === "ein" ? "In" : "Out"}</div>
                </div>
                <div className="text-sm font-mono">{log.time}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

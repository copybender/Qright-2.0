import { createFileRoute } from "@tanstack/react-router";
import { useApp, fmtEUR } from "@/store/useApp";
import { PageHeader, Card } from "@/components/AppShell";
import { Package, AlertTriangle, ShoppingCart } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/materials")({
  head: () => ({ meta: [{ title: "Material — QRight" }] }),
  component: Materials,
});

function Materials() {
  const { materials, orders, addOrder, updateMaterialStock } = useApp();
  const [orderFor, setOrderFor] = useState<string | null>(null);
  const [qty, setQty] = useState(10);

  function placeOrder() {
    if (!orderFor) return;
    addOrder({ id: crypto.randomUUID(), materialId: orderFor, quantity: qty, status: "bestellt", date: new Date().toISOString().slice(0,10) });
    updateMaterialStock(orderFor, qty);
    setOrderFor(null); setQty(10);
  }

  return (
    <>
      <PageHeader title="Materialverwaltung" subtitle={`${materials.length} Materialien · ${materials.filter(m=>m.stock<m.minStock).length} unter Mindestbestand`} />

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <Card className="lg:col-span-2 p-5">
          <h2 className="font-semibold mb-4">Lagerbestand</h2>
          <div className="space-y-2">
            {materials.map(m => {
              const low = m.stock < m.minStock;
              const pct = Math.min(100, (m.stock / (m.minStock * 2)) * 100);
              return (
                <div key={m.id} className="p-3 rounded-lg border border-border">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.category} · {m.supplier} · {fmtEUR(m.pricePerUnit)}/{m.unit}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`font-bold ${low ? "text-destructive" : ""}`}>{m.stock} {m.unit}</div>
                      <div className="text-[11px] text-muted-foreground">min {m.minStock}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${low ? "bg-destructive" : "bg-success"}`} style={{ width: `${pct}%` }} />
                    </div>
                    <button onClick={() => setOrderFor(m.id)} className="text-xs font-medium text-primary hover:underline">Bestellen</button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><ShoppingCart className="size-4"/> Aktuelle Bestellungen</h2>
          <div className="space-y-2">
            {orders.map(o => {
              const m = materials.find(x => x.id === o.materialId);
              return (
                <div key={o.id} className="p-3 rounded-lg border border-border">
                  <div className="text-sm font-medium">{m?.name}</div>
                  <div className="text-xs text-muted-foreground">{o.quantity} {m?.unit}</div>
                  <span className={`inline-block mt-1.5 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                    o.status === "geliefert" ? "bg-success-soft text-success" :
                    o.status === "unterwegs" ? "bg-warning/20 text-warning-foreground" : "bg-primary-soft text-primary"
                  }`}>{o.status}</span>
                </div>
              );
            })}
            {orders.length === 0 && <p className="text-sm text-muted-foreground">Keine Bestellungen</p>}
          </div>
        </Card>
      </div>

      {orderFor && (
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={() => setOrderFor(null)}>
          <div className="p-6 max-w-sm w-full bg-card rounded-xl border border-border shadow-elevated" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-1">{materials.find(m=>m.id===orderFor)?.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">Menge auswählen</p>
            <input type="number" value={qty} onChange={(e)=>setQty(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-border bg-background mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setOrderFor(null)} className="flex-1 px-3 py-2 rounded-lg border border-border text-sm">Abbrechen</button>
              <button onClick={placeOrder} className="flex-1 px-3 py-2 rounded-lg gradient-primary text-white text-sm font-medium">Bestellen</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

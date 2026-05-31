import { createFileRoute } from "@tanstack/react-router";
import { useApp, fmtDate } from "@/store/useApp";
import { PageHeader, Card } from "@/components/AppShell";
import { FileText, Image, FileStack, ScrollText, Upload, Download } from "lucide-react";

export const Route = createFileRoute("/_app/documents")({
  head: () => ({ meta: [{ title: "Dokumente — QRight" }] }),
  component: Docs,
});

const typeIcon = { pdf: FileText, bild: Image, plan: FileStack, vertrag: ScrollText };
const typeColor = {
  pdf: "bg-destructive/10 text-destructive",
  bild: "bg-success-soft text-success",
  plan: "bg-primary-soft text-primary",
  vertrag: "bg-warning/20 text-warning-foreground",
};

function Docs() {
  const { documents, projects } = useApp();
  return (
    <>
      <PageHeader title="Dokumente" subtitle={`${documents.length} Dateien`}
        action={<button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg gradient-primary text-white text-sm font-medium"><Upload className="size-4"/> Hochladen</button>} />

      <Card className="overflow-hidden">
        <div className="divide-y divide-border">
          {documents.map(d => {
            const Icon = typeIcon[d.type];
            const p = d.projectId ? projects.find(x=>x.id===d.projectId) : null;
            return (
              <div key={d.id} className="p-4 flex items-center gap-3 hover:bg-muted/30">
                <div className={`size-10 rounded-lg grid place-items-center ${typeColor[d.type]}`}><Icon className="size-5"/></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{d.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {p?.name ?? "Allgemein"} · {d.size} · von {d.uploadedBy} · {fmtDate(d.date)}
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Download className="size-4"/></button>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

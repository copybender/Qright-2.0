import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderKanban, QrCode, Users, Calendar, MessageSquare,
  Receipt, Package, BarChart3, FileText, Sparkles, Menu, X, Bell
} from "lucide-react";
import { useState } from "react";
import qrightLogo from "@/assets/qright-logo.png";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projekte", icon: FolderKanban },
  { to: "/scanner", label: "QR-Scanner", icon: QrCode },
  { to: "/team", label: "Team", icon: Users },
  { to: "/calendar", label: "Kalender", icon: Calendar },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/billing", label: "Abrechnung", icon: Receipt },
  { to: "/materials", label: "Material", icon: Package },
  { to: "/reports", label: "Berichte", icon: BarChart3 },
  { to: "/documents", label: "Dokumente", icon: FileText },
  { to: "/ai", label: "KI-Assistent", icon: Sparkles },
];

const bottomNav = nav.slice(0, 5);

export function AppShell() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border sticky top-0 h-screen">
        <div className="px-5 py-4 border-b border-sidebar-border">
          <div className="flex items-center justify-center">
            <img src={qrightLogo} alt="QRight" className="h-9 w-auto object-contain brightness-0 invert" />
          </div>
          <div className="text-[11px] opacity-60 text-center mt-2 tracking-wider uppercase">Handwerk & Bauleitung</div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {nav.map((n) => {
            const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? "bg-primary text-primary-foreground shadow-elevated" : "hover:bg-white/5 text-sidebar-foreground/80"
                }`}>
                <n.icon className="size-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="size-9 rounded-full bg-success grid place-items-center text-success-foreground font-semibold text-sm">MB</div>
            <div className="text-xs">
              <div className="font-medium">Markus Becker</div>
              <div className="opacity-60">Bauleiter</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-sidebar text-sidebar-foreground flex flex-col">
            <div className="px-4 py-3 flex items-center justify-between border-b border-sidebar-border">
              <img src={qrightLogo} alt="QRight" className="h-7 w-auto object-contain brightness-0 invert" />
              <button onClick={() => setOpen(false)} aria-label="Schließen"><X className="size-5" /></button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/5">
                  <n.icon className="size-4" /> {n.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border">
          <div className="px-4 lg:px-8 h-14 flex items-center justify-between gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2"><Menu className="size-5" /></button>
            <div className="lg:hidden">
              <img src={qrightLogo} alt="QRight" className="h-7 w-auto object-contain" />
            </div>
            <div className="hidden lg:block text-sm text-muted-foreground">
              {new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-lg hover:bg-muted">
                <Bell className="size-5" />
                <span className="absolute top-1.5 right-1.5 size-2 bg-destructive rounded-full" />
              </button>
              <div className="size-8 rounded-full bg-primary grid place-items-center text-primary-foreground font-semibold text-xs lg:hidden">MB</div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-5 pb-24 lg:pb-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>

        {/* Bottom nav - mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border safe-bottom">
          <div className="grid grid-cols-5">
            {bottomNav.map((n) => {
              const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to}
                  className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}>
                  <n.icon className="size-5" />
                  {n.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-card rounded-xl border border-border shadow-card ${className}`}>{children}</div>;
}

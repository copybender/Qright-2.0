import { create } from "zustand";

export type ID = string;
export type ProjectStatus = "planung" | "in_arbeit" | "pausiert" | "abgeschlossen";
export type TaskStatus = "offen" | "in_arbeit" | "erledigt";
export type Priority = "niedrig" | "mittel" | "hoch";

export interface Task {
  id: ID;
  projectId: ID;
  title: string;
  assigneeId?: ID;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
}
export interface TimeEntry {
  id: ID;
  projectId: ID;
  memberId: ID;
  date: string;
  hours: number;
  note?: string;
}
export interface Photo {
  id: ID;
  projectId: ID;
  caption: string;
  url: string;
  date: string;
}
export interface Project {
  id: ID;
  name: string;
  client: string;
  address: string;
  status: ProjectStatus;
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  qrCode: string;
  color: string;
}
export interface Member {
  id: ID;
  name: string;
  role: string;
  email: string;
  phone: string;
  initials: string;
  online: boolean;
  hourlyRate: number;
}
export interface CalendarEvent {
  id: ID;
  title: string;
  projectId?: ID;
  date: string;
  time: string;
  duration: number;
  type: "termin" | "lieferung" | "abnahme" | "meeting";
}
export interface ChatMessage {
  id: ID;
  channelId: ID;
  memberId: ID;
  text: string;
  time: string;
}
export interface ChatChannel {
  id: ID;
  name: string;
  projectId?: ID;
  lastMessage: string;
  unread: number;
}
export interface Invoice {
  id: ID;
  number: string;
  projectId: ID;
  client: string;
  amount: number;
  status: "entwurf" | "versendet" | "bezahlt" | "überfällig";
  date: string;
  dueDate: string;
}
export interface Quote {
  id: ID;
  number: string;
  client: string;
  projectName: string;
  amount: number;
  status: "entwurf" | "versendet" | "angenommen" | "abgelehnt";
  date: string;
}
export interface Material {
  id: ID;
  name: string;
  category: string;
  unit: string;
  stock: number;
  minStock: number;
  pricePerUnit: number;
  supplier: string;
}
export interface MaterialOrder {
  id: ID;
  materialId: ID;
  quantity: number;
  projectId?: ID;
  status: "bestellt" | "unterwegs" | "geliefert";
  date: string;
}
export interface DocumentItem {
  id: ID;
  name: string;
  type: "pdf" | "bild" | "plan" | "vertrag";
  projectId?: ID;
  size: string;
  uploadedBy: string;
  date: string;
}
export interface ScanLog {
  id: ID;
  projectId: ID;
  memberId: ID;
  time: string;
  direction: "ein" | "aus";
}

interface AppState {
  projects: Project[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  photos: Photo[];
  members: Member[];
  events: CalendarEvent[];
  channels: ChatChannel[];
  messages: ChatMessage[];
  invoices: Invoice[];
  quotes: Quote[];
  materials: Material[];
  orders: MaterialOrder[];
  documents: DocumentItem[];
  scanLogs: ScanLog[];
  addTask: (t: Task) => void;
  toggleTask: (id: ID) => void;
  addTimeEntry: (t: TimeEntry) => void;
  addPhoto: (p: Photo) => void;
  addMessage: (m: ChatMessage) => void;
  addScanLog: (l: ScanLog) => void;
  addOrder: (o: MaterialOrder) => void;
  updateMaterialStock: (id: ID, delta: number) => void;
}

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: number) => { const x = new Date(today); x.setDate(x.getDate() + d); return iso(x); };

export const useApp = create<AppState>((set) => ({
  projects: [
    { id: "p1", name: "Wohnhaus Lindenstraße 24", client: "Familie Müller", address: "Lindenstr. 24, 10115 Berlin", status: "in_arbeit", progress: 64, budget: 245000, spent: 158400, startDate: addDays(-60), endDate: addDays(45), qrCode: "QR-P1-LIND24", color: "oklch(0.55 0.16 252)" },
    { id: "p2", name: "Bürogebäude TechPark", client: "Nordstern GmbH", address: "Industrieweg 8, 12099 Berlin", status: "in_arbeit", progress: 38, budget: 980000, spent: 372000, startDate: addDays(-30), endDate: addDays(120), qrCode: "QR-P2-TECH08", color: "oklch(0.72 0.18 140)" },
    { id: "p3", name: "Dachsanierung Schule Mitte", client: "Bezirksamt Mitte", address: "Schulstr. 12, 10117 Berlin", status: "planung", progress: 8, budget: 165000, spent: 12000, startDate: addDays(7), endDate: addDays(90), qrCode: "QR-P3-SCH12", color: "oklch(0.78 0.16 75)" },
    { id: "p4", name: "Loft-Umbau Friedrichshain", client: "Sarah Klein", address: "Boxhagener Str. 41", status: "pausiert", progress: 45, budget: 78000, spent: 35100, startDate: addDays(-90), endDate: addDays(20), qrCode: "QR-P4-BOX41", color: "oklch(0.65 0.2 25)" },
    { id: "p5", name: "Bädersanierung Hotel Adler", client: "Adler Hotels AG", address: "Friedrichstr. 100", status: "abgeschlossen", progress: 100, budget: 320000, spent: 312500, startDate: addDays(-180), endDate: addDays(-15), qrCode: "QR-P5-ADL", color: "oklch(0.55 0.12 290)" },
  ],
  tasks: [
    { id: "t1", projectId: "p1", title: "Elektroinstallation OG fertigstellen", assigneeId: "m2", status: "in_arbeit", priority: "hoch", dueDate: addDays(2) },
    { id: "t2", projectId: "p1", title: "Fliesen Bad bestellen", assigneeId: "m3", status: "offen", priority: "mittel", dueDate: addDays(5) },
    { id: "t3", projectId: "p1", title: "Trockenbau Wohnzimmer", assigneeId: "m4", status: "erledigt", priority: "hoch", dueDate: addDays(-3) },
    { id: "t4", projectId: "p2", title: "Baugrubenprüfung", assigneeId: "m1", status: "in_arbeit", priority: "hoch", dueDate: addDays(1) },
    { id: "t5", projectId: "p2", title: "Stahlträger anliefern lassen", assigneeId: "m1", status: "offen", priority: "hoch", dueDate: addDays(4) },
    { id: "t6", projectId: "p3", title: "Statisches Gutachten einholen", assigneeId: "m1", status: "in_arbeit", priority: "mittel", dueDate: addDays(10) },
    { id: "t7", projectId: "p2", title: "Sicherheitsunterweisung Team", assigneeId: "m2", status: "offen", priority: "mittel", dueDate: addDays(3) },
  ],
  timeEntries: [
    { id: "te1", projectId: "p1", memberId: "m2", date: addDays(-1), hours: 8.5, note: "Elektroinstallation" },
    { id: "te2", projectId: "p1", memberId: "m3", date: addDays(-1), hours: 7, note: "Fliesenarbeiten" },
    { id: "te3", projectId: "p2", memberId: "m4", date: addDays(0), hours: 6, note: "Trockenbau" },
    { id: "te4", projectId: "p2", memberId: "m1", date: addDays(0), hours: 4, note: "Bauleitung" },
    { id: "te5", projectId: "p1", memberId: "m2", date: addDays(0), hours: 5.5, note: "Verkabelung" },
  ],
  photos: [
    { id: "ph1", projectId: "p1", caption: "Rohbau OG abgeschlossen", url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600", date: addDays(-2) },
    { id: "ph2", projectId: "p1", caption: "Elektrik Verteilerschrank", url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600", date: addDays(-1) },
    { id: "ph3", projectId: "p2", caption: "Baugrube fertig ausgehoben", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600", date: addDays(-3) },
  ],
  members: [
    { id: "m1", name: "Markus Becker", role: "Bauleiter", email: "m.becker@qright.de", phone: "+49 170 1234567", initials: "MB", online: true, hourlyRate: 75 },
    { id: "m2", name: "Stefan Vogel", role: "Elektriker", email: "s.vogel@qright.de", phone: "+49 171 2345678", initials: "SV", online: true, hourlyRate: 58 },
    { id: "m3", name: "Anna Krüger", role: "Fliesenlegerin", email: "a.krueger@qright.de", phone: "+49 172 3456789", initials: "AK", online: false, hourlyRate: 55 },
    { id: "m4", name: "Tobias Lange", role: "Trockenbauer", email: "t.lange@qright.de", phone: "+49 173 4567890", initials: "TL", online: true, hourlyRate: 52 },
    { id: "m5", name: "Julia Hartmann", role: "Architektin", email: "j.hartmann@qright.de", phone: "+49 174 5678901", initials: "JH", online: false, hourlyRate: 85 },
  ],
  events: [
    { id: "e1", title: "Baubesprechung Lindenstr.", projectId: "p1", date: addDays(0), time: "09:00", duration: 60, type: "meeting" },
    { id: "e2", title: "Materiallieferung Trockenbau", projectId: "p1", date: addDays(1), time: "07:30", duration: 30, type: "lieferung" },
    { id: "e3", title: "Abnahme Elektrik", projectId: "p1", date: addDays(3), time: "14:00", duration: 90, type: "abnahme" },
    { id: "e4", title: "Kick-off TechPark Phase 2", projectId: "p2", date: addDays(2), time: "10:00", duration: 120, type: "meeting" },
    { id: "e5", title: "Begehung Schule Mitte", projectId: "p3", date: addDays(4), time: "11:00", duration: 60, type: "termin" },
    { id: "e6", title: "Stahllieferung", projectId: "p2", date: addDays(5), time: "06:30", duration: 45, type: "lieferung" },
  ],
  channels: [
    { id: "c1", name: "Allgemein", lastMessage: "Guten Morgen Team!", unread: 0 },
    { id: "c2", name: "Lindenstr. 24", projectId: "p1", lastMessage: "Fliesen sind angekommen.", unread: 2 },
    { id: "c3", name: "TechPark", projectId: "p2", lastMessage: "Baugrube freigegeben.", unread: 0 },
    { id: "c4", name: "Bauleitung", lastMessage: "Wer macht morgen die Abnahme?", unread: 1 },
  ],
  messages: [
    { id: "msg1", channelId: "c2", memberId: "m1", text: "Guten Morgen, wie läuft es im OG?", time: "08:12" },
    { id: "msg2", channelId: "c2", memberId: "m2", text: "Verkabelung Schlafzimmer fertig, ich starte mit Wohnzimmer.", time: "08:14" },
    { id: "msg3", channelId: "c2", memberId: "m3", text: "Fliesen sind angekommen.", time: "08:45" },
    { id: "msg4", channelId: "c1", memberId: "m1", text: "Guten Morgen Team!", time: "07:00" },
    { id: "msg5", channelId: "c4", memberId: "m5", text: "Wer macht morgen die Abnahme?", time: "16:22" },
  ],
  invoices: [
    { id: "i1", number: "RG-2026-041", projectId: "p1", client: "Familie Müller", amount: 28500, status: "versendet", date: addDays(-10), dueDate: addDays(4) },
    { id: "i2", number: "RG-2026-040", projectId: "p2", client: "Nordstern GmbH", amount: 84200, status: "bezahlt", date: addDays(-25), dueDate: addDays(-11) },
    { id: "i3", number: "RG-2026-039", projectId: "p5", client: "Adler Hotels AG", amount: 62000, status: "bezahlt", date: addDays(-40), dueDate: addDays(-26) },
    { id: "i4", number: "RG-2026-038", projectId: "p4", client: "Sarah Klein", amount: 14800, status: "überfällig", date: addDays(-45), dueDate: addDays(-15) },
    { id: "i5", number: "RG-2026-042", projectId: "p2", client: "Nordstern GmbH", amount: 31200, status: "entwurf", date: addDays(0), dueDate: addDays(14) },
  ],
  quotes: [
    { id: "q1", number: "AN-2026-018", client: "Stadtwerke Mitte", projectName: "Heizungssanierung", amount: 47800, status: "versendet", date: addDays(-4) },
    { id: "q2", number: "AN-2026-017", client: "Familie Wagner", projectName: "Carport Neubau", amount: 18500, status: "angenommen", date: addDays(-12) },
    { id: "q3", number: "AN-2026-016", client: "Café Sonne", projectName: "Ladenumbau", amount: 32400, status: "abgelehnt", date: addDays(-20) },
  ],
  materials: [
    { id: "ma1", name: "Gipskartonplatte 12,5mm", category: "Trockenbau", unit: "Stk", stock: 120, minStock: 50, pricePerUnit: 7.20, supplier: "Knauf" },
    { id: "ma2", name: "Kabel NYM-J 3x1,5", category: "Elektro", unit: "m", stock: 340, minStock: 200, pricePerUnit: 0.95, supplier: "Lapp" },
    { id: "ma3", name: "Fliesenkleber Flexkleber", category: "Fliesen", unit: "Sack", stock: 18, minStock: 25, pricePerUnit: 19.50, supplier: "Sopro" },
    { id: "ma4", name: "Schrauben Spax 4x40", category: "Befestigung", unit: "Pack", stock: 42, minStock: 20, pricePerUnit: 8.40, supplier: "Spax" },
    { id: "ma5", name: "Dämmung Steinwolle 100mm", category: "Dämmung", unit: "m²", stock: 85, minStock: 100, pricePerUnit: 14.80, supplier: "Rockwool" },
    { id: "ma6", name: "Estrichbeton 25kg", category: "Beton", unit: "Sack", stock: 64, minStock: 30, pricePerUnit: 6.30, supplier: "Quick-Mix" },
  ],
  orders: [
    { id: "o1", materialId: "ma3", quantity: 30, projectId: "p1", status: "unterwegs", date: addDays(-1) },
    { id: "o2", materialId: "ma5", quantity: 60, projectId: "p2", status: "bestellt", date: addDays(0) },
  ],
  documents: [
    { id: "d1", name: "Bauplan_Lindenstr_OG.pdf", type: "plan", projectId: "p1", size: "4.2 MB", uploadedBy: "Markus Becker", date: addDays(-30) },
    { id: "d2", name: "Werkvertrag_Müller.pdf", type: "vertrag", projectId: "p1", size: "820 KB", uploadedBy: "Julia Hartmann", date: addDays(-60) },
    { id: "d3", name: "Statik_TechPark.pdf", type: "plan", projectId: "p2", size: "12.1 MB", uploadedBy: "Julia Hartmann", date: addDays(-28) },
    { id: "d4", name: "Aufmass_Schule.pdf", type: "pdf", projectId: "p3", size: "1.4 MB", uploadedBy: "Markus Becker", date: addDays(-5) },
    { id: "d5", name: "Foto_Rohbau.jpg", type: "bild", projectId: "p1", size: "3.8 MB", uploadedBy: "Stefan Vogel", date: addDays(-2) },
  ],
  scanLogs: [
    { id: "sl1", projectId: "p1", memberId: "m2", time: "07:02", direction: "ein" },
    { id: "sl2", projectId: "p1", memberId: "m3", time: "07:18", direction: "ein" },
    { id: "sl3", projectId: "p2", memberId: "m4", time: "07:30", direction: "ein" },
    { id: "sl4", projectId: "p1", memberId: "m2", time: "16:45", direction: "aus" },
  ],
  addTask: (t) => set((s) => ({ tasks: [t, ...s.tasks] })),
  toggleTask: (id) => set((s) => ({
    tasks: s.tasks.map(t => t.id === id ? { ...t, status: t.status === "erledigt" ? "offen" : "erledigt" } : t),
  })),
  addTimeEntry: (t) => set((s) => ({ timeEntries: [t, ...s.timeEntries] })),
  addPhoto: (p) => set((s) => ({ photos: [p, ...s.photos] })),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  addScanLog: (l) => set((s) => ({ scanLogs: [l, ...s.scanLogs] })),
  addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
  updateMaterialStock: (id, delta) => set((s) => ({
    materials: s.materials.map(m => m.id === id ? { ...m, stock: Math.max(0, m.stock + delta) } : m),
  })),
}));

export const fmtEUR = (n: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
export const fmtDate = (d: string) => new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "short" });

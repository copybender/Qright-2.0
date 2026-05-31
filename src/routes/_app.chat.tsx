import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/store/useApp";
import { PageHeader, Card } from "@/components/AppShell";
import { Send, Hash } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({ meta: [{ title: "Chat — QRight" }] }),
  component: Chat,
});

function Chat() {
  const { channels, messages, members, addMessage } = useApp();
  const [activeId, setActiveId] = useState(channels[0]?.id);
  const [text, setText] = useState("");
  const channelMsgs = messages.filter(m => m.channelId === activeId);
  const activeChannel = channels.find(c => c.id === activeId);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !activeId) return;
    addMessage({ id: crypto.randomUUID(), channelId: activeId, memberId: "m1", text, time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) });
    setText("");
  }

  return (
    <>
      <PageHeader title="Team-Chat" subtitle="Kommunikation in Echtzeit" />
      <div className="grid lg:grid-cols-[260px_1fr] gap-4 h-[calc(100vh-220px)]">
        <Card className="p-2 overflow-y-auto">
          {channels.map(c => (
            <button key={c.id} onClick={() => setActiveId(c.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 ${activeId === c.id ? "bg-primary-soft text-primary" : "hover:bg-muted"}`}>
              <Hash className="size-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{c.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{c.lastMessage}</div>
              </div>
              {c.unread > 0 && <span className="size-5 grid place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">{c.unread}</span>}
            </button>
          ))}
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Hash className="size-4 text-muted-foreground" />
            <span className="font-semibold">{activeChannel?.name}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {channelMsgs.map(m => {
              const member = members.find(x => x.id === m.memberId);
              const isMe = m.memberId === "m1";
              return (
                <div key={m.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                  <div className="size-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-semibold shrink-0">{member?.initials}</div>
                  <div className={`max-w-[75%] ${isMe ? "items-end" : ""} flex flex-col`}>
                    <div className={`px-3 py-2 rounded-2xl text-sm ${isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"}`}>
                      {!isMe && <div className="text-[11px] font-semibold mb-0.5 opacity-70">{member?.name}</div>}
                      {m.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5 px-1">{m.time}</span>
                  </div>
                </div>
              );
            })}
            {channelMsgs.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Noch keine Nachrichten</p>}
          </div>
          <form onSubmit={send} className="border-t border-border p-3 flex gap-2">
            <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Nachricht…"
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
            <button className="px-3 py-2 rounded-lg gradient-primary text-white"><Send className="size-4" /></button>
          </form>
        </Card>
      </div>
    </>
  );
}

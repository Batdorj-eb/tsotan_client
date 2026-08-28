"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin";
import { useAdminUser } from "@/components/admin-user";

type Message = {
  id: number;
  phoneNumber?: string | null;
  suggest?: string | null;
  createdAt?: string;
};

function formatWhen(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMessagesPage() {
  const { canDelete } = useAdminUser();
  const [messages, setMessages] = useState<Message[]>([]);

  async function load() {
    setMessages(await adminFetch<Message[]>("/mail/messages"));
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function remove(id: number) {
    if (!confirm("Устгах уу?")) return;
    await adminFetch(`/mail/messages/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Санал хүсэлт</h1>
      {messages.length === 0 ? (
        <p className="mt-10 text-sm text-muted">Одоогоор санал байхгүй.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="py-3">Огноо</th>
                <th>Утас</th>
                <th>Санал</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {messages.map((item) => (
                <tr key={item.id} className="border-b border-line align-top">
                  <td className="whitespace-nowrap py-3 text-muted">
                    {formatWhen(item.createdAt)}
                  </td>
                  <td className="py-3">{item.phoneNumber || "—"}</td>
                  <td className="max-w-xl py-3 whitespace-pre-wrap">{item.suggest || "—"}</td>
                  <td className="py-3 text-right">
                    {canDelete ? (
                      <button onClick={() => remove(item.id)} className="text-accent">
                        Устгах
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

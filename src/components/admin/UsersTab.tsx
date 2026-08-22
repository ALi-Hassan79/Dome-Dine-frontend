"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { adminApi, type AdminUser } from "@/lib/admin";
import { ApiRequestError } from "@/lib/api";
import { cn } from "@/lib/utils";

export function UsersTab() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    adminApi
      .getUsers(token)
      .then(({ users }) => setUsers(users))
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, [token]);

  const toggleActive = async (u: AdminUser) => {
    if (!token) return;
    setActingOn(u.id);
    try {
      await adminApi.setUserStatus(u.id, !u.is_active, token);
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, is_active: !x.is_active } : x))
      );
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Action failed.");
    } finally {
      setActingOn(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 rounded-sm bg-paper/10 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-marker text-sm">{error}</p>;

  return (
    <div className="bg-paper text-ink rounded-sm shadow-lg shadow-black/10 overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-ink/15 text-left text-xs font-mono uppercase text-ink/50">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-ink/10 last:border-0">
              <td className="px-4 py-3 font-medium">{u.name}</td>
              <td className="px-4 py-3 text-ink/70">{u.email}</td>
              <td className="px-4 py-3 capitalize text-ink/70">{u.role}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "text-[11px] font-mono uppercase px-2 py-0.5 rounded-sm",
                    u.is_active ? "bg-[#2b3a2e] text-chalk" : "bg-marker text-white"
                  )}
                >
                  {u.is_active ? "Active" : "Banned"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                {u.role !== "admin" && (
                  <button
                    onClick={() => toggleActive(u)}
                    disabled={actingOn === u.id}
                    className={cn(
                      "text-xs font-medium px-3 py-1.5 rounded-sm transition disabled:opacity-50",
                      u.is_active
                        ? "bg-marker text-white hover:brightness-110"
                        : "bg-[#2b3a2e] text-chalk hover:brightness-110"
                    )}
                  >
                    {u.is_active ? "Ban" : "Unban"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
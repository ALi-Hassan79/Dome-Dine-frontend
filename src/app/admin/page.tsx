"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { RequireRole } from "@/components/RequireRole";
import { PendingListingsTab } from "@/components/admin/PendingListingsTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { cn } from "@/lib/utils";

type Tab = "pending" | "users";

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("pending");

  return (
    <main className="flex-1 board-texture px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl text-chalk mb-1">Admin board</h1>
        <p className="text-sm text-chalk/60 mb-8">
          Approve new listings and manage user accounts.
        </p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("pending")}
            className={cn(
              "text-sm font-mono px-4 py-2 rounded-sm transition-colors",
              tab === "pending" ? "bg-paper text-ink" : "bg-chalk/10 text-chalk/70 hover:bg-chalk/15"
            )}
          >
            Pending listings
          </button>
          <button
            onClick={() => setTab("users")}
            className={cn(
              "text-sm font-mono px-4 py-2 rounded-sm transition-colors",
              tab === "users" ? "bg-paper text-ink" : "bg-chalk/10 text-chalk/70 hover:bg-chalk/15"
            )}
          >
            Users
          </button>
        </div>

        {tab === "pending" ? <PendingListingsTab /> : <UsersTab />}
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <RequireRole role="admin">
        <AdminDashboard />
      </RequireRole>
    </>
  );
}
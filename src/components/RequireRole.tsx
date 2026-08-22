"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function RequireRole({
  role,
  children,
}: {
  role: "admin" | "owner" | "student";
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace("/");
    }
  }, [user, loading, role, router]);

  if (loading || !user || user.role !== role) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-chalk/50 text-sm font-mono">
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
}
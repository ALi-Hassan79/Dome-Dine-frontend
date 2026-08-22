"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "owner" | "admin";
  phone: string | null;
  isVerified: boolean;
  createdAt: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setSession: (token: string, user: User) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, restore session from localStorage and confirm it's
  // still valid (catches expired tokens / banned accounts).
  useEffect(() => {
    const storedToken = localStorage.getItem("dormdine_token");
    if (!storedToken) {
      setLoading(false);
      return;
    }
    api
      .get<{ user: User }>("/auth/me", storedToken)
      .then(({ user }) => {
        setToken(storedToken);
        setUser(user);
      })
      .catch(() => {
        localStorage.removeItem("dormdine_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const setSession = (newToken: string, newUser: User) => {
    localStorage.setItem("dormdine_token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    const { token: newToken, user: newUser } = await api.post<{ token: string; user: User }>(
      "/auth/login",
      { email, password }
    );
    setSession(newToken, newUser);
  };

  const logout = () => {
    localStorage.removeItem("dormdine_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
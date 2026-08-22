"use client";
import { useState } from "react";
import Link from "next/link";
import { Pin, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 bg-board/95 backdrop-blur border-b border-chalk/10">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Pin className="text-marker" size={20} />
          <span className="font-display text-3xl text-chalk">Dorm & Dine</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-chalk/80">
          <Link href="/" className="hover:text-chalk transition-colors">Browse</Link>
          <Link href="/list-your-place" className="hover:text-chalk transition-colors">List your place</Link>
          <Link href="/how-it-works" className="hover:text-chalk transition-colors">How it works</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop-only account controls */}
          {loading ? null : user ? (
            <div className="hidden sm:flex items-center gap-3">
              {user.role === "admin" && (
                <Link href="/admin" className="text-sm font-medium text-chalk/80 hover:text-chalk transition-colors">
                  Admin
                </Link>
              )}
              {user.role === "owner" && (
                <Link href="/my-listings" className="text-sm font-medium text-chalk/80 hover:text-chalk transition-colors">
                  My listings
                </Link>
              )}
              {user.role === "student" && (
                <Link href="/saved" className="text-sm font-medium text-chalk/80 hover:text-chalk transition-colors">
                  Saved
                </Link>
              )}
              <span className="text-sm text-chalk/80">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm font-medium bg-paper text-ink px-4 py-1.5 rounded-sm hover:brightness-95 transition"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-block text-sm font-medium bg-yellow text-ink px-4 py-1.5 rounded-sm hover:brightness-95 transition"
            >
              Sign in
            </Link>
          )}

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="sm:hidden flex h-9 w-9 items-center justify-center rounded-sm text-chalk hover:bg-chalk/10 transition"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav className="sm:hidden border-t border-chalk/10 bg-board px-5 py-4 flex flex-col gap-1 text-sm">
          <Link href="/" onClick={closeMenu} className="py-2 text-chalk/80 hover:text-chalk transition-colors">
            Browse
          </Link>
          <Link href="/list-your-place" onClick={closeMenu} className="py-2 text-chalk/80 hover:text-chalk transition-colors">
            List your place
          </Link>
          <Link href="/how-it-works" onClick={closeMenu} className="py-2 text-chalk/80 hover:text-chalk transition-colors">
            How it works
          </Link>

          {loading ? null : user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" onClick={closeMenu} className="py-2 text-chalk/80 hover:text-chalk transition-colors">
                  Admin
                </Link>
              )}
              {user.role === "owner" && (
                <Link href="/my-listings" onClick={closeMenu} className="py-2 text-chalk/80 hover:text-chalk transition-colors">
                  My listings
                </Link>
              )}
              {user.role === "student" && (
                <Link href="/saved" onClick={closeMenu} className="py-2 text-chalk/80 hover:text-chalk transition-colors">
                  Saved
                </Link>
              )}
              <div className="mt-2 pt-3 border-t border-chalk/10 flex items-center justify-between">
                <span className="text-chalk/80">Hi, {user.name.split(" ")[0]}</span>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center gap-1.5 text-sm font-medium bg-paper text-ink px-4 py-1.5 rounded-sm hover:brightness-95 transition"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              onClick={closeMenu}
              className="mt-2 inline-block text-center text-sm font-medium bg-yellow text-ink px-4 py-2 rounded-sm hover:brightness-95 transition"
            >
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
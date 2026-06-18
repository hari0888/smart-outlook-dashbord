import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Lightweight demo auth.
 * - No backend, no password field anywhere — `signIn()` takes no credentials,
 *   matching how the real Microsoft OAuth popup will work once MSAL is wired up.
 * - Only the resulting session (name/email/initials) is cached in localStorage,
 *   the same way MSAL caches its session — never a username or password.
 * - Replace this whole file with a real auth provider (MSAL / Supabase / Auth.js /
 *   etc.) when you wire up a real backend.
 */

const DEMO_USER: AuthUser = {
  email: "demo@outlook.com",
  name: "Demo User",
  initials: "DU",
};

export type AuthUser = {
  email: string;
  name: string;
  initials: string;
};

const STORAGE_KEY = "outlook-ai-session";

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const signIn = useCallback(async () => {
    // Stands in for the Microsoft OAuth popup — no credentials are collected
    // or stored here. Only the resulting session is cached, just like MSAL does.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

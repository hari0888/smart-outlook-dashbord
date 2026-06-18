import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Lightweight demo auth.
 * - No backend; credentials are hardcoded below.
 * - Session is persisted in localStorage under `demo-auth-user`.
 * - Replace this whole file with a real auth provider (Lovable Cloud /
 *   Supabase / Auth.js / etc.) when you wire up a real backend.
 */

export const DEMO_CREDENTIALS = {
  email: "demo@outlook.com",
  password: "demo123",
};

export type AuthUser = {
  email: string;
  name: string;
  initials: string;
};

const DEMO_USER: AuthUser = {
  email: DEMO_CREDENTIALS.email,
  name: "Demo User",
  initials: "DU",
};

const STORAGE_KEY = "demo-auth-user";

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
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

  const signIn = useCallback(async (email: string, password: string) => {
    const ok =
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password;
    if (!ok) throw new Error("Invalid email or password.");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

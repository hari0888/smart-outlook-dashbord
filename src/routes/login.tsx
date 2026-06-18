import { useState } from "react";
import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { Mail, Sparkles, ShieldCheck, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Outlook AI" },
      { name: "description", content: "Sign in to your Outlook AI dashboard." },
    ],
  }),
  component: LoginPage,
});

const highlights = [
  {
    icon: Mail,
    title: "Unified inbox",
    desc: "Every message, prioritized and searchable in one place.",
  },
  { icon: Calendar, title: "Smart calendar", desc: "See what's now and what's next at a glance." },
  {
    icon: BarChart3,
    title: "AI insights",
    desc: "Daily summaries that surface what actually matters.",
  },
];

function MicrosoftLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

function LoginPage() {
  const { user, ready, signIn } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (ready && user) return <Navigate to="/" />;

  async function handleSignIn() {
    setError(null);
    setBusy(true);
    try {
      await signIn();
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand / hero panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,oklch(0.30_0.10_252)_0%,oklch(0.18_0.06_255)_55%,oklch(0.12_0.03_260)_100%)] p-10 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(1_0_0/0.08),transparent_50%)]" />
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
            <Mail className="h-4.5 w-4.5" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Outlook AI</span>
        </div>

        <div className="relative z-10 max-w-md space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              AI-powered platform for Outlook users
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              Your inbox, calendar, and priorities - finally in sync.
            </h1>
            <p className="text-sm leading-relaxed text-white/70">
              Outlook AI turns your day into a single, clear view. Less digging through email, more
              getting things done.
            </p>
          </div>

          <div className="space-y-4">
            {highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <h.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{h.title}</div>
                  <div className="text-xs text-white/60">{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-1.5 text-xs text-white/50">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secured with Microsoft Entra ID — your password never touches this app
        </div>
      </div>

      {/* Right — sign-in panel */}
      <div className="flex items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 space-y-1.5 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight">Outlook AI</span>
            </div>
          </div>

          <div className="mb-7 space-y-1.5 text-center lg:text-left">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary lg:mx-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="pt-2 text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in with your Microsoft account to continue.
            </p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full gap-2.5 border-border text-sm font-medium shadow-card transition-transform hover:scale-[1.01] hover:bg-accent active:scale-[0.99]"
              disabled={busy}
              onClick={handleSignIn}
            >
              <MicrosoftLogo />
              {busy ? "Signing in…" : "Sign in with Microsoft"}
            </Button>

            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
              <p>
                We never ask for or store your Microsoft password. This demo simulates the Microsoft
                sign-in popup — see the README to connect a real Microsoft 365 account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

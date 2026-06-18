# Outlook AI — Smart Dashboard

A modern, AI-powered dashboard for Microsoft Outlook. The UI is fully built and
runs entirely on **demo data** out of the box, so you can preview every screen
without setting up Microsoft Graph. When you're ready, swap a single file to
wire it to a real Microsoft account.

---

## Tech Stack

- **React 19** + **TypeScript**
- **TanStack Start** (Vite-based SSR/SSG framework) + **TanStack Router**
- **TanStack Query** for data fetching/caching
- **Tailwind CSS v4** + **shadcn/ui** components
- **Recharts** for charts
- **lucide-react** for icons
- **Zod** for runtime validation

---

## Features

| Section          | What it shows                                                                  |
| ---------------- | ------------------------------------------------------------------------------ |
| **Dashboard**    | Greeting, email metrics, 7-day activity chart, recent mail, upcoming events, smart insights |
| **Email**        | Searchable inbox with All / Unread / Priority filters (URL-driven)             |
| **Calendar**     | "Happening now", today's timeline, and the next 7 days                         |
| **Insights**     | AI-generated summary of inbox + agenda + suggested priorities                  |
| **Theme toggle** | Light / dark mode (persisted in `localStorage`)                                |
| **Search**       | Global header search jumps to `/mail` with the query applied                   |

---

## Quick Start

```bash
# Install dependencies
bun install     # or: npm install / pnpm install

# Start the dev server
bun run dev     # or: npm run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

The app runs at `http://localhost:5173` by default.

---

## Project Structure

```
src/
├── routes/                  # File-based routes (TanStack Router)
│   ├── __root.tsx           # Root layout, <head>, error/404 boundaries
│   ├── index.tsx            # /            — Dashboard
│   ├── login.tsx            # /login       — Sign-in page
│   ├── mail.tsx             # /mail        — Inbox (?q=&filter=)
│   ├── calendar.tsx         # /calendar    — Calendar
│   ├── insights.tsx         # /insights    — AI insights
│   └── settings.tsx         # /settings    — Profile, notifications, theme
│
├── components/
│   ├── app-shell.tsx        # Sidebar + header + main wrapper
│   ├── app-header.tsx       # Top bar (search, theme, profile, sign-out)
│   ├── app-sidebar.tsx      # Left navigation
│   ├── email-metrics.tsx    # 4 KPI cards
│   ├── email-activity-chart.tsx
│   ├── recent-emails.tsx
│   ├── upcoming-events.tsx
│   ├── smart-insights.tsx
│   ├── theme-toggle.tsx
│   └── ui/                  # shadcn/ui primitives
│
├── lib/
│   ├── auth.tsx             # 👈 Demo login/logout credentials
│   ├── mock-data.ts         # 👈 ALL demo data lives here
│   └── utils.ts
│
└── styles.css               # Tailwind v4 + design tokens
```

---

## Pages Reference

| Route | File | What it shows |
| ----- | ---- | ------------- |
| `/` | `src/routes/index.tsx` | Dashboard — greeting, email metrics, 7-day chart, recent emails, upcoming events, smart insights |
| `/login` | `src/routes/login.tsx` | Sign-in page with email + password form |
| `/mail` | `src/routes/mail.tsx` | Inbox — searchable, filterable email list (All / Unread / Priority) |
| `/calendar` | `src/routes/calendar.tsx` | Calendar — today's timeline, "happening now", next 7 days |
| `/insights` | `src/routes/insights.tsx` | Smart insights — AI summary cards and email activity chart |
| `/settings` | `src/routes/settings.tsx` | Settings — profile fields, notification toggles, dark mode toggle |

---

## What to Change & Where (Line-by-Line)

### 1. Change the demo login credentials
**File:** `src/lib/auth.tsx`

| Line | Current | Change to |
| ---- | ------- | --------- |
| 19 | `email: "demo@outlook.com"` | Your demo email |
| 20 | `password: "demo123"` | Your demo password |

### 2. Change the profile name / email / job title shown across the app
**File:** `src/lib/mock-data.ts`

| Line | Field | Current value |
| ---- | ----- | ------------- |
| 195 | `name` | `"Alex Morgan"` |
| 196 | `email` | `"alex.morgan@contoso.com"` |
| 197 | `jobTitle` | `"Senior Product Manager"` |
| 198 | `initials` | `"AM"` |

These values appear in:
- Dashboard greeting (`src/routes/index.tsx` line 47)
- Header avatar and dropdown (`src/components/app-header.tsx` lines 144, 148, 150)
- Settings profile form (`src/routes/settings.tsx` lines 57, 61, 65)

### 3. Change demo emails
**File:** `src/lib/mock-data.ts` — lines 32-121

Edit the `emails` array directly. Each entry has:
- `from.name`, `from.email` — sender
- `subject`, `preview` — content
- `receivedAt` — timestamp (auto-generated relative to now)
- `isRead`, `isPriority` — flags

### 4. Change demo calendar events
**File:** `src/lib/mock-data.ts` — lines 123-192

Edit the `events` array directly. Each entry has:
- `title`, `organizer`, `attendees`, `location`
- `start`, `end` — timestamps (auto-generated relative to now)
- `meetingLink` — optional Teams/Zoom link

### 5. Change the 7-day email activity chart data
**File:** `src/lib/mock-data.ts` — lines 202-210

Edit the `emailActivity` array. Each object is `{ day: string, received: number, sent: number }`.

### 6. Change the smart insights text
**File:** `src/lib/mock-data.ts` — lines 212-223

Edit the `insights` object:
- `unreadSummary` — summary paragraph
- `dailyAgenda` — agenda paragraph
- `priorities` — array of 4 bullet strings

### 7. Remove the "Demo data" badge from the header
**File:** `src/components/app-header.tsx`

Delete lines 57-63 (the `<Badge>` block with `<Plug className="h-3 w-3" /> Demo data`).

### 8. Change sidebar navigation labels or add new pages
**File:** `src/components/app-sidebar.tsx`

- Lines 24-29 — main nav items (Dashboard, Email, Calendar, Insights)
- Lines 31-34 — folder shortcuts (Inbox, Priority) with badge counts
- Lines 98-109 — footer link (Settings)

### 9. Change page titles / SEO meta tags
Each route file has a `head()` block near the top. Example:

- `src/routes/index.tsx` lines 12-26
- `src/routes/login.tsx` lines 11-16
- `src/routes/mail.tsx` lines 19-26
- `src/routes/calendar.tsx` lines 8-18
- `src/routes/insights.tsx` lines 7-19
- `src/routes/settings.tsx` lines 13-17

---

## Demo Data

Every screen reads from a single file:

```
src/lib/mock-data.ts
```

It exports four things, each strongly typed:

| Export          | Type                | Used by                                       |
| --------------- | ------------------- | --------------------------------------------- |
| `emails`        | `Email[]`           | Dashboard, Email page, Email metrics          |
| `events`        | `CalendarEvent[]`   | Dashboard, Calendar page                      |
| `emailActivity` | `{ day, received, sent }[]` | 7-day activity chart                  |
| `insights`      | `{ unreadSummary, dailyAgenda, priorities[] }` | Smart Insights card        |
| `profile`       | `{ name, email, jobTitle, initials }` | Header avatar, greeting        |

You can edit any of these arrays/objects and the entire UI updates immediately.

---

## Switching to Real Outlook Login (Microsoft OAuth)

Follow these 5 steps **in order**. If you do all of them, you'll be able to sign in
with your real Outlook / Microsoft 365 account and the dashboard will load your
real mail + calendar. Files you'll touch are listed for each step.

### Step 1 — Register an app in Microsoft Entra (Azure AD)

1. Go to <https://entra.microsoft.com> → **App registrations** → **New registration**.
2. **Supported account types:** "Accounts in any organizational directory and personal Microsoft accounts".
3. **Redirect URI** → platform **Single-page application (SPA)** → add BOTH:
   - `http://localhost:5173` (for `bun run dev`)
   - Your production URL, e.g. `https://your-app.lovable.app`
4. After it's created, open **API permissions** → **Add a permission** → **Microsoft Graph** → **Delegated**, and add:
   `User.Read`, `Mail.Read`, `Calendars.Read`, `offline_access`. Click **Grant admin consent** if available.
5. Copy the **Application (client) ID** and **Directory (tenant) ID** from the Overview page.
   Use `common` as the tenant if you want both personal and work accounts to sign in.

### Step 2 — Install MSAL and add env vars

```bash
bun add @azure/msal-browser @azure/msal-react
```

Create a `.env` file in the project root (do NOT commit it):

```env
VITE_MS_CLIENT_ID=<paste Application (client) ID here>
VITE_MS_TENANT_ID=common
```

### Step 3 — Replace `src/lib/auth.tsx` with the MSAL version

**File:** `src/lib/auth.tsx` — replace the ENTIRE file with this. The exports
(`AuthProvider`, `useAuth`, `AuthUser`) stay the same so nothing else breaks:

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PublicClientApplication, EventType, type AccountInfo } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";

export const SCOPES = ["User.Read", "Mail.Read", "Calendars.Read", "offline_access"];

export const msal = new PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_MS_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MS_TENANT_ID}`,
    redirectUri: typeof window !== "undefined" ? window.location.origin : "/",
  },
  cache: { cacheLocation: "localStorage" },
});

// Required by MSAL v3+ before any other call
await msal.initialize();
msal.addEventCallback((e) => {
  if (e.eventType === EventType.LOGIN_SUCCESS && e.payload && "account" in e.payload) {
    msal.setActiveAccount((e.payload as { account: AccountInfo }).account);
  }
});

export type AuthUser = { email: string; name: string; initials: string };

function toUser(acc: AccountInfo): AuthUser {
  const name = acc.name || acc.username;
  const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return { email: acc.username, name, initials };
}

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  signIn: () => Promise<void>;            // no args — opens Microsoft popup
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function InnerProvider({ children }: { children: ReactNode }) {
  const { instance, accounts } = useMsal();
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  const user = accounts[0] ? toUser(accounts[0]) : null;

  const signIn = async () => {
    const res = await instance.loginPopup({ scopes: SCOPES, prompt: "select_account" });
    instance.setActiveAccount(res.account);
  };
  const signOut = () => { instance.logoutPopup(); };

  return <AuthContext.Provider value={{ user, ready, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <MsalProvider instance={msal}><InnerProvider>{children}</InnerProvider></MsalProvider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export async function getAccessToken(): Promise<string> {
  const account = msal.getActiveAccount() ?? msal.getAllAccounts()[0];
  if (!account) throw new Error("Not signed in");
  const res = await msal.acquireTokenSilent({ account, scopes: SCOPES });
  return res.accessToken;
}
```

### Step 4 — Update `src/routes/login.tsx` to use the Microsoft popup

The current login page uses an email + password form. MSAL doesn't take a
password — it opens Microsoft's own sign-in window. Replace the form body:

1. Remove the `email`, `password`, `error`, and `DEMO_CREDENTIALS` imports/state.
2. Replace the `<form>` (lines 55-102) with a single button:

```tsx
<Button className="w-full" disabled={busy} onClick={async () => {
  setBusy(true);
  try { await signIn(); navigate({ to: "/" }); }
  finally { setBusy(false); }
}}>
  {busy ? "Opening Microsoft…" : "Sign in with Microsoft"}
</Button>
```

3. Update the destructure on line 21 to `const { user, ready, signIn } = useAuth();`
   (no email/password args — `signIn()` takes nothing).

### Step 5 — Swap mock data for Microsoft Graph calls

**File:** `src/lib/mock-data.ts` — keep the same exports/types so no component
needs to change. Replace the hardcoded `emails`, `events`, and `profile` with
async fetchers, then call them with TanStack Query in each route:

```ts
// src/lib/mock-data.ts
import { getAccessToken } from "./auth";

async function graph<T>(path: string): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Graph error ${res.status}`);
  return res.json();
}

export async function fetchEmails(): Promise<Email[]> {
  const data = await graph<{ value: any[] }>(
    "/me/messages?$top=25&$select=id,from,subject,bodyPreview,receivedDateTime,isRead,importance",
  );
  return data.value.map((m) => ({
    id: m.id,
    from: { name: m.from?.emailAddress?.name ?? "Unknown", email: m.from?.emailAddress?.address ?? "" },
    subject: m.subject ?? "(no subject)",
    preview: m.bodyPreview ?? "",
    receivedAt: m.receivedDateTime,
    isRead: m.isRead,
    isPriority: m.importance === "high",
    folder: "inbox",
  }));
}

export async function fetchEvents(): Promise<CalendarEvent[]> {
  const now = new Date().toISOString();
  const in7d = new Date(Date.now() + 7 * 86_400_000).toISOString();
  const data = await graph<{ value: any[] }>(
    `/me/calendarView?startDateTime=${now}&endDateTime=${in7d}&$select=id,subject,organizer,attendees,location,start,end,onlineMeeting`,
  );
  return data.value.map((e) => ({
    id: e.id,
    title: e.subject,
    organizer: e.organizer?.emailAddress?.name ?? "",
    attendees: (e.attendees ?? []).map((a: any) => a.emailAddress?.name ?? a.emailAddress?.address),
    location: e.location?.displayName ?? "",
    start: e.start?.dateTime,
    end: e.end?.dateTime,
    meetingLink: e.onlineMeeting?.joinUrl,
  }));
}

export async function fetchProfile() {
  const me = await graph<any>("/me");
  const initials = (me.displayName ?? "U U").split(" ").map((s: string) => s[0]).slice(0, 2).join("");
  return { name: me.displayName, email: me.userPrincipalName, jobTitle: me.jobTitle ?? "", initials };
}
```

Then in each route (e.g. `src/routes/mail.tsx`):

```tsx
import { useQuery } from "@tanstack/react-query";
import { fetchEmails } from "@/lib/mock-data";

const { data: emails = [] } = useQuery({ queryKey: ["emails"], queryFn: fetchEmails, staleTime: 60_000 });
```

### Verification checklist

After all 5 steps:

- [ ] `.env` contains `VITE_MS_CLIENT_ID` and `VITE_MS_TENANT_ID`
- [ ] Your dev URL (`http://localhost:5173`) is in the Entra app's SPA redirect URIs
- [ ] `bun run dev` starts without `Failed to resolve import "@azure/msal-..."` errors
- [ ] Visiting `/login` shows a single **"Sign in with Microsoft"** button
- [ ] Clicking it opens a real `login.microsoftonline.com` popup
- [ ] After consent, the dashboard greeting shows YOUR real name, and `/mail` lists YOUR real messages

### Common pitfalls

| Symptom | Fix |
| ------- | --- |
| `AADSTS9002326` / "redirect URI mismatch" | The URL in the browser must EXACTLY match one of the Entra SPA redirect URIs (scheme + host + port, no trailing slash). |
| `AADSTS65001` / consent required | Click **Grant admin consent** in Entra, or sign in with an account that can consent. |
| Popup blocked | Trigger `signIn()` from a user click handler (don't auto-call it on mount). |
| `Graph error 401` | Token expired or scope missing — re-check the 4 delegated permissions in Step 1. |
| Sign-in works but data is empty | You probably forgot Step 5 — components are still importing the (now-removed) demo arrays. Switch them to `useQuery`. |

---

## Security Notes

- **Never store the user's Microsoft password.** OAuth 2.0 + PKCE handles this for you.
- **Access tokens** live in `localStorage` only because MSAL manages rotation;
  prefer `sessionStorage` or in-memory storage if you can.
- **Refresh tokens** are managed automatically by MSAL via the `offline_access` scope.
- Respect [Microsoft Graph throttling guidance](https://learn.microsoft.com/graph/throttling)
  — batch requests where possible and cache aggressively with React Query.
- Request only the four scopes listed above. Adding more requires admin consent.

---

## Available Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `bun run dev`      | Start dev server with HMR            |
| `bun run build`    | Production build                     |
| `bun run preview`  | Preview the built app                |
| `bun run lint`     | Run ESLint                           |
| `bun run format`   | Format with Prettier                 |

---

## License

MIT — do whatever you like with it.

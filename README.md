# Outlook AI — Smart Dashboard

A modern, AI-powered dashboard for Microsoft Outlook. The UI is fully built and
runs entirely on **demo data** out of the box, so you can preview every screen
without setting up Microsoft Graph. When you're ready, swap a single file to
wire it to a real Microsoft account.

---

## Tech Stack

| Layer             | Choice                                             | Notes                                                                                                                             |
| ----------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| UI framework      | **React 19** + **TypeScript**                      | Strict mode, no `any` in app code                                                                                                 |
| App framework     | **TanStack Start** (Vite-based SSR)                | File-based routing via **TanStack Router**; routes live in `src/routes/`                                                          |
| Data fetching     | **TanStack Query**                                 | Wired up via `QueryClient` in `src/router.tsx`; not yet used for live data — see [Do You Need a Backend?](#do-you-need-a-backend) |
| Styling           | **Tailwind CSS v4** + **shadcn/ui**                | Design tokens (OKLCH colors, radii, shadows) defined once in `src/styles.css`                                                     |
| Charts            | **Recharts**                                       | Used by `email-activity-chart.tsx`                                                                                                |
| Icons             | **lucide-react**                                   |                                                                                                                                   |
| Validation        | **Zod**                                            | Validates URL search params (e.g. `/mail?filter=`)                                                                                |
| Build tool        | **Vite 8** via `@lovable.dev/vite-tanstack-config` | Bundles the TanStack Start, React, Tailwind, and Nitro plugins — see comment in `vite.config.ts` before adding plugins manually   |
| SSR server target | **Nitro**                                          | Defaults to a Cloudflare-style entry; `src/server.ts`/`src/start.ts` wrap it with error-recovery middleware                       |
| Package manager   | **bun** (has a `bun.lock`)                         | `npm`/`pnpm` also work — there's a `package-lock.json` checked in too                                                             |
| Tests             | **None yet**                                       | No test runner is configured in this project                                                                                      |

---

## Features

| Section          | What it shows                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **Dashboard**    | Greeting, email metrics, 7-day activity chart, recent mail, upcoming events, smart insights |
| **Email**        | Searchable inbox with All / Unread / Priority filters (URL-driven)                          |
| **Calendar**     | "Happening now", today's timeline, and the next 7 days                                      |
| **Insights**     | AI-generated summary of inbox + agenda + suggested priorities                               |
| **Theme toggle** | Light / dark mode (persisted in `localStorage`)                                             |
| **Search**       | Global header search jumps to `/mail` with the query applied                                |

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
├── routes/                  # File-based routes (TanStack Router) — see Routes Reference below
│   ├── __root.tsx           # Root layout, <head>, error/404 boundaries
│   ├── index.tsx            # /            — Dashboard
│   ├── login.tsx            # /login       — Sign-in page
│   ├── mail.tsx             # /mail        — Inbox (?q=&filter=)
│   ├── calendar.tsx         # /calendar    — Calendar
│   ├── insights.tsx         # /insights    — AI insights
│   ├── settings.tsx         # /settings    — Profile, notifications, theme
│   └── verify.tsx           # /verify      — Manual pipeline self-check (not linked in nav)
│
├── components/
│   ├── app-shell.tsx        # Sidebar + header + main wrapper, redirects to /login if signed out
│   ├── app-header.tsx       # Top bar (search, theme, notifications, profile, sign-out)
│   ├── app-sidebar.tsx      # Left navigation + folder counts (derived from mock-data)
│   ├── email-metrics.tsx    # 4 KPI cards, each links to /mail with a filter applied
│   ├── email-activity-chart.tsx
│   ├── recent-emails.tsx
│   ├── upcoming-events.tsx
│   ├── smart-insights.tsx
│   ├── theme-toggle.tsx
│   └── ui/                  # shadcn/ui primitives (generated — avoid hand-editing)
│
├── hooks/
│   └── use-mobile.tsx       # Breakpoint hook used by the sidebar
│
├── lib/
│   ├── auth.tsx             # 👈 Demo session — no credentials, see auth section below
│   ├── mock-data.ts         # 👈 ALL demo data lives here
│   ├── utils.ts             # `cn()` class-merge helper
│   ├── error-capture.ts     # Captures uncaught errors so server.ts can recover the real stack
│   └── error-page.ts         # Static HTML fallback rendered on a 500
│
├── router.tsx                # Creates the TanStack Router + QueryClient
├── server.ts                  # SSR fetch handler — wraps Nitro's entry with error recovery
├── start.ts                   # Registers server-side request middleware (also catches errors)
└── styles.css                 # Tailwind v4 + design tokens (OKLCH colors, radii, shadows)
```

---

## Pages Reference

| Route       | File                      | What it shows                                                                                                        |
| ----------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `/`         | `src/routes/index.tsx`    | Dashboard — greeting, email metrics, 7-day chart, recent emails, upcoming events, smart insights                     |
| `/login`    | `src/routes/login.tsx`    | Sign-in page with a single "Sign in with Microsoft" button (no password field — nothing is ever collected or stored) |
| `/mail`     | `src/routes/mail.tsx`     | Inbox — searchable, filterable email list (All / Unread / Priority)                                                  |
| `/calendar` | `src/routes/calendar.tsx` | Calendar — today's timeline, "happening now", next 7 days                                                            |
| `/insights` | `src/routes/insights.tsx` | Smart insights — AI summary cards and email activity chart                                                           |
| `/settings` | `src/routes/settings.tsx` | Settings — profile fields, notification toggles, dark mode toggle                                                    |

---

## What to Change & Where (Line-by-Line)

### 1. Change the demo signed-in identity

**File:** `src/lib/auth.tsx`

There's no password to change — `signIn()` takes no credentials, simulating the
Microsoft OAuth popup. Edit the `DEMO_USER` object to change the name/email/initials
used for the simulated session:

| Line | Field      | Current value        |
| ---- | ---------- | -------------------- |
| ~12  | `email`    | `"demo@outlook.com"` |
| ~13  | `name`     | `"Demo User"`        |
| ~14  | `initials` | `"DU"`               |

### 2. Change the profile name / email / job title shown across the app

**File:** `src/lib/mock-data.ts`

| Line | Field      | Current value               |
| ---- | ---------- | --------------------------- |
| 195  | `name`     | `"Alex Morgan"`             |
| 196  | `email`    | `"alex.morgan@contoso.com"` |
| 197  | `jobTitle` | `"Senior Product Manager"`  |
| 198  | `initials` | `"AM"`                      |

These values appear in:

- Dashboard greeting (`src/routes/index.tsx`, `profile.name.split(" ")[0]`)
- Header avatar and dropdown (`src/components/app-header.tsx`, `profile.initials`/`profile.name`/`profile.jobTitle`)
- Settings profile form (`src/routes/settings.tsx`, `profile.name`/`profile.email`/`profile.jobTitle`)

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

Delete the `<Badge>` block containing `<Plug className="h-3 w-3" /> Demo data`.

### 8. Change sidebar navigation labels or add new pages

**File:** `src/components/app-sidebar.tsx`

- Lines 17-22 — main nav items (Dashboard, Email, Calendar, Insights)
- Lines 33-36 — folder shortcuts (Inbox, Priority); counts are derived live from
  `emails` in `mock-data.ts`, not hardcoded
- Bottom of the file — footer link (Settings)

### 9. Change page titles / SEO meta tags

Each route file has a `head()` block near the top, right inside `createFileRoute(...)`,
in `index.tsx`, `login.tsx`, `mail.tsx`, `calendar.tsx`, `insights.tsx`, and `settings.tsx`.

---

## Demo Data

Every screen reads from a single file:

```
src/lib/mock-data.ts
```

It exports four things, each strongly typed:

| Export          | Type                                           | Used by                              |
| --------------- | ---------------------------------------------- | ------------------------------------ |
| `emails`        | `Email[]`                                      | Dashboard, Email page, Email metrics |
| `events`        | `CalendarEvent[]`                              | Dashboard, Calendar page             |
| `emailActivity` | `{ day, received, sent }[]`                    | 7-day activity chart                 |
| `insights`      | `{ unreadSummary, dailyAgenda, priorities[] }` | Smart Insights card                  |
| `profile`       | `{ name, email, jobTitle, initials }`          | Header avatar, greeting              |

You can edit any of these arrays/objects and the entire UI updates immediately.

---

## Switching to Real Outlook Login (Microsoft OAuth)

Follow these 5 steps **in order**. If you do all of them, you'll be able to sign in
with your real Outlook / Microsoft 365 account and the dashboard will load your
real mail + calendar.

### Quick reference — every file you'll touch

| Step | Where                                  | What you do                                                                                                                                      | Why                                                               |
| ---- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| 1    | Microsoft Entra portal (no local file) | Register an app, add redirect URIs, grant 4 API permissions, copy the client ID + tenant ID                                                      | MSAL needs a registered app to authenticate against               |
| 2a   | **New file:** `.env` (project root)    | Add `VITE_MS_CLIENT_ID` and `VITE_MS_TENANT_ID`                                                                                                  | Feeds your Entra app's identity into MSAL at runtime              |
| 2b   | `package.json`                         | Run `bun add @azure/msal-browser @azure/msal-react`                                                                                              | Installs the Microsoft auth library                               |
| 3    | `src/lib/auth.tsx`                     | **Replace the entire file** with the MSAL version (code in Step 3 below)                                                                         | Swaps the simulated demo session for a real Microsoft OAuth popup |
| 4    | `src/routes/login.tsx`                 | **Nothing** — already calls `signIn()` with no arguments                                                                                         | Already matches MSAL's real signature                             |
| 5a   | `src/lib/mock-data.ts`                 | Replace the hardcoded `emails`, `events`, `profile` exports with the `fetchEmails`/`fetchEvents`/`fetchProfile` functions (code in Step 5 below) | Swaps demo arrays for live Microsoft Graph calls                  |
| 5b   | Every file in the table below          | Switch the import to a `useQuery(...)` call (pattern shown in Step 5)                                                                            | Each of these renders real data once Step 5a is wired up          |

**Files that import from `mock-data.ts` today** — each one needs its import swapped
to `useQuery` in Step 5:

| File                                      | Imports today                 | Becomes                                                                                                     |
| ----------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/routes/index.tsx`                    | `emails`, `events`, `profile` | `useQuery(fetchEmails)`, `useQuery(fetchEvents)`, `useQuery(fetchProfile)`                                  |
| `src/routes/mail.tsx`                     | `emails`                      | `useQuery(fetchEmails)`                                                                                     |
| `src/routes/calendar.tsx`                 | `events`                      | `useQuery(fetchEvents)`                                                                                     |
| `src/routes/settings.tsx`                 | `profile`                     | `useQuery(fetchProfile)`                                                                                    |
| `src/routes/verify.tsx`                   | `emails`, `events`, `profile` | same three queries (only matters if you keep this page)                                                     |
| `src/components/app-header.tsx`           | `emails`, `events`, `profile` | same three queries                                                                                          |
| `src/components/app-sidebar.tsx`          | `emails`                      | `useQuery(fetchEmails)`                                                                                     |
| `src/components/smart-insights.tsx`       | `insights`                    | No Graph equivalent exists for this — either keep it static or replace with your own AI summary call        |
| `src/components/email-activity-chart.tsx` | `emailActivity`               | No Graph equivalent — this would need to be computed client-side from `fetchEmails` results, grouped by day |

Since several components import the same data, the cleanest approach is to fetch
once per route with `useQuery` and pass the data down as props — exactly how
`emails`/`events`/`profile` are already passed into `EmailMetrics`, `RecentEmails`,
etc. today.

### Step 1 — Register an app in Microsoft Entra (Azure AD)

1. Go to <https://entra.microsoft.com> → **App registrations** → **New registration**.
2. **Supported account types:** "Accounts in any organizational directory and personal Microsoft accounts".
3. **Redirect URI** → platform **Single-page application (SPA)** → add BOTH:
   - `http://localhost:5173` (for `bun run dev`)
   - Your production URL, e.g. `https://your-app.example.com`
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
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return { email: acc.username, name, initials };
}

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  signIn: () => Promise<void>; // no args — opens Microsoft popup
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function InnerProvider({ children }: { children: ReactNode }) {
  const { instance, accounts } = useMsal();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const user = accounts[0] ? toUser(accounts[0]) : null;

  const signIn = async () => {
    const res = await instance.loginPopup({ scopes: SCOPES, prompt: "select_account" });
    instance.setActiveAccount(res.account);
  };
  const signOut = () => {
    instance.logoutPopup();
  };

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <MsalProvider instance={msal}>
      <InnerProvider>{children}</InnerProvider>
    </MsalProvider>
  );
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

### Step 4 — Point the existing button at the real Microsoft popup

Nothing to redesign here — `src/routes/login.tsx` is already a single
"Sign in with Microsoft" button calling `await signIn()` with no arguments,
which matches MSAL's `signIn()` signature exactly. Once you replace
`src/lib/auth.tsx` with the MSAL version in Step 3, this button automatically
opens the real Microsoft popup instead of the simulated demo session — no
changes needed in `login.tsx` itself.

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
    from: {
      name: m.from?.emailAddress?.name ?? "Unknown",
      email: m.from?.emailAddress?.address ?? "",
    },
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
  const initials = (me.displayName ?? "U U")
    .split(" ")
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("");
  return {
    name: me.displayName,
    email: me.userPrincipalName,
    jobTitle: me.jobTitle ?? "",
    initials,
  };
}
```

Then in each route (e.g. `src/routes/mail.tsx`):

```tsx
import { useQuery } from "@tanstack/react-query";
import { fetchEmails } from "@/lib/mock-data";

const { data: emails = [] } = useQuery({
  queryKey: ["emails"],
  queryFn: fetchEmails,
  staleTime: 60_000,
});
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

| Symptom                                   | Fix                                                                                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `AADSTS9002326` / "redirect URI mismatch" | The URL in the browser must EXACTLY match one of the Entra SPA redirect URIs (scheme + host + port, no trailing slash). |
| `AADSTS65001` / consent required          | Click **Grant admin consent** in Entra, or sign in with an account that can consent.                                    |
| Popup blocked                             | Trigger `signIn()` from a user click handler (don't auto-call it on mount).                                             |
| `Graph error 401`                         | Token expired or scope missing — re-check the 4 delegated permissions in Step 1.                                        |
| Sign-in works but data is empty           | You probably forgot Step 5 — components are still importing the (now-removed) demo arrays. Switch them to `useQuery`.   |

---

## Do You Need a Backend?

**For this app as it stands — no.** Once you complete the 5 steps above, everything
runs entirely in the browser:

- Sign-in is a real Microsoft OAuth popup (MSAL handles PKCE, token storage, and refresh)
- Mail/calendar data comes straight from `https://graph.microsoft.com` using the
  user's own delegated token — no server of yours sits in between
- TanStack Start's SSR is only used to render the initial HTML shell and `<head>`
  meta tags faster; `src/server.ts`/`src/start.ts` exist purely to catch and
  prettify SSR errors, not to run business logic

This is exactly the "personal dashboard" shape: one signed-in person, viewing
their own inbox and calendar, with Microsoft holding the actual mail/calendar data.

**You'd need a real backend (database + API) if you wanted to:**

| If you want to...                                                                  | You'd need...                                                                             |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Track/aggregate multiple Outlook users (e.g. an admin view of team email activity) | A database to store per-user metrics + a server-side job to pull Graph data for each user |
| Send scheduled digests/notifications (e.g. a daily email summary)                  | A server with a cron job or queue, since browser tabs can't run when closed               |
| Keep user settings (theme, notification prefs) in sync across devices              | A database — right now `localStorage` is per-browser only                                 |
| Hide your Entra `client_id`/throttle Graph calls centrally                         | A thin API layer between the browser and Graph                                            |
| Let users without a Microsoft account use the app                                  | Your own auth + database, since MSAL only covers Microsoft accounts                       |

None of these are needed for the current single-user scope — only add a backend
if one of those use cases becomes a real requirement.

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

| Command           | Description               |
| ----------------- | ------------------------- |
| `bun run dev`     | Start dev server with HMR |
| `bun run build`   | Production build          |
| `bun run preview` | Preview the built app     |
| `bun run lint`    | Run ESLint                |
| `bun run format`  | Format with Prettier      |

---

## License

MIT — do whatever you like with it.

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

## Replacing Demo Data With Real Microsoft Graph Data

The whole point of isolating data into `mock-data.ts` is that **you only need
to change that one file** to plug in real data.

### Step 1 — Register an app in Microsoft Entra (Azure AD)

1. Go to <https://entra.microsoft.com> → **App registrations** → **New registration**.
2. Set a redirect URI: `http://localhost:5173/auth/callback` (and your prod URL).
3. Under **API permissions**, add the following **delegated** Microsoft Graph permissions:
   - `User.Read`
   - `Mail.Read`
   - `Calendars.Read`
   - `offline_access`
4. Save the **Application (client) ID** and **Tenant ID**.

### Step 2 — Add OAuth 2.0 (PKCE) sign-in

Use Microsoft's official library, MSAL.js:

```bash
bun add @azure/msal-browser
```

Create `src/lib/auth.ts`:

```ts
import { PublicClientApplication } from "@azure/msal-browser";

export const msal = new PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_MS_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MS_TENANT_ID}`,
    redirectUri: window.location.origin + "/auth/callback",
  },
  cache: { cacheLocation: "localStorage" }, // refresh tokens handled by MSAL
});

export const SCOPES = ["User.Read", "Mail.Read", "Calendars.Read", "offline_access"];

export async function getAccessToken() {
  const account = msal.getAllAccounts()[0];
  if (!account) throw new Error("Not signed in");
  const result = await msal.acquireTokenSilent({ account, scopes: SCOPES });
  return result.accessToken;
}
```

Add a `.env` file (never commit it):

```env
VITE_MS_CLIENT_ID=your-client-id
VITE_MS_TENANT_ID=common
```

### Step 3 — Replace `src/lib/mock-data.ts`

Keep the **same exports and the same types** so no component needs to change.
Here is a drop-in template:

```ts
// src/lib/mock-data.ts  (now real-data.ts in spirit)
import { getAccessToken } from "./auth";

export type Email = {
  id: string;
  from: { name: string; email: string };
  subject: string;
  preview: string;
  receivedAt: string;
  isRead: boolean;
  isPriority: boolean;
  folder: "inbox" | "sent" | "drafts";
};

export type CalendarEvent = {
  id: string;
  title: string;
  organizer: string;
  attendees: string[];
  location: string;
  start: string;
  end: string;
  meetingLink?: string;
};

async function graph<T>(path: string): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Graph error ${res.status}`);
  return res.json();
}

// Use TanStack Query in components to call these, or pre-export resolved data.
// Easiest path: keep file synchronous by pre-fetching into React Query in a loader.

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
    .split(" ").map((s: string) => s[0]).slice(0, 2).join("");
  return {
    name: me.displayName,
    email: me.userPrincipalName,
    jobTitle: me.jobTitle ?? "",
    initials,
  };
}
```

### Step 4 — Switch components to React Query

Replace the synchronous imports in each route with `useQuery`:

```tsx
// before
import { emails } from "@/lib/mock-data";

// after
import { useQuery } from "@tanstack/react-query";
import { fetchEmails } from "@/lib/mock-data";

const { data: emails = [] } = useQuery({
  queryKey: ["emails"],
  queryFn: fetchEmails,
  staleTime: 60_000,
});
```

The "Demo data" badge in the header (`src/components/app-header.tsx`) can be
removed once you're on live data.

### Step 5 — Smart insights with AI (optional)

The `insights` object on the dashboard is currently hard-coded. To make it
real, send the unread emails + today's events to any LLM (OpenAI, Azure
OpenAI, etc.) with a prompt like:

> "Summarize my unread email, describe my day, and list my top 4 priorities."

Then map the response into the same `{ unreadSummary, dailyAgenda, priorities }`
shape that `SmartInsights` already expects.

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

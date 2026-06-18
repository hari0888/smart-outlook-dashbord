// Mock data simulating Microsoft Graph API responses.
// Replace with live Graph data once the Outlook connector is linked.

export type Email = {
  id: string;
  from: { name: string; email: string };
  subject: string;
  preview: string;
  receivedAt: string; // ISO
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
  start: string; // ISO
  end: string; // ISO
  meetingLink?: string;
};

const now = new Date();
const iso = (d: Date) => d.toISOString();
const minsFromNow = (m: number) => new Date(now.getTime() + m * 60_000);
const hoursFromNow = (h: number) => new Date(now.getTime() + h * 60 * 60_000);
const daysFromNow = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60_000);

export const emails: Email[] = [
  {
    id: "1",
    from: { name: "Sarah Chen", email: "sarah.chen@contoso.com" },
    subject: "Q4 roadmap review — please confirm by EOD",
    preview:
      "Hi team, attached is the updated Q4 roadmap. I'd like everyone to review the priority shifts in section 3 before our sync tomorrow…",
    receivedAt: iso(minsFromNow(-12)),
    isRead: false,
    isPriority: true,
    folder: "inbox",
  },
  {
    id: "2",
    from: { name: "GitHub", email: "noreply@github.com" },
    subject: "[acme/web] PR #482 ready for review",
    preview:
      "feat(dashboard): add unified email + calendar overview. 12 files changed, 432 additions, 89 deletions…",
    receivedAt: iso(minsFromNow(-35)),
    isRead: false,
    isPriority: false,
    folder: "inbox",
  },
  {
    id: "3",
    from: { name: "Marcus Bell", email: "marcus@northwind.com" },
    subject: "Re: Contract amendment — final version",
    preview:
      "Thanks for the quick turnaround. Legal signed off on the amendment this morning. We're good to countersign whenever…",
    receivedAt: iso(hoursFromNow(-1.5)),
    isRead: false,
    isPriority: true,
    folder: "inbox",
  },
  {
    id: "4",
    from: { name: "Priya Patel", email: "priya@fabrikam.io" },
    subject: "Design system v2.3 shipped 🎉",
    preview:
      "The new component library is live. Highlights include refreshed tokens, dark mode parity, and 14 new components…",
    receivedAt: iso(hoursFromNow(-3)),
    isRead: true,
    isPriority: false,
    folder: "inbox",
  },
  {
    id: "5",
    from: { name: "HR Updates", email: "hr@contoso.com" },
    subject: "Reminder: benefits enrollment closes Friday",
    preview:
      "This is a friendly reminder that the annual benefits enrollment window closes at 5:00 PM PT on Friday. Don't miss…",
    receivedAt: iso(hoursFromNow(-5)),
    isRead: true,
    isPriority: false,
    folder: "inbox",
  },
  {
    id: "6",
    from: { name: "Linear", email: "notifications@linear.app" },
    subject: "3 issues assigned to you this week",
    preview:
      "Your weekly digest: ENG-1204 (High), ENG-1208 (Medium), DSGN-302 (Low). View them in Linear…",
    receivedAt: iso(hoursFromNow(-7)),
    isRead: true,
    isPriority: false,
    folder: "inbox",
  },
  {
    id: "7",
    from: { name: "Elena Rossi", email: "elena@adventure-works.com" },
    subject: "Coffee next week?",
    preview:
      "Hey! I'll be in town Tuesday through Thursday — would love to grab coffee and catch up if you have time…",
    receivedAt: iso(hoursFromNow(-9)),
    isRead: true,
    isPriority: false,
    folder: "inbox",
  },
  {
    id: "8",
    from: { name: "Azure Monitor", email: "alerts@azure.com" },
    subject: "⚠ High CPU on prod-web-03",
    preview:
      "Resource prod-web-03 exceeded 90% CPU for 5 minutes at 14:22 UTC. Auto-scale triggered an additional instance…",
    receivedAt: iso(daysFromNow(-1)),
    isRead: true,
    isPriority: true,
    folder: "inbox",
  },
];

export const events: CalendarEvent[] = [
  {
    id: "e1",
    title: "Standup",
    organizer: "Sarah Chen",
    attendees: ["You", "Sarah Chen", "Marcus Bell", "Priya Patel", "+4"],
    location: "Teams",
    start: iso(minsFromNow(-10)),
    end: iso(minsFromNow(20)),
    meetingLink: "https://teams.microsoft.com/l/meetup-join/standup",
  },
  {
    id: "e2",
    title: "Design review — onboarding flow",
    organizer: "Priya Patel",
    attendees: ["You", "Priya Patel", "Design team"],
    location: "Room 4B / Teams",
    start: iso(hoursFromNow(1.5)),
    end: iso(hoursFromNow(2.5)),
    meetingLink: "https://teams.microsoft.com/l/meetup-join/dr",
  },
  {
    id: "e3",
    title: "1:1 with Marcus",
    organizer: "Marcus Bell",
    attendees: ["You", "Marcus Bell"],
    location: "Teams",
    start: iso(hoursFromNow(4)),
    end: iso(hoursFromNow(4.5)),
    meetingLink: "https://teams.microsoft.com/l/meetup-join/11",
  },
  {
    id: "e4",
    title: "Quarterly planning",
    organizer: "Sarah Chen",
    attendees: ["Leadership", "+12"],
    location: "Executive Boardroom",
    start: iso(daysFromNow(1)),
    end: iso(new Date(daysFromNow(1).getTime() + 2 * 60 * 60_000)),
    meetingLink: "https://teams.microsoft.com/l/meetup-join/qp",
  },
  {
    id: "e5",
    title: "Customer call — Northwind",
    organizer: "You",
    attendees: ["You", "Marcus Bell", "Northwind team"],
    location: "Teams",
    start: iso(daysFromNow(2)),
    end: iso(new Date(daysFromNow(2).getTime() + 45 * 60_000)),
    meetingLink: "https://teams.microsoft.com/l/meetup-join/nw",
  },
  {
    id: "e6",
    title: "Architecture sync",
    organizer: "Engineering",
    attendees: ["Eng leads", "+6"],
    location: "Teams",
    start: iso(daysFromNow(3)),
    end: iso(new Date(daysFromNow(3).getTime() + 60 * 60_000)),
  },
  {
    id: "e7",
    title: "Lunch & learn: Graph API",
    organizer: "Dev Rel",
    attendees: ["Anyone"],
    location: "Cafeteria",
    start: iso(daysFromNow(5)),
    end: iso(new Date(daysFromNow(5).getTime() + 60 * 60_000)),
  },
];

export const profile = {
  name: "Alex Morgan",
  email: "alex.morgan@contoso.com",
  jobTitle: "Senior Product Manager",
  initials: "AM",
};

// 7-day email activity for the chart
export const emailActivity = [
  { day: "Mon", received: 38, sent: 12 },
  { day: "Tue", received: 52, sent: 19 },
  { day: "Wed", received: 41, sent: 14 },
  { day: "Thu", received: 67, sent: 23 },
  { day: "Fri", received: 49, sent: 17 },
  { day: "Sat", received: 11, sent: 3 },
  { day: "Sun", received: 7, sent: 1 },
];

export const insights = {
  unreadSummary:
    "You have 3 unread messages. Sarah Chen needs roadmap confirmation by EOD, Marcus Bell sent the signed contract amendment, and GitHub has a PR awaiting your review.",
  dailyAgenda:
    "Today is meeting-heavy: standup is in progress, design review at 1:30 PM, and a 1:1 with Marcus at 4 PM. Block 2–3 PM for deep work — your only free hour.",
  priorities: [
    "Reply to Sarah Chen with roadmap confirmation",
    "Countersign the Northwind contract amendment",
    "Prep talking points for the 1:1 with Marcus",
    "Review PR #482 before EOD",
  ],
};

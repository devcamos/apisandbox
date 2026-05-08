export interface CompanyQuote {
  company: string
  text: string
  color: string
}

export interface DailyExample {
  label: string
  algo: string
  icon: string
}

export interface CompletionPath {
  title: string
  description: string
  icon: string
}

export interface StorySlide {
  id: number
  title: string
  body: string[]
  companyQuotes?: CompanyQuote[]
  dailyExamples?: DailyExample[]
  completionPaths?: CompletionPath[]
  ctaLabel?: string
  ctaHref?: string
  theme: {
    bg: string
    accent: string
  }
}

export const storySlides: StorySlide[] = [
  {
    id: 0,
    title: "Welcome Home",
    body: [
      "Before the hard stuff begins, take a breath.",
      "This is your space.",
      "No timers. No scores. No judgment. Just you, getting ready.",
    ],
    theme: {
      bg: "from-amber-950 via-slate-900 to-slate-950",
      accent: "amber-400",
    },
  },
  {
    id: 1,
    title: "Why Are You Here?",
    body: [
      "You are not here to memorize answers.",
      "You are here to learn how to think.",
      "When a system breaks at 2am, you won\u2019t Google a LeetCode solution. You\u2019ll need judgment. That\u2019s what this builds.",
    ],
    theme: {
      bg: "from-indigo-950 via-slate-900 to-slate-950",
      accent: "indigo-400",
    },
  },
  {
    id: 2,
    title: "What Algorithms Really Teach You",
    body: [
      "They teach you to see structure where others see chaos.",
      "To sit with something hard and work through it.",
      "To ask \u201Cwhat happens when this grows?\u201D",
      "That patience and precision \u2014 that\u2019s the real skill. It works in code. It works in life.",
    ],
    theme: {
      bg: "from-emerald-950 via-slate-900 to-slate-950",
      accent: "emerald-400",
    },
  },
  {
    id: 3,
    title: "It Starts with Breakfast",
    body: [
      "You already think like this. Every single day.",
      "You just don\u2019t call it an algorithm.",
    ],
    dailyExamples: [
      { label: "Picking the fastest route to work", algo: "Shortest path", icon: "route" },
      { label: "Deciding what to do first each morning", algo: "Priority scheduling", icon: "list" },
      { label: "Fitting everything into your bag", algo: "Bin packing", icon: "box" },
      { label: "Finding your keys in a messy room", algo: "Search", icon: "search" },
    ],
    theme: {
      bg: "from-orange-950 via-slate-900 to-slate-950",
      accent: "orange-400",
    },
  },
  {
    id: 4,
    title: "The Thinking Transfers",
    body: [
      "The same patterns that solve coding problems solve real ones.",
    ],
    dailyExamples: [
      { label: "Debugging why your wifi is slow", algo: "Binary search \u2014 isolate the problem half by half", icon: "wifi" },
      { label: "Planning a group dinner with 10 preferences", algo: "Constraint satisfaction", icon: "users" },
      { label: "Managing money across months", algo: "Dynamic programming \u2014 tradeoffs over time", icon: "wallet" },
      { label: "Organizing a move to a new apartment", algo: "Topological sort \u2014 what depends on what", icon: "truck" },
    ],
    theme: {
      bg: "from-rose-950 via-slate-900 to-slate-950",
      accent: "rose-400",
    },
  },
  {
    id: 5,
    title: "The Compound Effect",
    body: [
      "Every hard problem you push through makes the next one lighter.",
      "The discomfort you feel right now? That\u2019s the feeling of growth.",
      "Six months from now, you\u2019ll look back and wonder why this felt so hard.",
      "You\u2019re not behind. You\u2019re building.",
    ],
    theme: {
      bg: "from-violet-950 via-slate-900 to-slate-950",
      accent: "violet-400",
    },
  },
  {
    id: 6,
    title: "You Are Not Alone",
    body: [
      "Engineers at Google, Meta, Microsoft, and Apple all walked this same path.",
      "They were nervous too.",
    ],
    companyQuotes: [
      {
        company: "Google",
        text: "Be ready to think about scale. They\u2019ll ask \u201Cwhat happens with a million users?\u201D",
        color: "blue",
      },
      {
        company: "Meta",
        text: "\u201CInterviewing is hard, and so is being the interviewer. We want to hire the best people \u2014 you!\u201D \u2014 Carlos Bueno",
        color: "sky",
      },
      {
        company: "Microsoft",
        text: "They want to see how you think through problems, not that you have all the answers.",
        color: "green",
      },
      {
        company: "Apple",
        text: "They\u2019re looking for curiosity and craft \u2014 how you approach a problem matters more than the final answer.",
        color: "rose",
      },
    ],
    theme: {
      bg: "from-purple-950 via-slate-900 to-slate-950",
      accent: "purple-400",
    },
  },
  {
    id: 7,
    title: "What Completes This",
    body: [
      "This training builds your reasoning. But reasoning alone isn\u2019t enough.",
      "Only invest in what matches you in difficulty and value. Skip everything that feels like busywork.",
    ],
    completionPaths: [
      {
        title: "Build something real",
        description: "A project, a tool, an API. Applying is worth ten times more than reading.",
        icon: "hammer",
      },
      {
        title: "Read production code",
        description: "From engineers you admire. Real patterns beat textbook patterns.",
        icon: "code",
      },
      {
        title: "Teach one concept",
        description: "To a friend, a teammate, a rubber duck. If you can\u2019t explain it, you don\u2019t own it yet.",
        icon: "message",
      },
      {
        title: "Connect to architecture",
        description: "The other phases in this platform link algorithms to real system design decisions.",
        icon: "layers",
      },
    ],
    theme: {
      bg: "from-teal-950 via-slate-900 to-slate-950",
      accent: "teal-400",
    },
  },
  {
    id: 8,
    title: "Go When You\u2019re Ready",
    body: [
      "You are not just preparing for an interview.",
      "You are training a way of thinking that will serve you for the rest of your career.",
      "Come back here any time you need to remember that.",
    ],
    ctaLabel: "Begin Phase 5",
    ctaHref: "/phase-5",
    theme: {
      bg: "from-cyan-950 via-slate-900 to-slate-950",
      accent: "cyan-400",
    },
  },
]

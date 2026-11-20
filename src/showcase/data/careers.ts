import type { Automation } from "../types";

// Built for Glo Career Services (CV writing) and a Dubai executive search desk.
// Every name and figure in these demos is made up.

export const careers: Automation[] = [
  {
    n: 33,
    slug: "cv-pipeline",
    group: "careers",
    title: "AI CV pipeline: generate, audit, fix",
    line: "A CV written to a set method, checked against it, and fixed before a person signs it off.",
    problem:
      "AI-written CVs read like AI. Writing each one by hand to a high standard takes hours.",
    how: [
      "Generates the CV from the client's history and answers, to a written method.",
      "A second pass audits it against the method: facts, numbers, tone, banned phrases.",
      "A third pass fixes what the audit found, then a writer signs it off.",
    ],
    status: "Built",
    tools: ["Claude", "Supabase", "Edge functions"],
    flow: {
      inputLabel: "Client's notes",
      input: {
        kind: "doc",
        title: "Intake: Sarah Lane, site manager",
        lines: [
          "12 years in residential construction.",
          "Ran a 140-home phase, finished 3 weeks early.",
          "SMSTS, first aid, NEBOSH General.",
          "Wants: senior site manager or project manager.",
        ],
      },
      steps: [
        { label: "Writes the CV to the method" },
        { label: "Audits it against the method", detail: "2 problems found" },
        { label: "Fixes them" },
        { label: "Ready for the writer's sign-off" },
      ],
      outputLabel: "Audit and fix",
      output: {
        kind: "views",
        views: [
          {
            kind: "list",
            title: "Audit",
            items: [
              {
                title: '"Passionate, results-driven professional"',
                sub: "Banned phrase. Replaced with a fact.",
                tag: "Fixed",
                tone: "good",
              },
              {
                title: '"Delivered the phase early"',
                sub: "No number. Now: 140 homes, 3 weeks early.",
                tag: "Fixed",
                tone: "good",
              },
            ],
          },
          {
            kind: "doc",
            title: "Profile (after the fix)",
            lines: [
              "Site manager with 12 years in residential construction. Ran a 140-home phase to completion 3 weeks early. SMSTS and NEBOSH General.",
            ],
          },
        ],
      },
    },
  },
  {
    n: 34,
    slug: "gap-analysis",
    group: "careers",
    title: "Cover letters and gap analysis",
    line: "Questions sent to the client about what's missing; their answers built into the CV.",
    problem:
      "The best CV material is in the client's head. Without asking the right questions, it never makes the page.",
    how: [
      "Reads the CV against the target job and finds the gaps.",
      "Sends the client a short set of questions.",
      "Builds their answers into the CV and a matching cover letter.",
    ],
    status: "Built",
    tools: ["Claude", "Supabase", "Brevo"],
    flow: {
      inputLabel: "CV and target job",
      input: {
        kind: "kv",
        rows: [
          ["Target", "Project manager, housebuilder"],
          ["CV says", "Site manager, 12 years"],
        ],
      },
      steps: [
        { label: "Finds what the job asks for that the CV doesn't show" },
        { label: "Sends the questions" },
        { label: "Builds the answers in" },
      ],
      outputLabel: "Questions sent",
      output: {
        kind: "message",
        channel: "email",
        from: "Glo Career Services",
        to: "Sarah Lane",
        subject: "3 quick questions for your CV",
        body: "1. Have you managed a budget? Roughly how big?\n2. How many subcontractors did you run on the 140-home phase?\n3. Any client or NHBC awards?",
      },
    },
  },
  {
    n: 35,
    slug: "free-cv-review",
    group: "careers",
    title: "Free CV review that wins clients",
    line: "Upload a CV, get an honest review in minutes, with follow-ups by email and WhatsApp.",
    problem: "People won't pay for a CV until they believe theirs needs help.",
    how: [
      "The visitor uploads a CV and gets a scored review in minutes.",
      "The review is specific, so it reads like a person wrote it.",
      "Follow-ups go by email and WhatsApp over the next few days, then stop.",
    ],
    status: "Built",
    tools: ["AI review", "Supabase", "Brevo", "WhatsApp Cloud API"],
    flow: {
      inputLabel: "Uploaded",
      input: {
        kind: "kv",
        rows: [
          ["File", "CV_Mark_Doyle.pdf"],
          ["Target role", "Quantity surveyor"],
        ],
      },
      steps: [
        { label: "Reads the CV" },
        { label: "Scores it against the target role" },
        { label: "Writes the review" },
        { label: "Schedules the follow-ups" },
      ],
      outputLabel: "Review",
      output: {
        kind: "list",
        items: [
          { title: "Overall: 58 out of 100", tag: "Needs work", tone: "warn" },
          {
            title: "No figures on any project",
            sub: "Add contract values and savings you made.",
            tag: "Fix",
            tone: "bad",
          },
          {
            title: "Strong first line",
            sub: "Keep it.",
            tag: "Good",
            tone: "good",
          },
        ],
      },
    },
  },
  {
    n: 36,
    slug: "cv-formatter",
    group: "careers",
    title: "CV formatter for recruitment agencies",
    line: "Candidate CVs turned into the agency's branded format in seconds, on a subscription.",
    problem:
      "Consultants spend 20 minutes per CV stripping contact details and pasting it into the agency template.",
    how: [
      "Upload any CV. It's read, tidied and laid out in the agency's template.",
      "Contact details are removed so the client can't go direct.",
      "Shared by link, kept for a set time, then deleted. Billed monthly.",
    ],
    status: "Built",
    tools: ["Supabase", "Document rendering", "Stripe"],
    flow: {
      inputLabel: "Candidate's own CV",
      input: {
        kind: "doc",
        title: "jamie_hart_cv_FINAL2.docx",
        lines: [
          "Jamie Hart, 07700 900321, jamie@example.com, 14 Example Road",
          "Groundworker, 8 years...",
          "(three fonts, a photo, two pages)",
        ],
      },
      steps: [
        { label: "Reads the CV" },
        { label: "Removes contact details" },
        { label: "Lays it out in the agency template" },
        { label: "Makes a share link" },
      ],
      outputLabel: "Formatted",
      output: {
        kind: "doc",
        title: "Jamie Hart, Groundworker",
        meta: "Agency template",
        lines: [
          "Presented by Demo Recruitment Co",
          "# Summary",
          "Groundworker with 8 years on civils and housing sites. CSCS, CPCS 360 excavator.",
          "# Recent work",
          "- Flood defences, Shoreham: drainage and kerbing",
        ],
      },
    },
  },
  {
    n: 37,
    slug: "ats-check",
    group: "careers",
    title: "ATS check and tailoring",
    line: "How well a CV matches a job description, what's missing, and a tailored version.",
    problem:
      "Applicant tracking systems filter CVs on the words in the job advert. A good CV can be thrown out for the wrong words.",
    how: [
      "Reads the job description and pulls out what it asks for.",
      "Scores the CV against it and lists what's missing.",
      "Writes a tailored version, using only true facts from the CV.",
    ],
    status: "Built",
    tools: ["Claude", "Supabase"],
    custom: "ats-check",
  },
  {
    n: 38,
    slug: "checkout",
    group: "careers",
    title: "Pay first, delivered automatically",
    line: "Payment taken, account created, and the order started without anyone touching it.",
    problem:
      "Manual order handling means emails back and forth before work can even start.",
    how: [
      "The customer pays first.",
      "Their account is created and a sign-in link sent.",
      "The right work starts straight away for the package they bought.",
    ],
    status: "Built",
    tools: ["Stripe", "Supabase", "Edge functions"],
    flow: {
      inputLabel: "Checkout",
      input: {
        kind: "kv",
        rows: [
          ["Package", "CV and LinkedIn profile"],
          ["Paid", "By card"],
        ],
      },
      steps: [
        { label: "Payment confirmed" },
        { label: "Account created and sign-in link sent" },
        { label: "Intake questions sent" },
        { label: "Order on the writers' board" },
      ],
      outputLabel: "Order started",
      output: {
        kind: "list",
        items: [
          { title: "Payment", tag: "Confirmed", tone: "good" },
          {
            title: "Account",
            sub: "Sign-in link emailed",
            tag: "Created",
            tone: "good",
          },
          {
            title: "Writers' board",
            sub: "Due Friday",
            tag: "Queued",
            tone: "info",
          },
        ],
      },
    },
  },
  {
    n: 39,
    slug: "whatsapp-ai",
    group: "careers",
    title: "WhatsApp AI auto-reply with staff takeover",
    line: "Common questions answered on WhatsApp straight away, and a person can take over at any point.",
    problem:
      "Customers message at 10pm and expect an answer. Staff can't be on WhatsApp all evening.",
    how: [
      "Answers common questions from the business's own information.",
      "Hands over to a person for anything it shouldn't answer.",
      "Staff can take over a conversation at any point.",
    ],
    status: "Built",
    tools: ["WhatsApp Cloud API", "AI agent", "Supabase"],
    flow: {
      inputLabel: "Message at 22:14",
      input: {
        kind: "message",
        channel: "whatsapp",
        from: "Customer",
        to: "Glo Career Services",
        body: "Hi, how long does a CV take and can you do a cover letter too?",
      },
      steps: [
        { label: "Reads the question" },
        { label: "Answers from the business's own information" },
        { label: "Flags it for staff in the morning" },
      ],
      outputLabel: "Reply",
      output: {
        kind: "message",
        channel: "whatsapp",
        from: "Glo Career Services",
        to: "Customer",
        body: "Hi! A CV takes 3 working days, and yes, we can add a matching cover letter. Would you like me to send you the options?",
      },
    },
  },
  {
    n: 40,
    slug: "headhunting",
    group: "careers",
    title: "Headhunting engine for executive search",
    line: "Finds candidates, weighs how likely each is to move, ranks hiring managers, drafts outreach for approval.",
    problem:
      "Executive search for construction and fit-out in Dubai means trawling profiles one by one and writing every message by hand.",
    how: [
      "Searches public profiles for people matching the brief.",
      "AI analyses each one: fit, time in role, signs they might move.",
      "Researches the hiring managers at target firms and ranks them by authority.",
      "Drafts outreach for each. A consultant approves every message before it goes.",
    ],
    outcome: "2,784 AI candidate analyses run for the desk.",
    status: "Built",
    tools: ["Claude", "Apollo", "PhantomBuster", "Supabase"],
    flow: {
      inputLabel: "Brief",
      input: {
        kind: "kv",
        rows: [
          ["Role", "Fit-out project director"],
          ["Market", "Dubai"],
          ["Must have", "Hospitality fit-out, 10+ years"],
        ],
      },
      steps: [
        { label: "Searches public profiles" },
        { label: "Analyses each candidate" },
        { label: "Scores how likely each is to move" },
        { label: "Drafts outreach for approval" },
      ],
      outputLabel: "Ranked",
      output: {
        kind: "table",
        columns: ["Candidate (made up)", "Fit", "Likely to move", "Why"],
        rows: [
          ["R. Menon", 91, "High", "4 years in role, project just handed over"],
          ["A. Haddad", 86, "Medium", "Promoted last year"],
          ["J. Clarke", 79, "High", "Company lost two major bids"],
        ],
      },
    },
  },
  {
    n: 41,
    slug: "zoho-search",
    group: "careers",
    title: "Search candidates by meaning",
    line: "Find people in the ATS by what they've done, not just the exact words on their CV.",
    problem:
      'Keyword search misses the candidate who wrote "hotel interiors" when you searched "hospitality fit-out".',
    how: [
      "Keeps the ATS candidates in step with the search index.",
      "Searches by meaning, so similar experience is found.",
      "Explains why each result matched.",
    ],
    status: "Built",
    tools: ["Zoho Recruit API", "Embeddings", "Supabase"],
    flow: {
      inputLabel: "Search",
      input: {
        kind: "kv",
        rows: [["Looking for", "hospitality fit-out project manager"]],
      },
      steps: [
        { label: "Turns the search into meaning" },
        { label: "Finds the closest candidates" },
        { label: "Explains each match" },
      ],
      outputLabel: "Results",
      output: {
        kind: "list",
        items: [
          {
            title: "N. Farah (made up)",
            sub: '"Delivered 6 hotel interiors in Dubai Marina". No keyword match, same experience.',
            tag: "92%",
            tone: "good",
          },
          {
            title: "P. Walsh (made up)",
            sub: '"Restaurant and bar refurbishments, project lead"',
            tag: "84%",
            tone: "good",
          },
        ],
      },
    },
  },
  {
    n: 42,
    slug: "ingestion",
    group: "careers",
    title: "Jobs, hiring signals and salary data",
    line: "Construction jobs, company news and salary data gathered so the desk knows who's hiring.",
    problem:
      "Hiring signals are spread across job boards and news. By the time someone notices, the role is filled.",
    how: [
      "Collects new construction jobs and company news.",
      "Links them to companies the desk already knows.",
      "Keeps salary ranges by role and market.",
    ],
    status: "Built",
    tools: ["Apify", "Supabase"],
    flow: {
      inputLabel: "Overnight",
      input: {
        kind: "kv",
        rows: [["Sources", "Job boards, company news, salary surveys"]],
      },
      steps: [
        { label: "Collects new jobs and news" },
        { label: "Matches them to known companies" },
        { label: "Updates salary ranges" },
      ],
      outputLabel: "Signals",
      output: {
        kind: "list",
        items: [
          {
            title: "Made-up fit-out firm: 4 new site roles in a week",
            tag: "Hiring",
            tone: "good",
          },
          {
            title: "Made-up contractor: won a hotel tower",
            tag: "News",
            tone: "info",
          },
        ],
      },
    },
  },
  {
    n: 43,
    slug: "gmail-ai",
    group: "careers",
    title: "Inbox AI that drafts replies",
    line: "Reads the inbox, sorts what matters and drafts replies ready to send.",
    problem: "A busy inbox buries the three emails that matter today.",
    how: [
      "Reads new email as it arrives.",
      "Sorts it: client, candidate, supplier, noise.",
      "Drafts a reply in the user's voice for approval.",
    ],
    status: "Built",
    tools: ["Gmail API", "Claude", "Supabase"],
    flow: {
      inputLabel: "New email",
      input: {
        kind: "message",
        channel: "email",
        from: "Client",
        to: "Consultant",
        subject: "CVs for the PM role?",
        body: "Hi, any update on CVs for the project manager role? We'd like to interview next week.",
      },
      steps: [
        { label: "Reads it" },
        { label: "Sorts it as a client email, urgent" },
        { label: "Drafts a reply" },
      ],
      outputLabel: "Draft",
      output: {
        kind: "message",
        channel: "email",
        from: "Consultant (draft)",
        to: "Client",
        subject: "Re: CVs for the PM role?",
        body: "Hi, yes, I have two strong candidates and will send their CVs by 3pm today. Could you hold Tuesday or Wednesday afternoon for interviews?",
      },
    },
  },
  {
    n: 44,
    slug: "ad-tracking",
    group: "careers",
    title: "Ad tracking, lead forms and audiences",
    line: "Sales and leads reported to Meta and TikTok from the server; lead forms straight into the system.",
    problem:
      "Browser tracking misses a lot of sales now, so ads optimise blind.",
    how: [
      "Reports leads and sales from the server, with consent.",
      "Lead forms on Meta flow straight in.",
      "Exports audiences of past buyers to build lookalikes.",
    ],
    status: "Built",
    tools: ["Meta Conversions API", "TikTok Events API", "Supabase"],
    flow: {
      inputLabel: "Lead form",
      input: {
        kind: "kv",
        rows: [
          ["Form", "Free CV review"],
          ["Name", "Mark Doyle"],
          ["Consent", "Given"],
        ],
      },
      steps: [
        { label: "Lead received from Meta" },
        { label: "Added to the system" },
        { label: "Review invitation sent" },
      ],
      outputLabel: "Done",
      output: {
        kind: "list",
        items: [
          { title: "Lead saved", tag: "Done", tone: "good" },
          { title: "Invitation email sent", tag: "Sent", tone: "good" },
        ],
      },
    },
  },
  {
    n: 45,
    slug: "search-visibility",
    group: "careers",
    title: "Search visibility",
    line: "Sitemap, instant indexing and a steady feed of career articles.",
    problem: "New pages can take weeks to appear in search.",
    how: [
      "Keeps the sitemap current.",
      "Tells search engines the moment a page changes.",
      "Publishes career articles on a schedule.",
    ],
    status: "Built",
    tools: ["IndexNow", "RSS", "Supabase"],
    flow: {
      inputLabel: "New page",
      input: { kind: "kv", rows: [["Page", "CV writing for site managers"]] },
      steps: [
        { label: "Adds it to the sitemap" },
        { label: "Tells search engines it exists" },
        { label: "Adds it to the article feed" },
      ],
      outputLabel: "Done",
      output: {
        kind: "list",
        items: [
          { title: "Sitemap", tag: "Updated", tone: "good" },
          { title: "IndexNow", sub: "Accepted", tag: "Sent", tone: "good" },
          { title: "Article feed", tag: "Added", tone: "good" },
        ],
      },
    },
  },
];

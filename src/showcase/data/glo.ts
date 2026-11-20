import type { Automation } from "../types";

// Built for Glo Business Solutions and its clients: local trades, letting agents, clinics and recruiters.
// Every name and figure in these demos is made up.

export const gloSales: Automation[] = [
  {
    n: 22,
    slug: "front-desk",
    group: "sales",
    title: "Front Desk: one inbox, replies drafted, you approve",
    line: "Email, WhatsApp, accounts and missed calls in one queue, with a reply drafted for each.",
    problem:
      "A small business owner answers customers from four apps between jobs. Enquiries go cold, invoices go unchased, missed calls are never returned.",
    how: [
      "Brings email, WhatsApp, accounts and phone into one queue.",
      "Drafts a reply for each item. Nothing goes out until the owner approves it, unless they switch that item type to automatic.",
      "Every missed call gets a text back, so the caller knows they'll hear back.",
      "Staff holiday and sickness requests land in the same place, with the diary updated when approved.",
    ],
    status: "Built",
    tools: [
      "TanStack Start",
      "Supabase",
      "WhatsApp Cloud API",
      "Gmail API",
      "Xero",
    ],
    custom: "front-desk",
  },
  {
    n: 23,
    slug: "bd-autopilot",
    group: "sales",
    title: "Business development autopilot",
    line: "Finds local businesses, checks them, scores them and drafts outreach inside the rules.",
    problem:
      "Finding new clients means hours of searching, copying details into a sheet and writing the same email 50 times, and it's easy to break the marketing rules.",
    how: [
      "Harvests local businesses by trade and town, then checks each one against Companies House.",
      "Enriches each with a website, a named contact and signs of need, then scores and de-duplicates them.",
      "Drafts a short email for each in plain words, for approval.",
      "Sends within the PECR rules, quiet hours and daily caps, and handles bounces and replies.",
    ],
    status: "Built",
    tools: ["Companies House API", "Apollo", "Claude", "Supabase", "Gmail API"],
    flow: {
      inputLabel: "Search",
      input: {
        kind: "kv",
        rows: [
          ["Trade", "Plumbers and heating engineers"],
          ["Area", "Horsham and Crawley"],
          ["Size", "1 to 10 staff"],
        ],
      },
      steps: [
        { label: "Finds businesses in the area", detail: "38 found" },
        {
          label: "Checks each against Companies House",
          detail: "4 dissolved, left out",
        },
        { label: "Finds a website and a named contact" },
        {
          label: "Scores each on signs of need",
          detail: "No online booking, slow to reply",
        },
        { label: "Drafts an email for the top ones" },
      ],
      outputLabel: "Ready for approval",
      output: {
        kind: "views",
        views: [
          {
            kind: "table",
            columns: ["Business", "Town", "Score", "Why"],
            rows: [
              [
                "Larkfield Heating Ltd",
                "Horsham",
                82,
                "No online booking, missed-call voicemail full",
              ],
              [
                "Brookmere Plumb & Heat",
                "Crawley",
                74,
                "Website contact form broken",
              ],
              ["T. Wexley Plumbing", "Horsham", 61, "Sole trader, no website"],
            ],
          },
          {
            kind: "message",
            channel: "email",
            from: "Scott",
            to: "Larkfield Heating Ltd",
            subject: "Missed calls",
            body: "Hi Dan, I rang yesterday afternoon and your voicemail was full. If that happens with customers too, I set up a simple text-back so every missed caller hears from you within a minute. Worth a 10-minute chat?",
          },
        ],
      },
    },
  },
  {
    n: 24,
    slug: "domain-health",
    group: "sales",
    title: "Email domain health",
    line: "Checks the sending domain is set up properly before a single email goes out.",
    problem:
      "Send from a badly set up domain and every email lands in spam, or worse, the domain gets blocked.",
    how: [
      "Checks SPF, DKIM and DMARC on the sending domain.",
      "Watches bounce rates and pauses sending when they climb.",
      "Ramps up the daily volume slowly on a new domain.",
    ],
    status: "Built",
    tools: ["DNS lookups", "Supabase"],
    flow: {
      inputLabel: "Sending domain",
      input: {
        kind: "kv",
        rows: [
          ["Domain", "outreach.example"],
          ["Age", "9 days"],
        ],
      },
      steps: [
        { label: "Checks SPF" },
        { label: "Checks DKIM" },
        { label: "Checks DMARC" },
        { label: "Sets today's sending cap" },
      ],
      outputLabel: "Health",
      output: {
        kind: "list",
        items: [
          { title: "SPF", sub: "Passes", tag: "OK", tone: "good" },
          { title: "DKIM", sub: "Passes", tag: "OK", tone: "good" },
          {
            title: "DMARC",
            sub: "Set to none. Move to quarantine once reports look clean.",
            tag: "Improve",
            tone: "warn",
          },
          {
            title: "Today's cap",
            sub: "15 emails while the domain warms up",
            tag: "Ramping",
            tone: "info",
          },
        ],
      },
    },
  },
  {
    n: 25,
    slug: "linkedin-queue",
    group: "sales",
    title: "LinkedIn outreach queue",
    line: "Connection requests and messages worked through within daily caps, with accepts tracked.",
    problem:
      "LinkedIn outreach done in bursts gets accounts restricted, and nobody remembers who accepted and needs a follow-up.",
    how: [
      "Keeps a queue of people to connect with and why.",
      "Works through it inside daily and weekly caps.",
      "Tracks who accepted and lines up the follow-up message.",
    ],
    status: "Built",
    tools: ["Supabase", "Claude"],
    flow: {
      inputLabel: "Queue",
      input: {
        kind: "list",
        items: [
          {
            title: "Owner, construction recruitment agency, Kent",
            sub: "Posted about timesheet chasing",
          },
          {
            title: "MD, lettings agency, Brighton",
            sub: "Hiring a property administrator",
          },
          {
            title: "Director, aesthetics clinic, Hove",
            sub: "No online booking",
          },
        ],
      },
      steps: [
        {
          label: "Checks today's caps",
          detail: "12 of 20 connection requests left",
        },
        { label: "Writes a note for each" },
        { label: "Logs who accepted yesterday" },
      ],
      outputLabel: "Today",
      output: {
        kind: "table",
        columns: ["Person", "Action", "State"],
        rows: [
          ["Kent agency owner", "Connection request", "Sent"],
          [
            "Brighton lettings MD",
            "Follow-up message",
            "Accepted yesterday, message queued",
          ],
          ["Hove clinic director", "Connection request", "Sent"],
        ],
      },
    },
  },
  {
    n: 26,
    slug: "intent-finder",
    group: "sales",
    title: "Buying-intent finder",
    line: "Spots public posts from business owners asking for help, before anyone else replies.",
    problem:
      "Cold outreach rarely works. The people worth talking to are the ones who've just said publicly they have the problem.",
    how: [
      "Searches public posts for owners asking for help or recommendations.",
      "Reads each post and keeps only genuine need, not vendors or job seekers.",
      "Logs the firm as a warm prospect with the post and a suggested reply.",
    ],
    status: "Built",
    tools: ["Apify", "Claude", "Supabase"],
    flow: {
      inputLabel: "Posts found today",
      input: {
        kind: "list",
        items: [
          {
            title:
              '"Any recommendations for a CRM that actually works for temp desks?"',
            sub: "MD, staffing agency",
          },
          { title: '"We\'re hiring a Head of AI!"', sub: "Software vendor" },
          {
            title: '"Spent all Monday chasing timesheets again"',
            sub: "Owner, construction recruitment",
          },
        ],
      },
      steps: [
        { label: "Reads each post" },
        { label: "Drops vendors and job ads" },
        { label: "Logs the genuine ones" },
      ],
      outputLabel: "Warm prospects",
      output: {
        kind: "list",
        items: [
          {
            title: "Staffing agency MD: wants a CRM for temp desks",
            tag: "Intent",
            tone: "good",
          },
          {
            title: "Construction recruiter: chasing timesheets",
            tag: "Intent",
            tone: "good",
          },
          {
            title: "Software vendor hiring",
            sub: "Left out",
            tag: "Not a prospect",
            tone: "bad",
          },
        ],
      },
    },
  },
  {
    n: 27,
    slug: "site-intelligence",
    group: "sales",
    title: "Trades & Labour Intelligence",
    line: "Construction sites about to start, the firms on them and who to call, before the competition.",
    problem:
      "By the time a site is fenced, the labour is booked. The winners are the ones who knew the site was coming.",
    how: [
      "Joins planning applications, land ownership, Companies House, public contract awards and street works.",
      "Satellite images show when ground starts to move.",
      "Each site shows its stage, the main contractor, the firms likely to be pricing it and who to call.",
      "A tailored demo link for each prospect, worded for recruiters or for trades.",
    ],
    status: "Built",
    tools: [
      "Planning data",
      "HM Land Registry",
      "Companies House",
      "Contracts Finder",
      "Satellite imagery",
    ],
    flow: {
      inputLabel: "Search",
      input: {
        kind: "kv",
        rows: [
          ["Area", "Within 15 miles of Crawley"],
          ["Stage", "Approved or about to start"],
        ],
      },
      steps: [
        { label: "Finds approved planning in the area" },
        { label: "Adds the landowner and developer" },
        { label: "Checks satellite images for ground works" },
        { label: "Finds the contractor and who to call" },
      ],
      outputLabel: "Sites near you",
      output: {
        kind: "list",
        items: [
          {
            title: "48 homes, Pease Pottage (made up)",
            sub: "Approved in August. Ground cleared in the latest satellite image. Main contractor: Northgate Build.",
            tag: "About to start",
            tone: "good",
          },
          {
            title: "Logistics unit, Manor Royal (made up)",
            sub: "Tender awarded last week to Corvid M&E for the services.",
            tag: "Awarded",
            tone: "info",
          },
          {
            title: "School extension, Horley (made up)",
            sub: "Planning approved. No contractor named yet.",
            tag: "Approved",
            tone: "warn",
          },
        ],
      },
    },
  },
  {
    n: 28,
    slug: "tracked-links",
    group: "sales",
    title: "Tracked proposal and demo links",
    line: "Each prospect gets their own link; you get told who opened what, and for how long.",
    problem:
      "Send a proposal and you hear nothing. Did they read it? Which part? When is the right moment to call?",
    how: [
      "Every prospect gets their own private link.",
      "Records which sections they open and for how long.",
      "Sends a summary the same day, so the call lands while it's fresh.",
    ],
    status: "Built",
    tools: ["TanStack Start", "Supabase"],
    flow: {
      inputLabel: "Link sent",
      input: {
        kind: "kv",
        rows: [
          ["To", "Alex, MD of a made-up agency"],
          ["Page", "Proposal and demo"],
        ],
      },
      steps: [
        { label: "Prospect opens the link" },
        { label: "Records the sections they read" },
        { label: "Sends the summary" },
      ],
      outputLabel: "Summary",
      output: {
        kind: "message",
        channel: "email",
        from: "Platform",
        to: "Scott",
        subject: "Alex opened your proposal",
        body: "Opened at 19:42 on his phone, 11 minutes in total.\nLongest on: pricing (4 min), the timesheet demo (3 min).\nCame back at 08:10 and opened pricing again.",
      },
    },
  },
  {
    n: 29,
    slug: "portfolio-tracking",
    group: "sales",
    title: "Portfolio and film tracking",
    line: "Which pages and videos employers and clients actually watch.",
    problem:
      "A portfolio link goes out with every application. Without tracking there's no way to know if anyone looked.",
    how: [
      "Each application gets its own named link.",
      "Records pages viewed and how far into each film they watched.",
      "A report shows who looked at what.",
    ],
    status: "Built",
    tools: ["TanStack Start", "Supabase"],
    flow: {
      inputLabel: "Named link",
      input: {
        kind: "kv",
        rows: [
          ["For", "Hiring manager, made-up agency"],
          ["Sent", "Monday 09:10"],
        ],
      },
      steps: [
        { label: "Visitor opens the portfolio" },
        { label: "Records each page and film" },
        { label: "Adds it to the report" },
      ],
      outputLabel: "Report",
      output: {
        kind: "table",
        columns: ["Page", "Time", "Film watched"],
        rows: [
          ["Recruitment automation", "2 min 40 s", "92%"],
          ["Payroll and invoicing", "1 min 55 s", "60%"],
          ["CV download", "Opened", "–"],
        ],
      },
    },
  },
  {
    n: 30,
    slug: "demand-research",
    group: "sales",
    title: "Product demand research",
    line: "Marketplace, social and supplier data scored to choose a product to sell.",
    problem:
      "Picking a product on a hunch is how money gets lost. The evidence is out there but scattered.",
    how: [
      "Pulls sales signals from marketplaces and social ad libraries.",
      "Checks UK supplier stock and landed cost.",
      "Scores each product on demand, competition and margin.",
    ],
    status: "Built",
    tools: ["Marketplace data", "Supplier APIs", "Supabase"],
    flow: {
      inputLabel: "Category",
      input: {
        kind: "kv",
        rows: [
          ["Category", "Garden tools"],
          ["Test order", "Small, to prove demand"],
        ],
      },
      steps: [
        { label: "Gathers demand signals" },
        { label: "Checks supplier stock and cost" },
        { label: "Scores each product" },
      ],
      outputLabel: "Shortlist",
      output: {
        kind: "table",
        columns: ["Product", "Demand", "Sellers", "Margin", "Score"],
        rows: [
          ["Telescopic hedge shears", "High", "Few", "38%", 81],
          ["Kneeler and seat", "Medium", "Many", "29%", 54],
          ["Soil sieve set", "Rising", "Few", "44%", 77],
        ],
        good: [0],
      },
    },
  },
  {
    n: 31,
    slug: "dropshipping",
    group: "sales",
    title: "Dropshipping system",
    line: "Supplier stock, marketplace listings, price checks and order tracking, with a daily digest.",
    problem:
      "Selling through marketplaces means watching stock, prices and orders all day.",
    how: [
      "Keeps listings in step with the supplier's stock.",
      "Checks competitors' prices and flags when the margin slips.",
      "Tracks every order from sale to delivery, with a digest each morning.",
    ],
    status: "Built",
    tools: ["Supplier APIs", "eBay API", "Supabase"],
    flow: {
      inputLabel: "Overnight",
      input: {
        kind: "kv",
        rows: [
          ["Listings", "24"],
          ["Orders", "7"],
        ],
      },
      steps: [
        { label: "Checks supplier stock" },
        { label: "Checks competitor prices" },
        { label: "Updates order tracking" },
        { label: "Writes the digest" },
      ],
      outputLabel: "Morning digest",
      output: {
        kind: "list",
        items: [
          { title: "7 orders, £214.30 sales", tag: "Sales", tone: "good" },
          {
            title: "Soil sieve set: supplier stock down to 3",
            sub: "Listing paused at 2",
            tag: "Stock",
            tone: "warn",
          },
          {
            title: "Hedge shears undercut by £1.20",
            sub: "Margin still 34% if matched",
            tag: "Price",
            tone: "info",
          },
        ],
      },
    },
  },
  {
    n: 32,
    slug: "connections",
    group: "sales",
    title: "WhatsApp, Gmail and ad conversion connections",
    line: "Messages sent and received through WhatsApp and Gmail, and sales reported back to Meta.",
    problem:
      "Ads are judged on what the ad platform can see. Without the sale reported back, it optimises for the wrong people.",
    how: [
      "Sends and receives WhatsApp messages through the official Cloud API.",
      "Reads and sends email through Gmail.",
      "Reports enquiries and sales back to Meta from the server, with consent respected.",
    ],
    status: "Built",
    tools: ["WhatsApp Cloud API", "Gmail API", "Meta Conversions API"],
    flow: {
      inputLabel: "A customer pays",
      input: {
        kind: "kv",
        rows: [
          ["Product", "CV rewrite"],
          ["Paid", "By card"],
          ["Came from", "Meta ad, consent given"],
        ],
      },
      steps: [
        { label: "Payment confirmed" },
        { label: "Sale reported to Meta from the server" },
        { label: "Confirmation sent on WhatsApp" },
      ],
      outputLabel: "Done",
      output: {
        kind: "list",
        items: [
          {
            title: "Meta",
            sub: "Purchase, matched to the ad",
            tag: "Reported",
            tone: "good",
          },
          {
            title: "WhatsApp",
            sub: '"Thanks Sarah, we\'ve got your order and your writer will be in touch today."',
            tag: "Sent",
            tone: "good",
          },
        ],
      },
    },
  },
];

import type { Automation } from "../types";

// Built for Avolon Group, a construction recruitment agency, alongside its Bullhorn CRM.
// Every name, client, site and figure in these demos is made up.

export const avolonFinance: Automation[] = [
  {
    n: 1,
    slug: "timesheet-inbox",
    group: "finance",
    title: "Timesheet inbox that reads itself",
    line: "Emailed timesheets read by AI within minutes, filed to the right client, PO and week.",
    problem:
      "Every Monday, dozens of timesheets arrive by email as PDFs and phone photos, often several sheets in one file. Someone keys each one in by hand before payroll can start.",
    how: [
      "Checks the timesheet mailbox every minute and takes every attachment.",
      "AI reads each page: the client, site, PO, week ending, every man's name and his hours for each day.",
      "Works out which client and PO the sheet belongs to from the sheet itself first, then the file name, and refuses to guess when the two disagree.",
      "Matches each name to the right worker, strictly, so nobody is paid for someone else's hours.",
    ],
    status: "Live",
    tools: ["Supabase", "Edge functions", "AI vision", "Postgres"],
    seeAlso: [
      { label: "Timesheets in the back office", to: "/crm/timesheets" },
    ],
    flow: {
      inputLabel: "Arrives by email",
      input: {
        kind: "views",
        views: [
          {
            kind: "message",
            channel: "email",
            from: "site.office@wealdcivils.example",
            to: "timesheets@agency",
            subject: "Weald Civils, PO 4471 w.e. 18.10.26",
            body: "Please find attached this week's sheet for Shoreham.\n\n1 attachment: Shoreham_WE18.pdf",
          },
          {
            kind: "timesheet",
            client: "Weald Civils",
            site: "Shoreham Harbour",
            weekEnding: "18/10/26",
            po: "4471",
            signedBy: "P. Oduya",
            rows: [
              {
                name: "Jamie Hart",
                days: ["9", "9", "9", "9", "8", "", ""],
                total: "44",
              },
              {
                name: "T. Nowak",
                days: ["9", "9", "9", "9", "8", "", ""],
                total: "44",
              },
              {
                name: "Ryan Cole",
                days: ["9", "9", "-", "9", "8", "", ""],
                total: "35",
              },
            ],
          },
        ],
      },
      steps: [
        {
          label: "Picks up the email and its PDF from the mailbox",
          detail: "Read 52 seconds after it arrived",
        },
        { label: "AI reads the sheet: header, names and every day's hours" },
        {
          label:
            "Finds the client and PO from the sheet, checks the file name agrees",
          detail: "Weald Civils, PO 4471, both agree",
        },
        { label: "Settles the week ending", detail: "Sunday 18 October 2026" },
        {
          label: "Matches each name to a worker",
          detail: '"T. Nowak" is Tomasz Nowak, the only Nowak on this PO',
        },
        { label: "Files the sheet for checking" },
      ],
      outputLabel: "Filed, ready to check",
      output: {
        kind: "views",
        views: [
          {
            kind: "kv",
            rows: [
              ["Client", "Weald Civils"],
              ["Site", "Shoreham Harbour flood defences"],
              ["PO", "4471"],
              ["Week ending", "18 Oct 2026"],
            ],
          },
          {
            kind: "table",
            columns: ["Worker", "Mon", "Tue", "Wed", "Thu", "Fri", "Total"],
            rows: [
              ["Jamie Hart", 9, 9, 9, 9, 8, 44],
              ["Tomasz Nowak", 9, 9, 9, 9, 8, 44],
              ["Ryan Cole", 9, 9, "–", 9, 8, 35],
            ],
          },
        ],
      },
    },
  },
  {
    n: 2,
    slug: "timesheet-checks",
    group: "finance",
    title: "Timesheet checks before anyone is paid",
    line: "Totals, unreadable writing, duplicates and the wrong week caught before approval.",
    problem:
      "A wrong figure on a sheet becomes a wrong payslip and a wrong invoice. Checking by eye misses things on a busy Monday.",
    how: [
      "Compares each man's days with the total printed on the sheet, and stops the sheet when they disagree.",
      "Quotes any writing it could not read as a number instead of treating it as zero.",
      "Spots the same man on two sheets for the same days, and a week that does not match the file name.",
      "Only a named person can clear a check, and only while the figures stay as they were when they cleared it.",
    ],
    status: "Live",
    tools: ["Postgres", "SQL checks", "React"],
    seeAlso: [{ label: "Sheets waiting for review", to: "/crm/timesheets" }],
    flow: {
      inputLabel: "Sheets read this morning",
      input: {
        kind: "table",
        columns: ["Sheet", "Client", "Lines", "Printed total"],
        rows: [
          ["Shoreham, PO 4471", "Weald Civils", 3, "123 h"],
          ["Kemptown hotel", "Seafront Interiors", 5, "212 h"],
          ["Gatwick hub", "Corvid M&E", 4, "160 h"],
          ["Lancing plot 4", "Downsline", 2, "90 h"],
        ],
      },
      steps: [
        {
          label: "Adds up every man's days and compares with the printed total",
        },
        { label: "Looks for writing that is not a number" },
        { label: "Looks for the same man and days on another approved sheet" },
        { label: "Checks the week against the file name" },
        {
          label: "Clears the sheets with nothing wrong for one-click approval",
        },
      ],
      outputLabel: "What needs a person",
      output: {
        kind: "list",
        items: [
          {
            title: "Shoreham, PO 4471",
            sub: "Lines add up to 123 hours, as printed. Ryan Cole's Wednesday is a dash, read as no hours.",
            tag: "Ready",
            tone: "good",
          },
          {
            title: "Kemptown hotel",
            sub: "Lines add up to 203 hours, the sheet says 212. Approval is stopped until the lines or the total are put right.",
            tag: "Totals differ",
            tone: "bad",
          },
          {
            title: "Gatwick hub",
            sub: "Marek Zielinski is also on Corvid's other sheet for Tuesday and Wednesday.",
            tag: "Possible duplicate",
            tone: "warn",
          },
          {
            title: "Lancing plot 4",
            sub: 'Friday reads "8 H?". Quoted for a person to type the figure.',
            tag: "Unreadable",
            tone: "warn",
          },
        ],
      },
    },
  },
  {
    n: 3,
    slug: "mini-plan",
    group: "finance",
    title: "Weekly plan upload and chase board",
    line: "One spreadsheet sets the week's rates and who should send a sheet; missing sheets get chased.",
    problem:
      "The office keeps the week's plan in a spreadsheet: who is on which job at what rate. Payroll needs it, and nobody knows which sheets are still missing until Tuesday.",
    how: [
      "Upload the week's plan as it is. It reads the columns whatever order they are in.",
      "Each man's rate for the week comes from the plan, never from an old rate on file, because rates and sites change often.",
      "Sheets are ticked off the plan as they arrive. The rest show on a chase board.",
      "Taking a man off the plan stops the chasing. It can never change what he is paid.",
    ],
    status: "Live",
    tools: ["SheetJS", "Postgres", "React"],
    seeAlso: [{ label: "Chase board", to: "/crm/chase" }],
    flow: {
      inputLabel: "The week's plan (spreadsheet)",
      input: {
        kind: "table",
        columns: ["Name", "Client", "PO", "Rate type", "Pay", "Charge"],
        rows: [
          ["Jamie Hart", "Weald Civils", "4471", "Hourly", "£19.50", "£25.40"],
          [
            "Tomasz Nowak",
            "Weald Civils",
            "4471",
            "Hourly",
            "£19.50",
            "£25.40",
          ],
          [
            "Kieran Shaw",
            "Seafront Interiors",
            "SI-208",
            "Day",
            "£190",
            "£245",
          ],
          ["Liam Ford", "Corvid M&E", "CM-77", "Hourly", "£23.00", "£29.90"],
          ["Connor Webb", "Downsline", "DL-12", "Day", "£200", "£262"],
        ],
      },
      steps: [
        {
          label: "Reads the headings, whatever their order",
          detail: '"Rate Type" read as the rate column',
        },
        {
          label: "Finds each man, client, site and PO",
          detail: '"Billinghurst" matched to the Billingshurst site',
        },
        { label: "Writes the week's rates from the plan" },
        { label: "Ticks off the sheets that have arrived" },
        { label: "Builds the chase list" },
      ],
      outputLabel: "Chase board",
      output: {
        kind: "list",
        items: [
          {
            title: "Weald Civils, PO 4471",
            sub: "2 men. Sheet in at 08:14.",
            tag: "In",
            tone: "good",
          },
          {
            title: "Seafront Interiors, SI-208",
            sub: "Kieran Shaw. No sheet yet.",
            tag: "Chase",
            tone: "warn",
          },
          {
            title: "Corvid M&E, CM-77",
            sub: "Liam Ford. Sheet in at 09:02.",
            tag: "In",
            tone: "good",
          },
          {
            title: "Downsline, DL-12",
            sub: "Connor Webb. No sheet yet. Marked as chased at 10:15.",
            tag: "Chased",
            tone: "info",
          },
        ],
      },
    },
  },
  {
    n: 4,
    slug: "payroll-engine",
    group: "finance",
    title: "Payroll engine",
    line: "One rule book prices every line: day rates, hourly, shifts, and days plus hours. Anything it can't price is held.",
    problem:
      'Construction pay is messy: day rates, hourly rates, shifts, half days, a man on two jobs, a sheet that says "3 shifts and 14 hours". Get it wrong and someone is short, or a client is overcharged.',
    how: [
      "One resolver decides what every line is worth. Payroll, pricing and the checks all ask it, so the answers never drift apart.",
      "Day-rate men are paid by the day, at most one a day across all their sheets, with half days where the hours say so.",
      "With both a day rate and an hourly rate, a full day is a day and the hours over it go by the hour, exactly as the agency's own invoices show.",
      "Anything without a figure to bill (no rate, no PO, the same man twice) is held with the reason. Nothing is waved through.",
    ],
    status: "Live",
    tools: ["Postgres", "TypeScript", "Unit tests"],
    custom: "days-and-hours",
    seeAlso: [{ label: "Payroll run in the back office", to: "/crm/payroll" }],
  },
  {
    n: 5,
    slug: "umbrella-file",
    group: "finance",
    title: "Umbrella company batch file",
    line: "The weekly pay file built in the umbrella company's own layout, straight from the run.",
    problem:
      "Each week the pay has to go to the umbrella company in their exact file layout. Typed up by hand, it is slow and one wrong cell holds up a man's wages.",
    how: [
      "Builds the file from the locked payroll run, row for row.",
      "Uses the umbrella company's own columns and nothing else, so no client or charge rate ever goes to them.",
      "Works out VAT and gross per row and a grand total, then checks the file's total against the run.",
      "Sending sits behind an off switch until the owner turns it on.",
    ],
    status: "Built",
    tools: ["Postgres", "SheetJS"],
    flow: {
      inputLabel: "Locked payroll run, w/e 18 Oct",
      input: {
        kind: "kv",
        rows: [
          ["Men paid", "42"],
          ["Hours", "1,486"],
          ["Pay", "£31,740.25"],
          ["Status", "Locked by Sam, 14:02"],
        ],
      },
      steps: [
        { label: "Takes every pay line above £0 from the run" },
        { label: "Lays it out in the umbrella company's columns" },
        { label: "Adds VAT and gross per row, then a grand total" },
        {
          label: "Checks the file's net equals the run's pay",
          detail: "£31,740.25 both sides",
        },
      ],
      outputLabel: "Batch file preview",
      output: {
        kind: "table",
        title: "UMB_WE181026.xlsx",
        columns: [
          "Worker ref",
          "Name",
          "Units",
          "Pay",
          "Rate type",
          "Net",
          "VAT",
          "Gross",
        ],
        rows: [
          [
            "UM-10442",
            "Jamie Hart",
            44,
            "£19.50",
            "Hourly",
            "£858.00",
            "£171.60",
            "£1,029.60",
          ],
          [
            "UM-10443",
            "Tomasz Nowak",
            44,
            "£19.50",
            "Hourly",
            "£858.00",
            "£171.60",
            "£1,029.60",
          ],
          [
            "UM-10518",
            "Kieran Shaw",
            5,
            "£190.00",
            "Day",
            "£950.00",
            "£190.00",
            "£1,140.00",
          ],
          [
            "",
            "Grand total",
            "",
            "",
            "",
            "£31,740.25",
            "£6,348.05",
            "£38,088.30",
          ],
        ],
      },
    },
  },
  {
    n: 6,
    slug: "invoices",
    group: "finance",
    title: "Invoices with the signed timesheets attached",
    line: "One invoice per client, PO and week, with the signed sheets from page 2. Void and credit note built in.",
    problem:
      "Clients query invoices they can't match to a sheet. Late sheets get lumped onto the wrong week. Fixing a sent invoice by hand breaks the numbering.",
    how: [
      "Makes one invoice for each client, PO and week, so a late sheet is billed on its own week.",
      "The PDF carries the signed timesheets from page 2, so the client has the proof in the same file.",
      "VAT is shared across the lines a penny at a time, so the columns always add up to the total.",
      "A sent invoice is only ever reduced by a numbered credit note. Approved but unsent ones are voided, keeping the number.",
    ],
    status: "Live",
    tools: ["Postgres", "PDF generation", "Edge functions"],
    seeAlso: [{ label: "Invoices in the back office", to: "/crm/invoices" }],
    flow: {
      inputLabel: "Approved payroll lines",
      input: {
        kind: "table",
        columns: ["Client", "PO", "Week", "Lines", "Charge"],
        rows: [
          ["Weald Civils", "4471", "18 Oct", 3, "£3,124.20"],
          ["Weald Civils", "4471", "11 Oct", 1, "£889.00"],
          ["Seafront Interiors", "SI-208", "18 Oct", 5, "£6,125.00"],
        ],
      },
      steps: [
        {
          label: "Groups the lines by client, PO and week",
          detail: "The late 11 Oct sheet gets an invoice of its own",
        },
        {
          label: "Due date from each client's payment terms",
          detail: "Weald Civils: 30 days after month end",
        },
        { label: "Shares the VAT across the lines a penny at a time" },
        { label: "Draws the PDF and adds the signed sheets from page 2" },
        { label: "Runs the invoice checks before it can be approved" },
      ],
      outputLabel: "Invoice INV-001284",
      output: {
        kind: "doc",
        title: "INV-001284, Weald Civils",
        meta: "3 pages",
        lines: [
          "# Page 1: invoice",
          "PO 4471, Shoreham Harbour flood defences. Week ending 18 October 2026.",
          "- Jamie Hart, 44 hours at £25.40: £1,117.60",
          "- Tomasz Nowak, 44 hours at £25.40: £1,117.60",
          "- Ryan Cole, 35 hours at £25.40: £889.00",
          "Net £3,124.20, VAT £624.84, total £3,749.04. Due 30 November 2026.",
          "# Pages 2 to 3: the signed timesheets",
          "Shoreham_WE18.pdf, signed by P. Oduya.",
        ],
      },
    },
  },
  {
    n: 7,
    slug: "run-checks",
    group: "finance",
    title: "Checks on every run before money moves",
    line: "15 invoice checks and 9 payroll checks. A problem stops only the item at fault.",
    problem:
      "One bad figure can sit unnoticed in a run of 60 invoices. Stopping the whole run for one fault holds up everyone else.",
    how: [
      "Each invoice is checked line by line against its payroll line, its subtotal, VAT, number and dates.",
      "Each pay file is checked against the run: rows, net, and every man's pay rate.",
      "A problem is written in plain words and stops only the invoice or file it is about.",
      "Every check was broken on purpose in testing to prove it fires.",
    ],
    status: "Live",
    tools: ["Postgres", "SQL tests"],
    flow: {
      inputLabel: "Run 42, ready to approve",
      input: {
        kind: "kv",
        rows: [
          ["Invoices", "54"],
          ["Pay files", "2"],
          ["Charge", "£128,412.60"],
          ["Pay", "£104,980.15"],
        ],
      },
      steps: [
        { label: "Checks each invoice line against its payroll line" },
        { label: "Checks each invoice's subtotal, VAT, number and dates" },
        { label: "Checks every charged hour is on exactly one invoice" },
        { label: "Checks each pay file's rows and net against the run" },
      ],
      outputLabel: "Problems found",
      output: {
        kind: "list",
        items: [
          {
            title: "INV-001291, Corvid M&E",
            sub: "Line 3 charges 40 hours; its payroll line says 38. This invoice cannot be approved until it is regenerated.",
            tag: "Stopped",
            tone: "bad",
          },
          {
            title: "53 other invoices",
            sub: "No problems. Approve all goes ahead without INV-001291.",
            tag: "Clear",
            tone: "good",
          },
          {
            title: "Pay files",
            sub: "Both match the run to the penny.",
            tag: "Clear",
            tone: "good",
          },
        ],
      },
    },
  },
  {
    n: 8,
    slug: "ledger",
    group: "finance",
    title: "Sales ledger, statements, credit control and charts",
    line: "Who owes what and how old it is, client statements as PDF, and the clients closest to their limit.",
    problem:
      "Chasing money means knowing who owes what, how late it is and who is near their credit limit. Spreadsheets go stale the day they're made.",
    how: [
      "The ledger ages every open invoice by its date: 0-30, 31-60, 61-90, 91-120 and over 120 days.",
      "A statement for any client, on screen or as a PDF, with every invoice, credit note and payment.",
      "The credit control page ranks clients by the share of their credit limit they're using.",
      "Charts of turnover, days to collect, earnings by week and men working.",
    ],
    status: "Live",
    tools: ["Postgres", "React", "PDF"],
    flow: {
      inputLabel: "Open invoices today",
      input: {
        kind: "kv",
        rows: [
          ["Open invoices", "27"],
          ["Clients", "8"],
          ["Outstanding", "£212,480.10"],
        ],
      },
      steps: [
        { label: "Ages each invoice by the days since its date" },
        { label: "Adds up each client's balance in each age" },
        { label: "Ranks clients by how much of their limit they use" },
      ],
      outputLabel: "Credit control",
      output: {
        kind: "views",
        views: [
          {
            kind: "bars",
            title: "Outstanding by age",
            unit: "£",
            bars: [
              { label: "0-30 days", value: 148210 },
              { label: "31-60 days", value: 51340, tone: "warn" },
              { label: "61-90 days", value: 9870, tone: "warn" },
              { label: "Over 90 days", value: 3060, tone: "bad" },
            ],
          },
          {
            kind: "table",
            title: "Closest to their limit",
            columns: ["Client", "Limit", "Owed", "Used"],
            rows: [
              ["Corvid M&E", "£60,000", "£48,120", "80%"],
              ["Weald Civils", "£75,000", "£41,880", "56%"],
              ["Northgate Build", "£40,000", "£17,200", "43%"],
            ],
            flag: [0],
          },
        ],
      },
    },
  },
  {
    n: 9,
    slug: "old-invoices",
    group: "finance",
    title: "Old invoicing history, side by side",
    line: "Years of invoices from the previous system kept apart, and set beside the new figures week by week.",
    problem:
      "Moving off an old invoicing system is a leap of faith unless you can prove the new one gives the same answers.",
    how: [
      "Loads every invoice and credit note from the old system's exports, kept apart as evidence and never used for pay.",
      "Keeps the old system's own PDFs for the test weeks, opened beside the new figures.",
      "Pairs each new sheet with the old invoice nearest to it and says in words what differs.",
    ],
    status: "Live",
    tools: ["Postgres", "CSV import", "Storage"],
    flow: {
      inputLabel: "Week ending 18 Oct",
      input: {
        kind: "kv",
        rows: [
          ["Old system's invoices", "54"],
          ["New platform's sheets", "54"],
        ],
      },
      steps: [
        { label: "Pairs each sheet with the nearest old invoice" },
        { label: "Compares units, rates and money" },
        { label: "Writes up what differs" },
      ],
      outputLabel: "Side by side",
      output: {
        kind: "list",
        items: [
          {
            title: "54 the same",
            sub: "Units, rates and totals agree to the penny.",
            tag: "Same",
            tone: "good",
          },
          {
            title: "2 a penny apart",
            sub: "Rounding: the same units and rates.",
            tag: "Rounding",
            tone: "info",
          },
          {
            title: "1 differs",
            sub: "Northgate Build: the old invoice charged 41.5 hours, the sheet says 40.5. The office confirmed the extra hour was agreed.",
            tag: "Differs",
            tone: "warn",
          },
        ],
      },
    },
  },
  {
    n: 10,
    slug: "clients",
    group: "finance",
    title: "Clients: terms, credit and clean records",
    line: "Payment terms that set due dates, credit limits, and duplicate clients merged safely.",
    problem:
      "The same client entered three ways, terms kept in someone's head, due dates worked out by hand.",
    how: [
      "Dated payment terms per client, so an invoice's due date is worked out the way the old system did it.",
      "Credit limits with a reason and an approver for every change.",
      "Duplicate clients merged into one, with everything they held carried across and the history kept.",
    ],
    outcome: "Duplicate client records merged from 62 to 38.",
    status: "Live",
    tools: ["Postgres", "React"],
    flow: {
      inputLabel: "Client list",
      input: {
        kind: "table",
        columns: ["Name", "Invoices"],
        rows: [
          ["Weald Civils", 212],
          ["Weald Civils Ltd", 14],
          ["WEALD CIVIL ENG", 3],
          ["Seafront Interiors", 96],
        ],
      },
      steps: [
        { label: "Finds names that are the same company" },
        { label: "Shows each pair for a person to confirm" },
        { label: "Merges, carrying terms, invoices and sites across" },
      ],
      outputLabel: "After the merge",
      output: {
        kind: "table",
        columns: ["Name", "Invoices", "Terms"],
        rows: [
          ["Weald Civils", 229, "30 days after month end"],
          ["Seafront Interiors", 96, "14 days"],
        ],
        good: [0],
      },
    },
  },
  {
    n: 11,
    slug: "weekly-check",
    group: "finance",
    title: "Weekly check against the owner's own figures",
    line: "Each man's hours from the platform set beside the owner's spreadsheet, every week of the test run.",
    problem:
      "Before trusting a new payroll, the owner wants to see it agree with the figures he already keeps.",
    how: [
      "Takes his figures from the week's plan, kept as evidence only.",
      "Sets each man's hours from the platform beside them, per client.",
      "Says why where they differ: a sheet still to arrive, a line held, a different rate.",
    ],
    status: "Live",
    tools: ["Postgres", "React"],
    flow: {
      inputLabel: "The owner's figures, w/e 18 Oct",
      input: {
        kind: "table",
        columns: ["Name", "Client", "Units"],
        rows: [
          ["Jamie Hart", "Weald Civils", 44],
          ["Kieran Shaw", "Seafront Interiors", 5],
          ["Liam Ford", "Corvid M&E", 40],
        ],
      },
      steps: [
        { label: "Prices the week's sheets the way the next run would" },
        { label: "Sets each man beside the owner's units" },
        { label: "Explains each difference" },
      ],
      outputLabel: "The check",
      output: {
        kind: "table",
        columns: ["Name", "Owner", "Platform", "Why"],
        rows: [
          ["Jamie Hart", 44, 44, "Same"],
          ["Kieran Shaw", 5, "–", "Sheet not in yet"],
          ["Liam Ford", 40, 38, "Sheet shows 38: Friday is 6, not 8"],
        ],
        flag: [2],
        good: [0],
      },
    },
  },
];

export const avolonCandidates: Automation[] = [
  {
    n: 12,
    slug: "registrations",
    group: "candidates",
    title: "Website registrations straight into Bullhorn",
    line: "Sign-ups pushed into the CRM every hour with their documents and consents attached.",
    problem:
      "Every website registration was retyped into Bullhorn and its card photos saved by hand.",
    how: [
      "The registration form will not submit without the front and back of a card.",
      "Every hour, new registrations go into Bullhorn with documents, consents and a note.",
      "A failed push is kept and retried, never lost.",
      "A new registration also triggers the prospect alerts.",
    ],
    outcome:
      "The owner estimates around 90% less staff time on registrations (his estimate).",
    status: "Live",
    tools: ["Bullhorn REST API", "Edge functions", "Storage"],
    seeAlso: [{ label: "Try the registration form", to: "/register" }],
    flow: {
      inputLabel: "Registration from the website",
      input: {
        kind: "kv",
        rows: [
          ["Name", "Daniel Price"],
          ["Trade", "Groundworker"],
          ["Postcode", "BN43 6PL"],
          ["Card", "CSCS Labourer, front and back uploaded"],
          ["Right to work", "Passport uploaded"],
          ["Consents", "Email yes, text yes"],
        ],
      },
      steps: [
        { label: "Checks the card photos are both there" },
        { label: "Creates the candidate in Bullhorn" },
        { label: "Attaches the card and ID files" },
        { label: "Adds the consents and a registration note" },
        { label: "Tells the prospect alerts a new man is available" },
      ],
      outputLabel: "In Bullhorn",
      output: {
        kind: "kv",
        title: "Candidate #88214",
        rows: [
          ["Status", "Pre-Registered"],
          ["Files", "CSCS front, CSCS back, passport"],
          ["Note", "Registered on the website 09:14, wants work near Shoreham"],
          ["Pushed", "09:15, first attempt"],
        ],
      },
    },
  },
  {
    n: 13,
    slug: "shortlists",
    group: "candidates",
    title: "A ranked shortlist for every new vacancy",
    line: "Within the half hour of a job going on Bullhorn, a ranked shortlist lands in the inbox.",
    problem:
      "When a contractor rings for six groundworkers by Monday, consultants scroll the database from memory and call the same few people.",
    how: [
      "Pulls new vacancies from Bullhorn every half hour.",
      "Scores every available candidate on distance, past hours with the agency, recent work, documents, recent contact and availability, with weights the office can change.",
      "Anyone beyond 35 miles is cut before ranking, and expired cards can be set to block.",
      "Emails the top 40 with phone numbers, ready to call.",
    ],
    status: "Live",
    tools: ["Bullhorn REST API", "Postgres", "Brevo", "Geocoding"],
    custom: "shortlist-weights",
    seeAlso: [
      { label: "Shortlists in the back office", to: "/crm/shortlists" },
    ],
  },
  {
    n: 14,
    slug: "availability",
    group: "candidates",
    title: "Database cleaning: are you free for work?",
    line: "Dormant candidates get a one-tap availability link, and the answer goes back into Bullhorn.",
    problem:
      "Most of a recruitment database is out of date. Nobody has time to ring 2,000 people to ask if they're free.",
    how: [
      "Each night, finds candidates not contacted in 6 to 12 months.",
      "Each morning, sends them a short email with a single-use link, spread through the working day.",
      "One tap says available now, from a date, or not looking. The answer is written back to Bullhorn.",
      "Unsubscribes, STOP replies and cooldowns are respected automatically.",
    ],
    outcome:
      "1,478 candidates contacted and 115 Bullhorn records updated in 7 weeks, with no consultant time.",
    status: "Live",
    tools: ["Bullhorn REST API", "Brevo", "Postgres", "pg_cron"],
    seeAlso: [
      { label: "See the text a candidate gets", to: "/m/text" },
      { label: "See the email", to: "/m/email" },
      { label: "Availability in the back office", to: "/crm/availability" },
    ],
    flow: {
      inputLabel: "Tonight's contact pool",
      input: {
        kind: "kv",
        rows: [
          ["Not contacted in 6 to 12 months", "214"],
          ["Unsubscribed or cooling off", "9 left out"],
          ["Sending window", "09:00 to 17:00, spread out"],
        ],
      },
      steps: [
        { label: "Builds the list from Bullhorn overnight" },
        { label: "Sends each person a single-use link" },
        { label: "Takes the answer when they tap" },
        { label: "Writes it back to their Bullhorn record" },
      ],
      outputLabel: "One answer",
      output: {
        kind: "views",
        views: [
          {
            kind: "message",
            channel: "email",
            from: "Sam at Demo Recruitment Co",
            to: "Jamie Hart",
            subject: "Are you free for work?",
            body: "Hi Jamie, we've got groundwork coming up near Shoreham. Are you free at the moment?\n\n[Available now]  [Available from a date]  [Not looking]",
          },
          {
            kind: "kv",
            rows: [
              ["Jamie tapped", "Available now, 10:41"],
              ["Bullhorn", "Date available set to today, note added"],
            ],
          },
        ],
      },
    },
  },
  {
    n: 15,
    slug: "prospect-alerts",
    group: "candidates",
    title: "Prospect alerts",
    line: "The team is told when a suitable worker becomes available near a site they want to win.",
    problem:
      "A new contractor wants groundworkers in Lewes. The day a good one becomes free nearby, nobody notices.",
    how: [
      "Prospect sites are kept with the trades they use.",
      "A new registration, an availability answer or a change in Bullhorn sets off a check.",
      "If a matching worker is within reach of a prospect site, the team gets an email with the reason.",
    ],
    status: "Built",
    tools: ["Postgres", "Geocoding", "Brevo"],
    seeAlso: [{ label: "Prospects in the back office", to: "/crm/prospects" }],
    flow: {
      inputLabel: "Something changed",
      input: {
        kind: "kv",
        rows: [
          ["Event", "Connor Webb answered: available now"],
          ["Trade", "Groundworker, CPCS 360 excavator"],
          ["Lives", "Newhaven"],
        ],
      },
      steps: [
        { label: "Looks for prospect sites wanting that trade" },
        { label: "Measures the distance from his postcode" },
        { label: "Emails the team" },
      ],
      outputLabel: "Alert sent",
      output: {
        kind: "message",
        channel: "email",
        from: "Platform",
        to: "Office",
        subject: "Available near a prospect: Tidemark Homes, Lewes",
        body: "Connor Webb (groundworker, 360 excavator ticket) is available now and lives 9 miles from Tidemark Homes' Lewes site. Tidemark said in their last call they need machine drivers in November.",
      },
    },
  },
  {
    n: 16,
    slug: "compliance",
    group: "candidates",
    title: "Compliance: cards read by AI",
    line: "Card photos read by AI, expiry dates tracked, and a renewal page for workers.",
    problem:
      "Expired CSCS cards get men turned away at the gate. Tracking expiry dates by hand across hundreds of workers doesn't happen.",
    how: [
      "AI reads every card photo: scheme, level, number, name and expiry.",
      "A compliance screen shows every card, what has expired and what expires soon.",
      "Workers renew through their own link, uploading the new card.",
      "Reminders at 60, 30 and 14 days sit behind a switch the office controls.",
    ],
    status: "Live",
    tools: ["AI vision", "Postgres", "Storage"],
    seeAlso: [
      { label: "Compliance in the back office", to: "/crm/compliance" },
    ],
    flow: {
      inputLabel: "Photo uploaded",
      input: {
        kind: "card",
        scheme: "CSCS",
        level: "Labourer",
        name: "Daniel Price",
        number: "0412 8875",
        expires: "03/2027",
      },
      steps: [
        { label: "AI reads the card" },
        { label: "Checks the name against the worker" },
        { label: "Records the expiry and sets the reminders" },
      ],
      outputLabel: "On his record",
      output: {
        kind: "kv",
        rows: [
          ["Scheme", "CSCS Labourer"],
          ["Card number", "0412 8875"],
          ["Expires", "31 March 2027"],
          ["Name on card", "Daniel Price, matches"],
          ["Reminders", "60, 30 and 14 days before"],
        ],
      },
    },
  },
  {
    n: 17,
    slug: "ai-caller",
    group: "candidates",
    title: "AI voice caller for availability",
    line: "An AI voice agent phones candidates to ask if they're free, and writes the answer back.",
    problem:
      "Some candidates never open an email. Phoning them all takes a consultant days.",
    how: [
      "Calls only candidates who have agreed to be called.",
      "Asks whether they're free, from when, and how far they'll travel.",
      "Writes the answer and a call summary back to their record.",
      "Never calls anyone on a live shortlist: those people are for a human.",
    ],
    status: "Built, switched off",
    tools: ["Retell AI voice agent", "Postgres"],
    flow: {
      inputLabel: "Call list",
      input: {
        kind: "kv",
        rows: [
          ["Candidate", "Marek Zielinski"],
          ["Consent to call", "Yes, given 2 Sep"],
          ["Last answer", "None in 9 months"],
        ],
      },
      steps: [
        { label: "Places the call" },
        { label: "Has the conversation" },
        { label: "Writes the answer back" },
      ],
      outputLabel: "The call",
      output: {
        kind: "views",
        views: [
          {
            kind: "transcript",
            lines: [
              {
                who: "AI",
                text: "Hi Marek, it's the assistant from Demo Recruitment Co. Have you got a minute? We're checking who's free for work.",
              },
              { who: "Person", text: "Yeah, I finish my current job Friday." },
              {
                who: "AI",
                text: "Great. So you'd be free from Monday the 26th? And how far would you travel?",
              },
              { who: "Person", text: "Monday, yes. Up to Crawley is fine." },
            ],
          },
          {
            kind: "kv",
            rows: [
              ["Available from", "Monday 26 October"],
              ["Travel", "Up to Crawley"],
              ["Record", "Updated, summary added"],
            ],
          },
        ],
      },
    },
  },
  {
    n: 18,
    slug: "sms",
    group: "candidates",
    title: "Text replies and STOP handling",
    line: "Two-way texts: replies filed on the record, STOP honoured at once.",
    problem:
      "Candidates reply to texts in their own words. Somebody has to read each one, and a missed STOP is a complaint.",
    how: [
      "Every reply is filed on the candidate's record for the consultant who sent the text.",
      "STOP adds the number to the suppression list immediately, so nothing is ever sent to it again.",
      "Texts only go out inside the sending window and the cooldowns.",
    ],
    status: "Built, switched off",
    tools: ["Twilio", "Postgres"],
    flow: {
      inputLabel: "Replies in",
      input: {
        kind: "list",
        items: [
          { title: '"yeah free from the 2nd"', sub: "Liam Ford" },
          { title: '"STOP"', sub: "07700 900812" },
          { title: '"got work till xmas mate"', sub: "Ryan Cole" },
        ],
      },
      steps: [
        { label: "Matches each reply to the candidate" },
        { label: "Checks for STOP" },
        { label: "Files the reply or suppresses the number" },
      ],
      outputLabel: "Filed",
      output: {
        kind: "table",
        columns: ["From", "Done"],
        rows: [
          ["Liam Ford", "Filed on his record for Sam to read"],
          ["07700 900812", "STOP: number suppressed now"],
          ["Ryan Cole", "Filed on his record for Sam to read"],
        ],
        flag: [1],
      },
    },
  },
  {
    n: 19,
    slug: "jobs-feed",
    group: "candidates",
    title: "Jobs feed for Google and Indeed",
    line: "Live jobs as proper pages with structured data, a sitemap and job alerts.",
    problem:
      "Jobs typed into the CRM never reached Google for Jobs or Indeed in a form they could read.",
    how: [
      "Every live vacancy becomes its own page with job posting data search engines read.",
      "A sitemap lists them, and pages are pre-built so crawlers see the full advert.",
      "A new job can set off an alert, so it is seen the day it goes live.",
    ],
    status: "Built",
    tools: ["Bullhorn REST API", "Cloudflare", "JSON-LD"],
    seeAlso: [{ label: "The demo jobs board", to: "/jobs" }],
    flow: {
      inputLabel: "New vacancy in Bullhorn",
      input: {
        kind: "kv",
        rows: [
          ["Title", "Groundworker"],
          ["Site", "Shoreham-by-Sea"],
          ["Pay", "£19.50 an hour"],
          ["Start", "Monday 26 October"],
        ],
      },
      steps: [
        { label: "Builds the job page" },
        { label: "Adds job posting data for Google" },
        { label: "Updates the sitemap" },
        { label: "Sends the new-job alert" },
      ],
      outputLabel: "Published",
      output: {
        kind: "list",
        items: [
          {
            title: "/jobs/groundworker-shoreham",
            sub: "Readable by Google for Jobs and Indeed",
            tag: "Live",
            tone: "good",
          },
          {
            title: "Sitemap",
            sub: "Updated, 23 live jobs",
            tag: "Updated",
            tone: "good",
          },
          {
            title: "Job alert",
            sub: "New groundworker job, Shoreham-by-Sea",
            tag: "Sent",
            tone: "info",
          },
        ],
      },
    },
  },
  {
    n: 20,
    slug: "worker-matching",
    group: "candidates",
    title: "Worker matching that never guesses",
    line: "Names on sheets matched to the right person, strictly; duplicates merged safely.",
    problem:
      '"J. Hart" on a timesheet could be two different men. Matching the wrong one attaches one person\'s pay or documents to another.',
    how: [
      "Matches by full name, then known aliases, then an initial and surname only when one man on that job could be meant.",
      "Empty or short phone numbers never match.",
      "Duplicate worker records are merged by a person, with everything carried across.",
    ],
    status: "Live",
    tools: ["Postgres"],
    flow: {
      inputLabel: "Names on this week's sheets",
      input: {
        kind: "list",
        items: [
          { title: "T. Nowak", sub: "Weald Civils, PO 4471" },
          { title: "J Hart", sub: "Weald Civils, PO 4471" },
          { title: "Dan P", sub: "Downsline, DL-12" },
        ],
      },
      steps: [
        { label: "Looks for an exact name" },
        { label: "Then known aliases" },
        { label: "Then an initial and surname, only if one man fits" },
        { label: "Leaves the rest for a person" },
      ],
      outputLabel: "Matched",
      output: {
        kind: "table",
        columns: ["On the sheet", "Matched to", "How"],
        rows: [
          ["T. Nowak", "Tomasz Nowak", "Only Nowak on this PO"],
          ["J Hart", "Jamie Hart", "Known alias"],
          ["Dan P", "Not matched", "Two Daniels on DL-12: a person chooses"],
        ],
        flag: [2],
      },
    },
  },
  {
    n: 21,
    slug: "scheduler",
    group: "candidates",
    title: "Every automation on one screen",
    line: "Each scheduled job, when it last ran and what it said.",
    problem:
      "Automations that fail quietly are worse than none. The office needs to see they're running.",
    how: [
      "All the scheduled jobs run inside the database on a timer.",
      "Every run's reply is kept.",
      "One screen shows each job, its last run and anything that went wrong.",
    ],
    status: "Live",
    tools: ["pg_cron", "pg_net", "Postgres"],
    flow: {
      inputLabel: "Scheduled jobs",
      input: {
        kind: "kv",
        rows: [
          ["Jobs", "15"],
          ["Runs today", "1,612"],
        ],
      },
      steps: [
        { label: "Reads each job's last run" },
        { label: "Flags any that failed or went quiet" },
      ],
      outputLabel: "Scheduled jobs screen",
      output: {
        kind: "table",
        columns: ["Job", "Every", "Last run", "Result"],
        rows: [
          ["Read timesheet mailbox", "1 minute", "09:41", "3 files read"],
          [
            "Vacancies and shortlists",
            "30 minutes",
            "09:30",
            "2 shortlists sent",
          ],
          ["Registrations to Bullhorn", "1 hour", "09:00", "4 pushed"],
          ["Availability answers to Bullhorn", "1 hour", "09:00", "6 written"],
          [
            "Prospect alerts",
            "15 minutes",
            "09:30",
            "Failed: email service timed out, retried 09:31",
          ],
        ],
        flag: [4],
      },
    },
  },
];

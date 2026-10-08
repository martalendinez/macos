// src/components/windows/FundQuest/lessons.js
// Private markets crash course. ✏️ Edit freely; keep answers accurate.
// Question types: "mc" (one answer), "tf" (true/false), "match" (pairs), "order" (sequence).

export const LESSONS = [
  {
    id: "who",
    title: "Who’s who",
    emoji: "🤝",
    color: "#0a84ff",
    cards: [
      "A **private markets fund** pools money from investors and invests it in things that aren’t traded on a stock exchange: private companies, loans, infrastructure, real estate.",
      "The **GP (General Partner)** runs the fund and picks the investments. The **LPs (Limited Partners)** are the investors who put money in.",
      "Banks and wealth managers often act as **distributors**: they offer these funds to their own clients.",
    ],
    questions: [
      { type: "mc", q: "Who picks the investments in a fund?", options: ["The GP", "The LPs", "The distributor’s clients", "The stock exchange"], answer: 0, why: "The GP manages the fund and makes the investment decisions." },
      {
        type: "match",
        q: "Match each role to what it does",
        pairs: [
          ["GP", "Runs the fund"],
          ["LP", "Invests money"],
          ["Distributor", "Offers the fund to clients"],
        ],
      },
      { type: "tf", q: "LPs usually decide which companies the fund buys.", answer: false, why: "LPs trust the GP with those decisions. That’s the whole point of investing through a fund." },
    ],
  },
  {
    id: "calls",
    title: "Commitments & capital calls",
    emoji: "📞",
    color: "#5e5ce6",
    cards: [
      "An LP makes a **commitment**: a promise to invest, say, €1M. But they don’t pay it all on day one.",
      "When the GP finds an investment, it sends a **capital call**: “please transfer 20% of your commitment within 10 days.”",
      "So the money is **drawn down gradually**, usually over the first few years of the fund.",
    ],
    questions: [
      { type: "mc", q: "You commit €1,000,000. The GP calls 25%. How much do you transfer?", options: ["€25,000", "€250,000", "€1,000,000", "€750,000"], answer: 1, why: "25% of €1,000,000 is €250,000. The other €750,000 is still committed for later calls." },
      { type: "tf", q: "A commitment is paid in full on the first day.", answer: false, why: "It’s drawn down over time through capital calls." },
      { type: "order", q: "Put the fund lifecycle in order", items: ["Commit", "Capital call", "Investment made", "Distribution"], why: "Commit first, money is called when needed, invested, and later returned as distributions." },
    ],
  },
  {
    id: "dist",
    title: "Distributions & NAV",
    emoji: "💸",
    color: "#30d158",
    cards: [
      "When a company in the fund is sold, or a loan pays interest, cash flows back to LPs. That’s a **distribution**.",
      "**NAV (Net Asset Value)** is the estimated value of the investments the fund still holds. It’s a valuation, not cash in your pocket.",
    ],
    questions: [
      { type: "mc", q: "A portfolio company is sold at a profit. What do LPs receive?", options: ["A capital call", "A distribution", "A management fee", "A new commitment"], answer: 1, why: "Proceeds from the sale are returned to LPs as a distribution." },
      { type: "mc", q: "NAV is…", options: ["Cash already paid out", "The estimated value of investments still held", "The total amount committed", "The GP’s salary"], answer: 1, why: "NAV values what’s still in the portfolio." },
      { type: "tf", q: "NAV is cash you can already spend.", answer: false, why: "NAV is an estimate of value. It only becomes cash when investments are sold or pay out." },
    ],
  },
  {
    id: "jcurve",
    title: "The J-curve",
    emoji: "📈",
    color: "#ff9f0a",
    cards: [
      "In the early years, LPs pay in through capital calls and fees, but investments haven’t grown yet. So cumulative cash flow goes **negative**.",
      "As investments mature and are sold, distributions arrive and the curve climbs. Plotted over time it looks like a **J**.",
    ],
    questions: [
      { type: "mc", q: "Why are a fund’s early years usually negative?", options: ["The GP made bad picks", "Money is being called and fees paid before investments mature", "Markets always fall at first", "LPs withdraw their money"], answer: 1, why: "It’s timing, not failure: cash goes out before gains come back." },
      { type: "tf", q: "A negative year 2 means the fund is failing.", answer: false, why: "A dip early on is completely normal. That’s the J-curve." },
      { type: "mc", q: "For a typical buyout fund, roughly when does the J-curve cross back above zero?", options: ["Year 1", "Around the middle of its life (≈ years 5–8)", "Never", "Only after 20 years"], answer: 1, why: "It varies by fund, but breakeven around the middle of the fund’s life is common. Try it in the Fund Simulator!" },
    ],
  },
  {
    id: "returns",
    title: "Measuring returns",
    emoji: "🧮",
    color: "#ff375f",
    cards: [
      "**TVPI** = (distributions + NAV) ÷ paid-in. Total value created per €1 invested.",
      "**DPI** = distributions ÷ paid-in. Only the cash actually returned. It’s the “real money” multiple.",
      "**IRR** is the annualised return. It cares about **time**: getting the same money back sooner means a higher IRR.",
    ],
    questions: [
      { type: "mc", q: "Paid in €10M, distributed €6M, NAV €9M. What’s the TVPI?", options: ["0.6x", "0.9x", "1.5x", "2.5x"], answer: 2, why: "(6 + 9) ÷ 10 = 1.5x" },
      { type: "mc", q: "Same fund: paid in €10M, distributed €6M. What’s the DPI?", options: ["0.6x", "1.5x", "6.0x", "0.4x"], answer: 0, why: "6 ÷ 10 = 0.6x. DPI only counts cash that’s been returned." },
      { type: "mc", q: "Two funds both return 2.0x. Fund A takes 4 years, Fund B takes 10. Which has the higher IRR?", options: ["Fund A", "Fund B", "Same IRR", "Can’t have an IRR"], answer: 0, why: "Same multiple in less time means a higher annualised return." },
    ],
  },
  {
    id: "kyc",
    title: "Onboarding: KYC & AML",
    emoji: "🪪",
    color: "#64d2ff",
    cards: [
      "Before anyone can invest, they go through **onboarding**. Regulated firms must know who their investors are.",
      "**KYC (Know Your Customer)** verifies identity. **AML (Anti-Money Laundering)** checks where money comes from and screens for financial crime.",
      "Investors are also **classified** (e.g. professional or retail), which affects which products they can access. Designing this flow so it feels clear and calm is a big part of fintech UX.",
    ],
    questions: [
      { type: "mc", q: "KYC stands for…", options: ["Keep Your Capital", "Know Your Customer", "Key Yield Calculation", "Know Your Commitment"], answer: 1, why: "Know Your Customer: verifying who an investor really is." },
      { type: "mc", q: "Which of these is part of KYC?", options: ["Verifying identity documents", "Choosing portfolio companies", "Setting the management fee", "Calculating NAV"], answer: 0, why: "KYC is about verifying the investor." },
      { type: "mc", q: "Why do AML checks exist?", options: ["To speed up distributions", "To prevent money laundering and financial crime", "To calculate IRR", "To pick the GP"], answer: 1, why: "AML protects the financial system from illicit money." },
    ],
  },
  {
    id: "types",
    title: "Fund types",
    emoji: "🏛️",
    color: "#bf5af2",
    cards: [
      "**Closed-end funds** have a fixed life (often ~10 years). LPs commit once, money is called over time, then returned as investments are sold.",
      "**Evergreen funds** have no fixed end date. Investors can typically subscribe and redeem periodically, which makes them popular with wealth managers’ clients.",
    ],
    questions: [
      { type: "mc", q: "Which fund type has no fixed end date?", options: ["Closed-end", "Evergreen", "Both", "Neither"], answer: 1, why: "Evergreen funds keep running and recycle capital." },
      { type: "mc", q: "In a closed-end fund, investors’ money is…", options: ["Paid fully upfront and returned in a year", "Committed upfront and called over time", "Never returned", "Traded daily on an exchange"], answer: 1, why: "That’s the commitment + capital call model you learned earlier." },
      { type: "tf", q: "Evergreen funds usually let investors subscribe periodically.", answer: true, why: "Periodic subscriptions (and redemptions) are a defining feature." },
    ],
  },
];

export const XP_PER_CORRECT = 10;
export const PERFECT_BONUS = 20;

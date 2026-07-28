import { siteUrl } from "@/lib/api";

export const NAV_LINKS: Array<{ href: string; label: string }> = [
  { href: "/features", label: "Features" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/docs", label: "Docs" },
  { href: "/support", label: "Support" },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "Does DCS AI ATC really work offline?",
    answer:
      "Yes. All speech recognition (Whisper) and text-to-speech (Kokoro) run on your machine. The ATC logic is deterministic, based on keyword matching and YAML state machines: no cloud LLM calls during your mission. Internet is only needed to activate your license, download the installer, and fetch the models the first time.",
  },
  {
    question: "Which versions of DCS World are supported?",
    answer:
      "DCS AI ATC integrates with DCS World Stable and Open Beta via Lua scripts (Export.lua + mission hooks). It works in single-player, multiplayer host/client, and on dedicated servers.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "Italian and English, with ICAO phraseology. You can select the ATC response language from the UI; response templates are localized with automatic fallback to English.",
  },
  {
    question: "What hardware do I need?",
    answer:
      "A GPU with at least 6 GB of VRAM is recommended for Whisper large-v3-turbo. The CPU can handle lighter Piper models. The license allows up to 2 associated devices.",
  },
  {
    question: "What does the perpetual license include?",
    answer:
      "A perpetual license gives you unlimited access to the current version of DCS AI ATC, plus all updates released within 1 year of purchase. Updates after the first year are optional and available at a reduced price.",
  },
  {
    question: "Can I move my license to another PC?",
    answer:
      "Yes. You can associate up to 2 devices and revoke a device from your account area at any time, freeing up the slot to associate a new one.",
  },
  {
    question: "How do I receive updates?",
    answer:
      "The app automatically checks for new releases. As long as you're within the 1-year update period, you can download and install them directly from the app or your account area on the website.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 14-day refund guarantee if the product doesn't work on your system and the issue cannot be resolved by support. Contact support@dcs-ai-atc.com.",
  },
  {
    question: "Does DCS AI ATC / AWACS include an AWACS controller?",
    answer:
      "Yes. Check in on an AWACS frequency (Overlord, Darkstar) for a tactical picture, bogey dope, declare, commit, and intercept vectors. AWACS also runs a global threat scan and warns your coalition when allies are in danger.",
  },
  {
    question: "Is JTAC or carrier operations support available?",
    answer:
      "Not yet — they're on the roadmap. JTAC (9-line briefings, laser codes, talk-on) and carrier operations (Case I/II/III recovery, marshal stack, LSO calls) are planned as free updates for existing license holders within the update period. See the full roadmap for details.",
  },
];

export const FEATURES: Array<{
  icon: string;
  title: string;
  description: string;
}> = [
  {
    icon: "Mic",
    title: "Understands your voice",
    description:
      "Whisper transcribes your voice commands with high accuracy, even over noisy radio channels and with different accents.",
  },
  {
    icon: "Radio",
    title: "Responds like a controller",
    description:
      "Kokoro TTS generates realistic voices with a VHF radio effect. ICAO phraseology, numbers in standard format.",
  },
  {
    icon: "TowerControl",
    title: "Ground, Tower, Approach, Departure",
    description:
      "Covers the entire ATC flow: startup, taxi, takeoff, departure, approach, landing, go-around, missed approach.",
  },
  {
    icon: "Users",
    title: "Single-player and multiplayer",
    description:
      "Shared state synchronized between DCS client and server. Works in host+client and on dedicated servers.",
  },
  {
    icon: "Languages",
    title: "Italian and English",
    description:
      "Localized response templates with automatic fallback. ICAO phraseology in both languages.",
  },
  {
    icon: "WifiOff",
    title: "Fully offline",
    description:
      "No internet connection required to play. Models run on your GPU/CPU.",
  },
  {
    icon: "ShieldCheck",
    title: "Deterministic logic",
    description:
      "No LLM hallucinations: keyword matching + YAML state machines + text response templates.",
  },
  {
    icon: "Radar",
    title: "Proactive monitoring",
    description:
      "Landing sequencing, traffic advisories, missed approach, holding patterns, heading/speed vectors.",
  },
  {
    icon: "Crosshair",
    title: "AWACS / GCI control",
    description:
      "Overlord and Darkstar on station. Tactical picture, bogey dope, declare, commit, and threat warnings on the radio.",
  },
];

export interface AwacsCapability {
  icon: string;
  title: string;
  description: string;
}

export const AWACS_CAPABILITIES: AwacsCapability[] = [
  {
    icon: "Crosshair",
    title: "Picture & bogey dope",
    description:
      "Request the tactical picture or the closest bogey dope. BRAA format (bearing, range, altitude, aspect) from bullseye or from your position.",
  },
  {
    icon: "Target",
    title: "Declare & commit",
    description:
      "Declare a contact as hostile, friendly, or unknown. Commit to an intercept and get vectors to the target.",
  },
  {
    icon: "ShieldAlert",
    title: "Threat & merge warnings",
    description:
      "Proactive threat calls for committed players (up to 150 NM) and merge calls when hostile and friendly contacts close within 10 NM.",
  },
  {
    icon: "Radio",
    title: "Weapon & engagement calls",
    description:
      "Report weapon launch (Fox 1/2/3, rifle), splash a kill, or call snaplock — AWACS acknowledges on frequency.",
  },
  {
    icon: "Users",
    title: "Ally in danger",
    description:
      "Global threat scan across the coalition: AWACS warns checked-in pilots when allies, tankers, or AWACS itself are threatened by nearby hostiles.",
  },
  {
    icon: "Compass",
    title: "Vectors, bingo & sunrise",
    description:
      "Request vectors to a target or home plate, call bingo fuel for RTB guidance, or request sunrise/sunset times.",
  },
];

export const HOW_IT_WORKS: Array<{
  step: string;
  title: string;
  description: string;
}> = [
  {
    step: "01",
    title: "Install",
    description:
      "Download the Windows installer, run it, and complete the setup wizard. The Lua script is copied to your DCS folder.",
  },
  {
    step: "02",
    title: "Log in",
    description:
      "Launch the app, log in with the account used for purchase. Your license is activated and bound to the device.",
  },
  {
    step: "03",
    title: "Download models",
    description:
      "The app downloads STT/TTS models (with SHA-256 hash verification) on first run. One-time only.",
  },
  {
    step: "04",
    title: "Fly",
    description:
      "Start your mission in DCS, select the radio, speak. The ATC responds with realistic phraseology.",
  },
];

export const PRICE = {
  amount: 49,
  currency: "€",
  label: "Perpetual license",
  formatted: "€49",
  includes: [
    "Perpetual access to the current version",
    "1 year of updates included",
    "Up to 2 associated devices",
    "Email support and Discord community",
    "Italian and English",
  ],
} as const;

export interface RoadmapItem {
  status: "shipped" | "planned";
  tag: string;
  title: string;
  description: string;
  details: string[];
}

export const ROADMAP: RoadmapItem[] = [
  {
    status: "shipped",
    tag: "Available now",
    title: "ATC — Ground, Tower, Approach, Departure",
    description:
      "Full airport control flow: startup, taxi, takeoff, departure, approach, landing, go-around, missed approach.",
    details: [
      "Startup, pushback, and taxi clearances with holding points",
      "Takeoff clearance, lineup and wait, runway occupancy",
      "Radar vectors, ILS intercept, and approach sequencing",
      "Proactive monitoring: traffic advisories, missed approach, holding",
    ],
  },
  {
    status: "shipped",
    tag: "Available now",
    title: "AWACS / GCI — Overlord & Darkstar",
    description:
      "Tactical picture, bogey dope, declare, commit, threat warnings, merge calls, and ally-in-danger monitoring.",
    details: [
      "Tactical picture and BRAA bogey dope from bullseye or your position",
      "Declare, commit, and intercept vectors",
      "Threat warnings (up to 150 NM once committed) and merge calls",
      "Global ally-in-danger scan across the whole coalition",
    ],
  },
  {
    status: "planned",
    tag: "Coming next",
    title: "JTAC — Joint Terminal Attack Controller",
    description:
      "Close air support workflow for CAS flights: 9-line briefings, laser/IR pointer codes, talk-on to target, and readback verification.",
    details: [
      "Full 9-line briefing read over the radio, with readback verification",
      "Laser/IR pointer code assignment and sparkle/mark-on-target talk-on",
      "Type 1, 2, and 3 control procedures",
      "Cleared hot / abort calls and BDA reporting",
    ],
  },
  {
    status: "planned",
    tag: "Coming next",
    title: "Carrier operations — Case I, II, and III recovery",
    description:
      "Marshal stack and CATCC check-in, Case I/II/III recovery based on weather and time of day, LSO/paddles calls, and ball call on the groove.",
    details: [
      "CATCC check-in and marshal stack assignment (angels, radial, EAT)",
      "Case I (day/VMC), Case II (day/IMC), and Case III (night/IMC) recovery",
      "Push and approach timing, straight-in vs. overhead break",
      "LSO/paddles calls and ball call in the groove",
    ],
  },
];

export const ORGANIZATION = {
  name: "DCS AI ATC / AWACS",
  url: siteUrl(),
  email: "support@dcs-ai-atc.com",
  discord: "https://discord.gg/dcs-ai-atc",
  youtube: "https://www.youtube.com/@dcs-ai-atc",
  github: "https://github.com/dcs-ai-atc",
};

export const FAQS_FOR_LANDING: FaqItem[] = FAQS.slice(0, 4);

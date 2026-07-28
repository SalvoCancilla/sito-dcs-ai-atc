# DCS AI ATC — Sito web (marketing + vendita)

Sito Next.js 14 (App Router, TypeScript) per la vendita e la distribuzione di
**DCS AI ATC**. Si integra con il backend di licensing in
`../backend/` (FastAPI) tramite API route proxy che mantengono il token JWT in
cookie **httpOnly** (mai esposto al client JS).

## Stack

- Next.js 14+ App Router (TypeScript)
- TailwindCSS + shadcn/ui (componenti in `components/ui/`)
- next-themes (dark default, toggle chiaro/scuro)
- lucide-react (icone)
- framer-motion (micro-animazioni `whileInView`)
- react-hook-form + zod (form login/register/supporto)
- sonner (toast)
- next/og (`ImageResponse`) per OG/Twitter images dinamiche

## Prerequisiti

- Node.js 20+
- pnpm (`corepack enable && corepack prepare pnpm@latest --activate`)
- Backend di licensing avviato (vedi `../backend/README.md`) su
  `LICENSING_API_URL` (default `http://localhost:8000`)

## Setup

```bash
cd distribuzione/sito
pnpm install
cp .env.example .env.local
# modifica .env.local con i valori reali
```

Variabili d'ambiente (vedi `.env.example`):

| Variabile | Descrizione |
|---|---|
| `LICENSING_API_URL` | URL del backend FastAPI (server-side only) |
| `NEXT_PUBLIC_SITE_URL` | URL pubblico del sito (canonical, sitemap, OG) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Chiave pubblicabile Stripe (opzionale, lato client) |
| `AUTH_COOKIE_DOMAIN` | (opzionale) dominio cookie condiviso tra sottodomini |

## Sviluppo

```bash
pnpm dev          # http://localhost:3000
pnpm typecheck    # controllo tipi
pnpm lint
```

## Build & avvio in produzione

```bash
pnpm build
pnpm start
```

## Deploy su Cloudflare Pages

Il progetto usa `output: "standalone"` in `next.config.mjs`.

1. Build: `pnpm next build` (output in `.next/standalone`).
2. Su Cloudflare Pages usa il preset **Next.js** o il worker
   `@cloudflare/next-on-pages` a seconda della configurazione.
3. Configura le variabili d'ambiente in dashboard:
   - `LICENSING_API_URL` (backend raggiungibile da edge)
   - `NEXT_PUBLIC_SITE_URL` (dominio finale, es. `https://www.dcs-ai-atc.com`)
4. Assicurati che il backend esponga CORS verso il dominio del sito solo per le
   rotte pubbliche necessarie; le chiamate autenticate passano tutte dai proxy
   `/api/*` del sito (same-origin).
5. Configura Stripe: webhook → backend `POST /stripe/webhook`, e
   `success_url`/`cancel_url` del Checkout verso `/success` e `/cancel` del
   sito.

> Nota: `app/opengraph-image.tsx` e i file `opengraph-image.tsx` per pagina
> usano `runtime = "edge"` con `next/og`. Su Cloudflare Pages verifica il
> supporto a `ImageResponse`; in caso di problemi, passa a `runtime = "nodejs"`.

## Struttura cartelle

```
sito/
├── app/
│   ├── layout.tsx              # metadata globale, font, ThemeProvider, Navbar/Footer
│   ├── globals.css             # tema cockpit (dark default) + light
│   ├── page.tsx                # landing (hero, features, how-it-works, FAQ, prezzo, CTA)
│   ├── features/page.tsx       # features dettagliate + ItemList JSON-LD
│   ├── pricing/page.tsx        # prezzo + FAQ billing + CheckoutButton
│   ├── faq/page.tsx            # FAQ + FAQPage JSON-LD
│   ├── docs/page.tsx           # index docs (placeholder "coming soon")
│   ├── support/page.tsx        # canali + form (react-hook-form + zod)
│   ├── login/page.tsx          # login form
│   ├── register/page.tsx       # register form
│   ├── account/page.tsx        # area utente: licenza, devices, download, logout
│   ├── download/page.tsx       # download diretto (protetto)
│   ├── success/page.tsx        # post-pagamento Stripe
│   ├── cancel/page.tsx         # cancellazione pagamento
│   ├── legal/
│   │   ├── layout.tsx          # layout condiviso pagine legali
│   │   ├── privacy/page.tsx    # privacy policy (placeholder)
│   │   └── terms/page.tsx      # termini di servizio (placeholder)
│   ├── not-found.tsx           # 404
│   ├── icon.svg                # favicon (Next.js auto-genera i link)
│   ├── opengraph-image.tsx     # OG image dinamica (root, ereditata)
│   ├── {features,pricing,faq}/opengraph-image.tsx
│   ├── sitemap.ts              # sitemap.xml dinamico
│   ├── robots.ts               # robots.txt (allow, host, sitemap)
│   └── api/
│       ├── auth/login/route.ts     # POST proxy -> /auth/login, set cookie
│       ├── auth/register/route.ts  # POST proxy -> /auth/register, set cookie
│       ├── auth/logout/route.ts    # POST clear cookie
│       ├── auth/me/route.ts        # GET proxy -> /auth/me (usa cookie)
│       ├── stripe/checkout/route.ts# POST proxy -> /stripe/checkout (auth)
│       ├── releases/latest/route.ts# GET proxy -> /releases/latest
│       └── devices/[id]/route.ts   # DELETE proxy -> /license/devices/{id}
├── components/
│   ├── ui/                     # shadcn: button, card, accordion, tabs, dialog,
│   │                           #   input, label, badge, separator, dropdown-menu, sonner
│   ├── navbar.tsx              # sticky, responsive, CTA Compra/Accedi
│   ├── footer.tsx              # link legali, social, copyright
│   ├── theme-provider.tsx / theme-toggle.tsx
│   ├── logo.tsx                # logo radar-themed
│   ├── motion.tsx              # FadeIn / FadeInStagger / FadeInItem
│   ├── section-header.tsx / breadcrumbs.tsx / final-cta.tsx
│   ├── feature-icon.tsx        # mappa nomi -> icone lucide
│   ├── auth-form.tsx           # login/register (react-hook-form + zod)
│   ├── checkout-button.tsx     # client: chiama /api/stripe/checkout
│   ├── logout-button.tsx       # client: /api/auth/logout
│   ├── revoke-device-button.tsx
│   └── support-form.tsx
├── lib/
│   ├── utils.ts                # cn(), formatDate, formatBytes
│   ├── api.ts                  # backendFetch, BackendError, cookie helpers
│   ├── auth.ts                 # SSR helpers: getCurrentUser, getLicense, ...
│   ├── content.ts              # FEATURES, FAQS, HOW_IT_WORKS, PRICE, NAV_LINKS
│   ├── seo.tsx                 # pageMetadata, JSON-LD helpers, JsonLd component
│   └── og.tsx                  # ogImage() helper per ImageResponse
├── public/
│   └── logo.svg
├── middleware.ts               # protegge /account e /download
├── next.config.mjs             # output standalone, remotePatterns, headers
├── tailwind.config.ts          # palette radar/freq/cockpit
├── components.json             # config shadcn
├── tsconfig.json / postcss.config.js / .eslintrc.json
└── .env.example
```

## Sicurezza & auth

- Il token JWT **non è mai** accessibile da JavaScript: i cookie `daa_auth` e
  `daa_refresh` sono `httpOnly`, `secure` in produzione, `sameSite=lax`.
- Tutte le chiamate autenticate al backend passano dai proxy `/api/*` che
  leggono il cookie server-side.
- `middleware.ts` reindirizza a `/login?next=...` chi accede a `/account` o
  `/download` senza cookie.

## SEO — cosa è già configurato

- `metadataBase` + `lang="it"` in `app/layout.tsx`
- `metadata` globale con template `%s — DCS AI ATC`, Open Graph + Twitter Card
- `pageMetadata()` helper per canonical + OG/Twitter per ogni pagina
- `app/sitemap.ts` dinamico (tutte le pagine pubbliche)
- `app/robots.ts` (allow, host, sitemap referenced)
- `app/opengraph-image.tsx` + per-pagina (`/features`, `/pricing`, `/faq`)
  tramite `next/og` `ImageResponse`
- JSON-LD: `SoftwareApplication` + `FAQPage` (home + `/faq` + `/pricing`),
  `ItemList` (`/features`), `BreadcrumbList` (pagine pertinenti),
  `Organization` (layout)
- HTML semantico (`main`, `section`, `article`, `nav`, `footer`), un solo
  `<h1>` per pagina, skip-link, `aria-labelledby`, `alt`/`aria-label`
- `next/font` (Inter + JetBrains Mono), `next/image` ready
- pagine protette/auth marcate `noIndex`

## SEO — da verificare dopo il deploy

1. **Google Search Console**: aggiungi il dominio, verifica proprietà,
   invia `sitemap.xml`, controlla indicizzazione e Core Web Vitals.
2. **Bing Webmaster Tools**: invia sitemap, verifica.
3. Sostituisci i placeholder `aggregateRating` (ratingCount reale) e i
   contenuti legali (privacy/terms) con versioni approvate da un legale.
4. Aggiungi un `public/favicon.ico` reale (opzionale: `app/icon.svg` è già
   servito da Next.js come favicon moderna).
5. Verifica che `NEXT_PUBLIC_SITE_URL` corrisponda al dominio finale
   (influenza canonical, sitemap, OG, JSON-LD).
6. Testa gli structured data con
   [Rich Results Test](https://search.google.com/test/rich-results).
7. Controlla le OG images con
   [Meta Debugger](https://developers.facebook.com/tools/debug/) e
   [Twitter Card Validator](https://cards-dev.twitter.com/validator).

## Note

- I componenti shadcn/ui sono creati manualmente in `components/ui/` (nessuna
  CLI eseguita). `cn()` è in `lib/utils.ts`.
- Il form di supporto è dimostrativo: non invia email. Collegarlo a un
  endpoint `/api/support` o a un servizio di ticketing in produzione.
- I contenuti legali e le FAQ sono placeholder realistici in italiano.

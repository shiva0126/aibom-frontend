# AIBOM — AI Security & Compliance Platform

A production-grade dashboard for AI Bill of Materials (AI-BOM) management, security finding detection, and global regulatory compliance — built with React, TypeScript, and Vite.

---

## What This Is

AIBOM is the frontend for an AI security platform that tracks the full inventory and risk posture of AI systems — models, datasets, agents, RAG pipelines, and supply chains — and maps every finding to the global regulatory frameworks your organization needs to comply with.

Think of it as the **intersection of SBOM tooling and AI governance**: every AI system you run gets a live inventory snapshot, every risk gets detected automatically, and every detection is tagged against the compliance framework that cares about it.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Routing | React Router v6 |
| Icons | Lucide React |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Data | Live REST API (Track B — port 8001) with mock fallback |

---

## Project Structure

```
src/
├── api/
│   ├── client.ts        # Typed fetch client — all API types + methods
│   └── hooks.ts         # React hooks for every endpoint (cancel-on-unmount)
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx  # Navigation with Security Posture widget
│   │   ├── Header.tsx   # Top bar with theme toggle
│   │   └── PageShell.tsx# Consistent page wrapper
│   └── shared/
│       ├── Badge.tsx    # Severity + status badge component
│       ├── Card.tsx     # Surface card
│       └── EmptyState.tsx
├── context/
│   └── ThemeContext.tsx # Dark / light theme provider
├── data/
│   └── mock.ts          # Demo data fallback (no backend required)
└── pages/
    ├── Overview.tsx     # Dashboard with stats, widgets, sparklines
    ├── AISystems.tsx    # AI system registry
    ├── AIBOM.tsx        # CycloneDX 1.7 + SPDX 2.3 snapshot table
    ├── Compliance.tsx   # Global compliance — 11 frameworks
    ├── Findings.tsx     # Security findings with OWASP/ATLAS/NIST tags
    ├── AttackPaths.tsx  # Attack path visualization
    ├── SupplyChain.tsx  # Model provenance + supply chain pipeline
    ├── AgentsMCP.tsx    # MCP agent security findings
    ├── RAGLineage.tsx   # RAG pipeline data lineage
    ├── Webhooks.tsx     # Webhook management + HMAC signatures
    ├── Integrations.tsx # Cloud connector status
    ├── Reports.tsx      # Exportable compliance reports
    └── Settings.tsx     # Platform configuration
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (proxies to backend at localhost:8001)
npm run dev

# Type-check
npx tsc --noEmit

# Production build
npm run build
```

The dev server runs on **http://localhost:5173** by default.

### Environment Variables

Create `.env` in the project root (already present):

```env
VITE_API_URL=http://localhost:8001
VITE_TENANT_ID=10000000-0000-0000-0000-000000000001
```

If the backend is unavailable, pages automatically fall back to built-in mock data so the UI is always usable.

---

## Pages & Features

### Overview
Live stats dashboard showing AI systems count, open findings, critical findings, attack paths, and total observations — all fetched from the live API. Includes security posture widgets, recent findings, supply chain and RAG status summaries.

### AI-BOM (AI Bill of Materials)
CycloneDX 1.7 snapshot table with completeness score bars, trust score bars, and drift indicators per system. Each row has:
- **CDX button** — CycloneDX 1.7 export
- **SPDX button** — live SPDX 2.3 export (calls `/api/v1/snapshots/{id}/export/spdx`, triggers JSON download)

### Compliance ← _Main feature_
See full breakdown below.

### Findings
Full findings table with filter by severity and status, search, and live data from the API. When findings have compliance taxonomy tags, the table shows:
- **OWASP** (orange) — OWASP LLM Top 10 tag (e.g. `LLM05`)
- **ATLAS** (purple) — MITRE ATLAS technique (e.g. `AML.T0018`)
- **NIST** (cyan) — NIST AI RMF function (e.g. `MEASURE`)

### Webhooks
Create webhook subscriptions with per-event-type filtering and HMAC-SHA256 signature verification. Events delivered with `X-AIBOM-Signature`, `X-AIBOM-Timestamp`, and `X-AIBOM-Event` headers. Built-in code snippet shows how to verify signatures in your endpoint.

---

## Global Compliance Coverage

The Compliance page provides automated evidence-based assessment across **11 regulatory frameworks** covering **10 jurisdictions**. Every requirement is checked against live AIBOM findings and evidence automatically.

### How It Works

1. **Evidence collection** — AIBOM collectors continuously gather evidence from your AI systems: model registry snapshots, supply chain findings, agent security findings, RAG lineage analysis, and audit trail events.

2. **Concern mapping** — Each finding type maps to one or more compliance concerns (e.g. `vulnerable_serving_image` maps to `security` and `risk_management`).

3. **Requirement scoring** — Each framework requirement checks whether relevant concerns have active findings:
   - **Met (green)** — No negative findings in relevant concern areas + evidence base exists
   - **Partial (orange)** — Medium/low findings present, or no snapshot evidence yet, or requires manual input
   - **Gap (red)** — Critical or high severity findings directly relevant to this requirement

4. **Framework score** — `(satisfied + 0.5 × partial) / total × 100`

### Frameworks Covered

#### 🇪🇺 EU AI Act (Article 11 / Annex IV)
**Authority:** European Commission  
**Effective:** August 2024 (phased by risk tier)  
**Scope:** Any AI system placed on or put into service in the EU market  
**Penalty:** Up to €35 million or 7% of global annual turnover  

Covers all 12 Article 11 technical documentation requirements:
- General system description and intended purpose
- Version and update history
- Hardware/software infrastructure
- Training, validation, and test dataset references
- Data governance and examination procedures
- Design specifications log
- Monitoring, functioning, and control mechanisms
- Risk management measures
- Lifecycle change documentation
- Harmonised standards applied
- EU declaration of conformity
- Labelling information

---

#### 🇮🇳 India DPDPA 2023
**Authority:** Ministry of Electronics & Information Technology (MeitY)  
**Effective:** 2025 (phased rollout)  
**Scope:** Personal data of Indian citizens, processed inside or outside India  
**Penalty:** Up to ₹250 crore (~$30M USD) per violation  

Key requirements checked:
- **§4** — Lawful processing with valid consent
- **§8(3)** — Data quality: accuracy, completeness, and consistency
- **§8(7)** — Retention limitation: erase data once purpose is fulfilled
- **§10** — Significant Data Fiduciary obligations (DPIA, DPO)
- **§11 / §12** — Data principal access, correction, and erasure rights
- **§16** — Cross-border data transfer to approved jurisdictions only
- **§8(5)** — Security safeguards to prevent personal data breaches

AIBOM maps `stale_ingestion` and `deleted_source` findings to retention requirements, `classification_breach` and `cross_tenant_retrieval` to privacy requirements, and `vulnerable_serving_image` / `unauthenticated_mcp_server` to security safeguards.

---

#### 🇺🇸 US Executive Order 14110
**Authority:** White House / NIST / CISA  
**Effective:** October 30, 2023  
**Scope:** Federal AI use and AI systems with significant national security or economic impact  
**Penalty:** Agency-level enforcement; FTC / sector regulator civil actions  

Key requirements checked:
- **§4.1** — Pre-deployment safety testing and adversarial red-teaming
- **§4.1** — Training data provenance documentation
- **§4.2** — NIST AI RMF adoption and standards compliance
- **§4.3** — Human oversight mechanisms for consequential decisions
- **§5** — Privacy protection for training data
- **§7** — AI infrastructure cybersecurity and supply-chain attack protection
- **§8** — Human oversight for consequential AI decisions

---

#### 🇬🇧 UK AI Safety Framework
**Authority:** AI Safety Institute (AISI) / DSIT  
**Effective:** 2023 (principles); ongoing regulatory development  
**Scope:** Frontier and high-risk AI systems deployed in the UK  
**Penalty:** Sector-specific enforcement; potential future AI regulation  

8 core principles assessed:
- Safety — no foreseeable harms; risks mitigated
- Security — resilience against adversarial attacks
- Robustness — reliable under varied conditions
- Privacy — UK GDPR compliance for AI data use
- Fairness — bias tested and mitigated *(manual assessment required)*
- Transparency — decisions explainable and auditable
- Human Oversight — meaningful control over consequential decisions
- Accountability — clear accountability chains for AI outcomes

---

#### 🇨🇦 Canada AIDA
**Authority:** Innovation, Science and Economic Development Canada (ISED)  
**Effective:** Pending — expected 2025–2026  
**Scope:** High-impact AI systems designed, developed, or deployed in Canada  
**Penalty:** Up to CAD $25 million or 5% of global revenue  

10 requirements including:
- §5 — High-impact system identification
- §6 — Pre-deployment risk assessment
- §7 — Risk mitigation implementation
- §9 — Anomaly monitoring post-deployment
- §10 — Record keeping for risk activities
- §11 — Human oversight mechanisms
- §22 — Harmful incident reporting

---

#### 🇨🇳 China CAC Generative AI Regulations
**Authority:** Cyberspace Administration of China (CAC)  
**Effective:** August 15, 2023  
**Scope:** Generative AI services offered to the public in China  
**Penalty:** Service suspension, fines, criminal liability  

8 requirements including:
- Art. 7 — Training data from legitimate sources
- Art. 8 — Data quality: accurate, objective, diverse
- Art. 9 — Personal information protection (PIPL compliance)
- Art. 12 — AI-generated content labeling *(manual)*
- Art. 14 — CAC security assessment before launch *(manual)*
- Art. 22 — Emergency response plan for security incidents

---

#### 🇧🇷 Brazil LGPD
**Authority:** Autoridade Nacional de Proteção de Dados (ANPD)  
**Effective:** September 18, 2020  
**Scope:** Processing of personal data of natural persons located in Brazil  
**Penalty:** Up to BRL 50 million or 2% of Brazil revenue per infraction  

10 requirements including:
- Art. 6(I) — Purpose limitation for data processing
- Art. 6(III) — Data minimization
- Art. 6(V) — Data quality and accuracy
- Art. 6(VII) — Security: technical and administrative safeguards
- Art. 18 — Data subject rights (access, correction, deletion, portability)
- Art. 20 — Review of AI-automated decisions + explanation of criteria
- Art. 48 — Security breach notification to ANPD

---

#### 🇸🇬 Singapore Model AI Governance Framework
**Authority:** IMDA / Monetary Authority of Singapore (MAS)  
**Effective:** January 2020 (v2); ongoing updates  
**Scope:** AI solutions deployed across all industries in Singapore  
**Penalty:** Voluntary framework; PDPA enforcement for personal data aspects  

9 requirements including:
- §2 — Internal AI governance structure and accountability
- §3 — Human involvement calibrated to risk level
- §4 — AI model lifecycle management (training → deployment)
- §4 — Risk assessment covering accuracy, robustness, bias
- §4 — Post-deployment performance testing and monitoring
- §4 — Data governance: quality, access, retention policies
- §4 — AI security controls against adversarial attacks
- §4 — Incident detection, response, and reporting

---

#### 🇦🇺 Australia AI Ethics Framework
**Authority:** DISR / Office of the Australian Information Commissioner (OAIC)  
**Effective:** November 2019 (voluntary); Privacy Act ongoing  
**Scope:** AI systems designed, developed, or deployed in Australia  
**Penalty:** Voluntary framework; Privacy Act: AUD $50 million for serious breaches  

8 voluntary principles:
1. Human, Social and Environmental Wellbeing
2. Human-centred Values — respect rights and autonomy
3. Fairness — no discriminatory outputs *(manual)*
4. Privacy Protection and Security
5. Reliability and Safety — consistent performance
6. Transparency and Explainability
7. Contestability — outcomes can be challenged
8. Accountability — organizations accountable for AI impacts

---

#### 🇯🇵 Japan METI AI Governance Guidelines
**Authority:** Ministry of Economy, Trade and Industry (METI)  
**Effective:** April 2022; updated 2024  
**Scope:** AI systems developed, provided, or used in Japan  
**Penalty:** Voluntary; APPI enforcement: up to JPY 100 million  

8 principles checked:
- Human dignity *(manual)*
- Diversity and inclusion *(manual)*
- Privacy — APPI compliance
- Safety — no threats to life, body, or property
- Fairness *(manual)*
- Transparency and explainability
- Accountability
- Innovation support *(manual)*

---

#### 🇦🇪 UAE AI Regulation
**Authority:** UAE Office of AI / TDRA  
**Effective:** 2021 (PDPL); AI National Strategy 2031 ongoing  
**Scope:** AI solutions and personal data processing in the UAE  
**Penalty:** Up to AED 20 million (~$5.4M USD) for PDPL violations  

8 requirements including:
- PDPL Art. 5 — Lawful legal basis for processing
- PDPL Art. 6 — Sensitive personal data restrictions
- PDPL Art. 10 — Data quality and accuracy
- AI Strategy — Safety assessments and harmful output testing
- AI Strategy — Explainable AI decision-making
- AI Strategy — AI governance bodies established
- PDPL Art. 15 — Cross-border data transfers to approved jurisdictions
- PDPL Art. 13 — Data subject rights: access, correction, erasure

---

#### 🌐 ISO/IEC 42001:2023
**Authority:** International Organization for Standardization (ISO)  
**Effective:** December 18, 2023  
**Scope:** Any organization providing or using AI systems globally  
**Penalty:** Loss of ISO 42001 certification  

12 clauses / annex controls:
- Clause 4 — Organizational context and AI system scope
- Clause 5 — Leadership commitment *(manual)*
- Clause 6 — AI risk planning: identify, assess, treat
- Clause 8 — Operational controls throughout AI lifecycle
- Clause 9 — Performance evaluation and monitoring
- Clause 10 — Continual improvement from nonconformities
- Annex A.2 — AI impact assessments and risk treatment records
- Annex A.5 — Data management: training, validation, test data
- Annex A.6 — AI system lifecycle management
- Annex A.8 — Transparency to stakeholders
- Annex A.9 — Human oversight mechanisms
- Annex A.10 — AI incident management and reporting

---

## API Integration

The frontend connects to the AIBOM Platform backend (Track B, port 8001) via a typed REST client at `src/api/client.ts`.

### Compliance Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/systems/{id}/compliance/global` | All 11 frameworks for a system |
| `GET /api/v1/systems/{id}/compliance/eu-ai-act` | Detailed EU AI Act Article 11 assessment |
| `GET /api/v1/systems/{id}/compliance/nist-ai-rmf` | NIST AI RMF GOVERN/MAP/MEASURE/MANAGE |
| `GET /api/v1/systems/{id}/compliance/summary` | Summary across EU + NIST frameworks |

### Other Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/stats` | Platform-wide statistics |
| `GET /api/v1/findings` | All open findings with OWASP/ATLAS/NIST tags |
| `GET /api/v1/snapshots/{id}/export/spdx` | SPDX 2.3 JSON export |
| `POST /api/v1/webhooks` | Create webhook subscription |
| `GET /api/v1/webhooks` | List active webhooks |
| `DELETE /api/v1/webhooks/{id}` | Deactivate webhook |

All requests include `X-Tenant-ID` header for tenant isolation. The backend enforces Row-Level Security at the database level.

---

## Webhook Security

Webhooks are signed using HMAC-SHA256. Verify in your endpoint:

```javascript
const sig       = req.headers['x-aibom-signature']; // "sha256=<hex>"
const timestamp = req.headers['x-aibom-timestamp']; // Unix timestamp
const expected  = 'sha256=' + hmac(secret, `${timestamp}.${rawBody}`);

if (!timingSafeEqual(sig, expected)) return res.status(401).end();
```

The signature payload is `"{timestamp}.{json_body}"` — same pattern as Stripe webhooks.

---

## Design System

The UI uses a layered dark-first design system with CSS custom properties:

```css
/* Depth layers */
--bg-app        /* #070910 — page background */
--bg-surface    /* #0b0d17 — sidebar, header */
--bg-card       /* #0f1220 — content cards */
--bg-elevated   /* #141826 — table headers, meta bars */

/* Accent */
--accent        /* #5b7fff — primary blue */

/* Semantic */
--success       /* #1ec76a */
--warning       /* #f4a21e */
--danger        /* #f03d3d */
--orange        /* #f87316 */
--purple        /* #a97cf8 */
--cyan          /* #1dd4f4 */
```

Light theme is also supported — toggle via the header theme button.

---

## Development Notes

- **No backend required** — all pages fall back to `src/data/mock.ts` when the API is unavailable
- **Live data indicator** — subtitle shows `(live)` vs `(demo)` depending on API availability
- **Cancel-on-unmount** — all `useQuery` hooks cancel in-flight requests when the component unmounts to prevent setState-on-unmounted-component warnings
- **Refetch** — all hooks expose a `refetch()` callback for manual refresh (used by Webhooks page after create/delete)
- **SPDX download** — `exportSpdx()` in `client.ts` fetches JSON and triggers a browser file download via a temporary `<a>` element; no server-side file storage needed

---

## License

Internal platform — not for public distribution.

# ⭐ StellarFlow

# StellarFlow

### Non-Custodial Smart Escrow & Milestone Vault dApp on Stellar Soroban

A production-ready decentralized escrow application built with **React**, **TypeScript**, **Tailwind CSS**, **Soroban Smart Contracts**, and the **Stellar Network**.

Securely create milestone-based escrow agreements, lock funds on-chain, manage milestone payouts between clients and freelancers, and automatically log transaction telemetry in real time.

---

### 🌐 Live Demo

[https://stellar-flow.vercel.app/](https://www.google.com/search?q=https://stellar-flow.vercel.app/)

### 📂 GitHub Repository

[https://github.com/Earth-Kumar-Roy/StellarFlow](https://www.google.com/search?q=https://github.com/Earth-Kumar-Roy/StellarFlow)

### 🎥 Demo Video

[https://drive.google.com/file/d/1OR1QGHJBFW7D19ROtxp_Zyf-B1wCNHhl/view?usp=sharing](https://drive.google.com/file/d/1OR1QGHJBFW7D19ROtxp_Zyf-B1wCNHhl/view?usp=sharing)

---

# 📖 Project Overview

StellarFlow is a non-custodial Web3 smart escrow application engineered for secure, milestone-driven agreement execution between clients and freelancers.

The platform locks contract funds safely inside Soroban smart contracts on the Stellar Network until specific work milestones are submitted for review and authorized for release by the client. It features a target-aware multi-escrow management engine, persistent local transaction history indexing per public key, automated Google Sheets audit logging via Apps Script, and real-time ledger countdown tracking.

---

# ✨ Features

## Multi-Escrow Vault Management

* Create dynamic milestone-based escrows
* Lock XLM or Stellar Asset Contract (SAC) tokens
* Target-aware multi-escrow card rendering
* Granular milestone allocation and release tracking

---

## Non-Custodial Execution State

* Client-authorized milestone fund release
* Freelancer work submission workflow
* Automated contract expiration and refund eligibility
* Secure on-chain value custody

---

## Wallet Integration

* Freighter Wallet authentication
* Stellar Testnet RPC interaction
* Real-time balance updates and transaction signing

---

## Real-Time Telemetry & Auditing

* Automated Google Sheets transaction logging via Google Apps Script
* Public key wallet history indexing via local storage persistence
* Live ledger countdown timers for contract deadlines

---

## Security & Validation Controls

* Connected client wallet self-address submission prevention
* Client vs. Freelancer dynamic role detection
* Strict input validation and milestone total matching
* Smart contract authorization checks and error feedback

---

# 🏛 System Architecture

```text
[ React + Tailwind Responsive Frontend / TypeScript Pipeline ]
                                  │
                                  ▼
                   [ Soroban RPC Server / Stellar Testnet ]
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌─────────────────────────────────┐               ┌─────────────────────────────────┐
│  Soroban Smart Contract Vault   │               │ Google Apps Script Logger API   │
├─────────────────────────────────┤               ├─────────────────────────────────┤
│ - Storage: Persistent / Instance│               │ - Service: Apps Script Webhook  │
│ - Functions: create_escrow,     │               │ - Logging: Transaction Events,  │
│   approve_milestone, refund     │               │   Milestones, Audit Records     │
│ - Assets: Native XLM / SAC      │               └─────────────────────────────────┘
└─────────────────────────────────┘

```

---

# 🖥 Application Preview

[https://github.com/Earth-Kumar-Roy/StellarFlow/tree/main/public/screenshots](https://www.google.com/search?q=https://github.com/Earth-Kumar-Roy/StellarFlow/tree/main/public/screenshots)

---

# ⚙ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide React

---

## Smart Contracts

* Rust
* Soroban SDK

---

## Blockchain

* Stellar Testnet
* Soroban RPC Server

---

## Web3 & Integration

* Freighter Wallet API
* Stellar JavaScript SDK (`@stellar/stellar-sdk`)
* Google Apps Script (Webhook Telemetry)

---

## Infrastructure & Hosting

* Vercel
* GitHub Actions
* VS Code

---

# 📂 Project Structure

```text
STELLARFLOW/
├── contracts/
│   └── escrow/
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs
│           └── test.rs
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── CreateEscrowModal.tsx
│   │   │   ├── EscrowCard.tsx
│   │   │   ├── FeedbackModal.tsx
│   │   │   ├── MilestoneTracker.tsx
│   │   │   └── Navbar.tsx
│   │   ├── config/
│   │   │   └── stellar.ts
│   │   ├── hooks/
│   │   │   ├── useEscrow.ts
│   │   │   └── useWallet.ts
│   │   ├── pages/
│   │   │   ├── CreateEscrowPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DocsPage.tsx
│   │   │   ├── FeedbackPage.tsx
│   │   │   ├── HistoryPage.tsx
│   │   │   └── LandingPage.tsx
│   │   ├── types/
│   │   │   └── escrow.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
├── Cargo.toml
└── README.md

```

---

# 🚀 Installation

Clone the repository.

```bash
git clone https://github.com/Earth-Kumar-Roy/StellarFlow.git

```

```bash
cd StellarFlow

```

Install frontend dependencies.

```bash
cd frontend
npm install

```

Build and test smart contracts.

```bash
cargo test --workspace
cargo build --workspace --target wasm32-unknown-unknown --release

```

Start the frontend development server.

```bash
npm run dev

```

---

# 🔒 Security

* Client non-custodial fund locking
* Wallet address verification (prevents deployer from submitting self as freelancer)
* Freighter cryptographic transaction signing
* On-chain contract state verification
* Zero private key leakage (keys remain local to user's wallet)

---

# 🌍 Deployment

**Frontend**

Vercel

**Smart Contract**

Stellar Testnet (Soroban)

---

# 🔮 Future Improvements

* Multi-signature agreement authorization
* Decentralized dispute resolution / arbitration contract integration
* Native IPFS attachment uploads for work deliverables
* Mainnet Soroban deployment

---

# 👨‍💻 Developer

**Earth Kumar Roy**

GitHub

[https://github.com/Earth-Kumar-Roy](https://github.com/Earth-Kumar-Roy)

---

# 🙏 Acknowledgements

* Stellar Development Foundation
* Soroban SDK
* Stellar JavaScript SDK
* Freighter Wallet API
* React & Vite Community
* Tailwind CSS

---

### ⭐ Thank you for visiting StellarFlow ⭐

Built with ❤️ by EKR using React, TypeScript, Soroban, and the Stellar Network.

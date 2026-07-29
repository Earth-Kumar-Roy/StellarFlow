# ⭐ StellarFlow

<div align="center">

# StellarFlow

### Non-Custodial Milestone-Based Escrow & Reputation dApp on Stellar Soroban

A production-ready decentralized escrow platform built with **React**, **TypeScript**, **Vite**, **Soroban Smart Contracts**, and the **Stellar Network**.

Securely create milestone-based escrow agreements, cryptographically lock funds on-chain, release payouts programmatically, and track every transaction through real-time audit trails and community reputation feeds.

---

### 🌐 Live Demo

https://stellar-flow-nine.vercel.app/

### 📂 GitHub Repository

https://github.com/Earth-Kumar-Roy/StellarFlow

### 🎥 Demo Video

https://drive.google.com/file/d/1O3dk2ECn6y7M0LR0811sXVriUs0NWygM/view?usp=drive_link

</div>

---

# 📖 Project Overview

StellarFlow is a non-custodial, milestone-based escrow platform built on Stellar's Soroban smart contract framework.

The platform enables clients and freelancers to securely create milestone-based agreements where funds are cryptographically locked inside a Soroban smart contract vault. Payouts are released programmatically as milestones are approved, and every transaction is tracked through a real-time, on-chain audit trail integrated with off-chain logging and notification microservices.

The application demonstrates production-ready smart contract architecture, multi-stage payout logic, on-chain reputation indexing, and a responsive Web3 frontend.

---

# ✨ Features

## Escrow Management

- Create milestone-based escrows
- Cryptographically lock XLM funds
- Programmatic multi-stage payouts
- Non-custodial, on-chain fund custody

---

## Refund Protection

- Deadline-based refund mechanism
- Client-initiated withdrawal of unreleased funds
- Automatic expiration tracking via countdown timer

---

## Reputation & Feedback

- Counterparty evaluation system
- Client rates freelancer on approval speed & requirement clarity
- Freelancer rates client on code & deliverables, deadline adherence
- Live community reputation & feedback feed
- Proper feedback summary displayed on the Feedback Page

---

## Wallet

- Freighter Wallet integration
- Stellar Testnet support
- Live XLM balance tracking
- Secure transaction signing

---

## Audit & Activity Logging

- Real-time transaction audit trails
- Testnet RPC event logs vs. Google Sheets logs
- Activity log visible even when no wallet is connected
- High volume of transactions completed across many different wallets, viewable on the testnet contract explorer and Activity Log page

---

## Validation & Security

- Wallet authentication
- Input validation
- Authorization checks
- Smart contract access control
- Transaction error handling

---

# 🏛 System Architecture

## On-Chain Payout & Reputation Indexing

```text
   ┌───────────────────┐    Soroban Contract    ┌────────────────────────┐
   │   Client Wallet   │ ──────(Locks XLM)─────►│  Milestone Vault Core  │
   └─────────┬─────────┘                        └───────────┬────────────┘
             │                                              │
             │ (Approves Deliverables)                      │ (Executes Payout)
             │                                              ▼
             │                                  ┌────────────────────────┐
             └─────────────────────────────────►│   Freelancer Wallet    │
                                                └───────────┬────────────┘
                                                            │
    ┌───────────────────────────────────────────────┐       │
    │           Counterparty Evaluation             │◄──────┘
    ├───────────────────────┬───────────────────────┤
    │  Client Rates On:     │ Freelancer Rates On:  │
    │  • Code & Deliverables│  • Approval Speed     │
    │  • Deadline Adherence │  • Requirement Clarity│
    └───────────┬───────────┴───────────┬───────────┘
                │                       │
                └───────────┬───────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │ Decentralized Reputation  │
              │  & Audit Indexer Engine   │
              └─────────────┬─────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │ Live Community Reputation │
              │     & Feed Dashboard      │
              └───────────────────────────┘
```

## Workflow (Between Client and Freelancer)

**01. Create & Lock**
Client signs `create_escrow` via Freighter. Tokens move from Client to the Soroban Contract Vault.

**02. Work Submission**
Freelancer submits deliverable for a milestone. Work review flag logs to local metadata & Google Sheets.

**03. Approve & Release**
Client invokes `approve_milestone`. Contract executes token transfer to Freelancer.

**04. Refund Protection**
If the deadline passes, Client executes `refund_expired` to withdraw remaining unreleased funds.

---

# 🖥 Application Preview

https://github.com/Earth-Kumar-Roy/StellarFlow/tree/main/frontend/public/screenshots

---

# 📊 Live Feedback & Activity Proof

- A **proper Feedback Summary** is present on the Feedback Page.
- **Huge numbers of transactions** have been done using many different different wallets — this can be seen on the **testnet contract explorer page** and the **Activity Log page when no wallet is connected**.

---

# ⚙ Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

---

## Smart Contracts

- Rust
- Soroban SDK

---

## Blockchain

- Stellar Testnet
- Soroban
- Horizon RPC

---

## Web3

- Freighter Wallet API
- Stellar JavaScript SDK

---

## Off-Chain Services

- Google Apps Script
- Google Sheets (activity & feedback logging)

---

## Development

- GitHub Actions
- Vercel
- VS Code

---

# 📂 Project Structure

```text
StellarFlow/
├── contracts/
│   └── escrow/
│       ├── Cargo.toml               <-- Rust Dependencies & Soroban SDK configuration
│       └── src/
│           ├── lib.rs               <-- Escrow Contract logic & token transfer invocations
│           ├── types.rs             <-- Data structures (Escrow, Milestone) & custom error enums
│           ├── storage.rs           <-- Soroban Instance Storage keys & persistence helpers
│           └── test.rs              <-- Soroban unit tests
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── config/
│   │   │   └── stellar.ts          <-- RPC, Contract ID & Apps Script endpoints
│   │   ├── types/
│   │   │   └── escrow.ts           <-- TypeScript interfaces for Escrow, Milestones & Audit Logs
│   │   ├── utils/
│   │   │   └── api.ts              <-- API fetchers for Google Apps Script sheet logs
│   │   ├── hooks/
│   │   │   ├── useWallet.ts        <-- Freighter integration & live XLM balance tracker
│   │   │   └── useEscrow.ts        <-- Soroban contract calls & auto-logging triggers
│   │   ├── components/
│   │   │   ├── Navbar.tsx          <-- Multi-page Navigation, XLM Balance & Role Badges
│   │   │   ├── Toast.tsx           <-- On-chain transaction status toasts
│   │   │   ├── MilestoneTracker.tsx<-- Milestone submission & review UI
│   │   │   ├── CountdownTimer.tsx  <-- Expiration deadline counter
│   │   │   ├── EscrowCard.tsx      <-- Primary contract management interface
│   │   │   └── FeedbackModal.tsx   <-- On-chain reputation & sheet logger modal
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx       <-- Main Operations Dashboard
│   │   │   ├── CreateEscrowPage.tsx<-- Full-page contract creation form
│   │   │   ├── HistoryPage.tsx     <-- Audit Logs (Testnet RPC Events vs. Google Sheets)
│   │   │   ├── FeedbackPage.tsx    <-- Public Counterparty Reputation Feed
│   │   │   └── DocsPage.tsx        <-- Interactive Technical Documentation (This Page)
│   │   ├── App.tsx                 <-- React Router configuration & global layout
│   │   ├── main.tsx                <-- Entry point
│   │   └── index.css               <-- Tailwind CSS base directives
│   ├── index.html
│   └── package.json
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

Start the frontend.

```bash
npm run dev
```

---

# 🔒 Security

- Non-custodial, cryptographically locked fund custody
- Secure wallet authentication
- Contract authorization checks
- Deadline-based refund protection
- Transaction signing through Freighter
- Immutable on-chain event logging

Private keys never leave the user's wallet.

---

# 🌍 Deployment

**Frontend**

Vercel

**Blockchain**

Stellar Testnet (Soroban)

---

# 🔮 Future Improvements

- Multi-signature milestone approval
- Multiple/independent dispute mediators
- DAO-based arbitration
- IPFS agreement storage
- Email notifications
- Mainnet deployment

---

# 👨‍💻 Developer

**Earth Kumar Roy**

GitHub

https://github.com/Earth-Kumar-Roy

---

# 🙏 Acknowledgements

- Stellar Development Foundation
- Soroban SDK
- Stellar JavaScript SDK
- Freighter Wallet
- React
- Vite
- Vercel

---

<div align="center">

### ⭐ Thank you for visiting StellarFlow ⭐

Built with ❤️ by EKR using React, TypeScript, Soroban, and the Stellar Network.

</div>

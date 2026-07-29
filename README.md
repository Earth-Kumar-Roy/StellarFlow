# ⭐ StellarFlow

<div align="center">

# StellarFlow

### Non-Custodial Milestone Escrow & Counterparty Reputation dApp on Stellar Soroban

A production-ready decentralized escrow and reputation indexing platform built with **React**, **TypeScript**, **Tailwind CSS**, **Soroban Smart Contracts**, and the **Stellar Network**.

Securely create milestone-based escrow agreements, lock funds on-chain, manage milestone payouts between clients and freelancers, track contract audit trails, and evaluate counterparty reputations in real time.

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

StellarFlow is a non-custodial Web3 milestone escrow platform built on Stellar's Soroban smart contract framework. It ensures cryptographically locked funds, programmatic multi-stage payouts, and real-time transaction audit trails integrated with off-chain logging and notification microservices.

The platform provides an end-to-end trustless workflow between **Clients** and **Freelancers**. Contract funds remain locked safely inside Soroban smart contract vaults on the Stellar Network until specific deliverables are submitted, reviewed, and authorized for payout release. It features target-aware multi-escrow management, automated Google Sheets transaction logging via Apps Script, real-time ledger countdown tracking, and a public counterparty reputation engine.

> **Network Activity & Public Explorer Notice**:  
> A vast history of live test transactions executed across multiple wallet addresses can be inspected directly on the [Stellar Testnet Explorer](https://stellar.expert/explorer/testnet/contract/CD2KLLZDRFLFBAOQOOC6SSTTY24UFT4P2XUX4EDK77NMTDTX7QGPGQ7Z). When no wallet is connected, the app's **History** and **Feedback** pages automatically load global activity logs and public feedback summaries from all network participants.

---

# ✨ Features

## Escrow Vault Management

- **Non-Custodial Escrow Locking**: Client signs `create_escrow` via Freighter Wallet to lock XLM or SAC tokens into the Soroban contract vault.
- **Dynamic Milestone Schedule**: Split contract values across multiple custom deliverables with exact financial allocation enforcement.
- **Target-Aware Execution**: Independent multi-escrow cards allowing simultaneous handling of multiple active agreements.
- **Automated Expiration & Refunds**: If the contract deadline passes, clients can execute `refund_expired` to reclaim all remaining unreleased funds.

---

## Work Review & Payout Workflows

- **Freelancer Work Submission**: Freelancers submit deliverables per milestone, marking work in review and triggering off-chain telemetry logging.
- **Client Payout Authorization**: Clients review submitted deliverables and execute `approve_milestone` on-chain to trigger immediate token transfers to the freelancer.
- **Role-Based Dynamic Control**: UI automatically adapts views and authorization actions based on whether the connected wallet belongs to the Client, Freelancer, or an Observer.

---

## Counterparty Reputation & Feedback Indexing

- **Dual-Sided Evaluation**: Clients rate freelancers on code quality, deliverable execution, and deadline adherence; Freelancers rate clients on approval speed and requirement clarity.
- **Public Feedback Feed**: Detailed counterparty reputation summaries rendered on the dedicated Feedback Page.
- **Global Visibility**: Public feedback records remain accessible and inspectable by any visitor even when no wallet is connected.

---

## Audit Trails & Real-Time Telemetry

- **Google Sheets Microservice Sync**: Automated transaction logging using Google Apps Script webhooks for real-time off-chain audit logs.
- **Dual Audit View**: Compare raw Stellar Testnet RPC ledger events directly against off-chain log records on the History Page.
- **Key-Indexed Storage Persistence**: Local storage caching indexed per public key prevents cross-account state contamination.

---

# 🏛 System Architecture & Payout Workflow

```text
On-Chain Payout & Reputation Indexing

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
              └─────────────┬─────────────┘
🔄 Lifecycle Execution Steps
Plaintext
01. Create & Lock
    Client signs create_escrow via Freighter. Tokens move from Client to Soroban Contract Vault.

02. Work Submission
    Freelancer submits deliverable for a milestone. Work review flag logs to local metadata & Google Sheets.

03. Approve & Release
    Client invokes approve_milestone. Contract executes token transfer to Freelancer.

04. Refund Protection
    If deadline passes, Client executes refund_expired to withdraw remaining unreleased funds.
🖥 Application Preview
Preview screenshots are available in the public repository:

https://github.com/Earth-Kumar-Roy/StellarFlow/tree/main/frontend/public/screenshots

⚙ Technology Stack
Frontend & State
React with TypeScript

Vite (Build Tool)

Tailwind CSS (Styling)

Lucide React (Iconography)

React Router DOM (Multi-page routing)

Smart Contracts & Blockchain
Rust & Soroban SDK

Stellar Testnet

Horizon / Soroban RPC Server

Web3 & Telemetry Integration
Freighter Wallet API (@stellar/freighter-api)

Stellar JavaScript SDK (@stellar/stellar-sdk)

Google Apps Script (Off-chain transaction & feedback logging API)

📂 Project Structure
Plaintext
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
│   │   ├── screenshots/             <-- Application preview images
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
│   │   │   ├── FeedbackPage.tsx    <-- Public Counterparty Reputation Feed & Summary
│   │   │   └── DocsPage.tsx        <-- Interactive Technical Documentation
│   │   ├── App.tsx                 <-- React Router configuration & global layout
│   │   ├── main.tsx                <-- Entry point
│   │   └── index.css               <-- Tailwind CSS base directives
│   ├── index.html
│   └── package.json
└── README.md
🚀 Installation & Local Setup
1. Clone the Repository
Bash
git clone [https://github.com/Earth-Kumar-Roy/StellarFlow.git](https://github.com/Earth-Kumar-Roy/StellarFlow.git)
cd StellarFlow
2. Run the Frontend
Bash
cd frontend
npm install
npm run dev
3. Build & Test Smart Contracts (Optional)
Ensure Rust and the wasm32-unknown-unknown target are installed.

Bash
cargo test --workspace
cargo build --workspace --target wasm32-unknown-unknown --release
🔒 Security Controls
Connected Wallet Self-Address Check: Prevents deployers from accidentally entering their own connected client address as the freelancer.

Freighter Transaction Signing: Zero private keys handled; all cryptographic signatures are processed strictly inside the user's Freighter extension.

On-Chain Vault Authorization: Soroban smart contract enforces caller permissions before processing milestone approvals or refunds.

Isolated Storage Keys: Local state storage is partitioned per public key to prevent state bleed between switched wallets.

🌍 Deployment
Frontend App: Deployed on Vercel

Smart Contract: Deployed on Stellar Testnet (Soroban)

👨‍💻 Developer
Earth Kumar Roy

GitHub: https://github.com/Earth-Kumar-Roy

🙏 Acknowledgements
Stellar Development Foundation

Soroban SDK

Stellar JavaScript SDK & Freighter API

React, Vite, and Tailwind CSS Communities

⭐ Thank you for visiting StellarFlow ⭐
Built with ❤️ by Earth Kumar Roy using React, TypeScript, Soroban, and the Stellar Network.

# 🧭 BMAD 2.0 — Brief · Mapping · Architecture · Delivery

[![Mnemosyne OS Cartridge](https://img.shields.io/badge/Mnemosyne%20OS-Cartridge-0ea5e9?style=for-the-badge)](https://github.com/yaka0007/Mnemosyne-Neural-OS)
[![License: EULA](https://img.shields.io/badge/License-Mnemosyne%20OS%20Cartridge%20EULA-10b981?style=for-the-badge)](./LICENSE.md)

**BMAD 2.0** is an AI-assisted **project scoping studio** for **Mnemosyne OS**. It turns a raw idea into a structured, validated *cadrage* — **B**rief, **M**apping, **A**rchitecture, **D**elivery — and then generates the documents from it: Markdown specs, SVG architecture diagrams, and HTML slide decks. A copilot assists every field, and every project is archived into your sovereign vault.

> [!IMPORTANT]
> **BMAD 2.0 is a cartridge — it runs inside Mnemosyne OS.** Install the host app first, then load this cartridge from MnemoHub (or link it in dev mode).
>
> [![Download latest release](https://img.shields.io/badge/⬇%20Download-Mnemosyne%20OS%20latest-0ea5e9?style=for-the-badge)](https://github.com/yaka0007/Mnemosyne-Neural-OS/releases/latest) &nbsp; [![Mnemosyne OS repository](https://img.shields.io/badge/GitHub-Mnemosyne%20OS-181717?style=for-the-badge&logo=github)](https://github.com/yaka0007/Mnemosyne-Neural-OS)

![BMAD 2.0 welcome — with the Mnemosyne AI copilot](./docs/images/landing.png)

---

## ✨ Key Capabilities

### 🧭 1. The BMAD method — one structured cadrage
Four linked tabs take a project from intent to plan: **01. Brief** (objective, problem, MVP scope), **02. Mapping** (actors, resources, risks & dependencies), **03. Architecture**, and **04. Delivery**. Every field has a one-click **✨ Assister** button that drafts or sharpens it with the model.

![The Brief · Mapping · Architecture · Delivery editor, with AI assist on every field](./docs/images/cadrage.png)

### 🧱 2. Guided foundations
Start from a clean identity card — name, version, short description, project category (Software, Blockchain, Business, Shop, Creative, Event…) and resonance hashtags — so every cadrage is referenceable later.

![Project foundations](./docs/images/foundations.png)

### 🤖 3. A copilot at your side
A persistent **Mnemosyne AI** sidebar helps you draft your brief in plain language, while per-field assist and an **AI critical review** hunt for the technical blind spots before you commit.

### 🚀 4. Delivery & generation
Compile the cadrage into your active vault, run the **critical review**, and generate the deliverables: project **Markdown documents**, an **SVG architecture diagram**, or an **interactive HTML slide deck** — all built from your BMAD scoping.

![Delivery — file generation, critical review, SVG diagrams and slide decks](./docs/images/delivery.png)

### 🌍 5. Trilingual, host-synced
Full **EN / FR / ES** UI, kept in sync with the Mnemosyne OS host language.

---

## 🧠 Connected to the Mnemosyne OS Core

BMAD 2.0 is not a standalone form with an AI button bolted on — it's a **cartridge that plugs straight into the Mnemosyne OS intelligence engine**. The split is deliberate:

- **BMAD owns the data.** Your project cadrages — briefs, mappings, architecture, delivery plans — the sovereign design memory of *your* ideas. They live locally and are never sent to a third-party server.
- **Mnemosyne OS owns the intelligence.** Every cadrage is compiled into a vectorized *chronicle* inside a **walled app-sandbox vault** — isolated from the rest of your memory until you decide otherwise. From there the core engine powers the studio:
  - **The AI copilot & per-field assist** — draft an objective, sharpen a risk list, or run a full critical review with a model that runs on your machine.
  - **Document & diagram generation** — turn the cadrage into Markdown specs, SVG architecture diagrams, and HTML slides.
  - **Semantic recall (RAG)** — 768-dimensional embeddings let past projects be found and reused by *meaning*.

The intelligence comes **to** the data; the data never leaves your machine (an optional cloud model kicks in only when you choose it — for richer diagrams and slides).

```mermaid
flowchart LR
    subgraph BMAD["🧭 BMAD 2.0 · your sovereign project cadrage"]
        DATA["📋 Brief · Mapping<br/>Architecture · Delivery"]
    end

    subgraph CORE["🧠 Mnemosyne OS Core · the intelligence engine"]
        VAULT[("🔒 App-Sandbox Vault<br/>walled · local-first")]
        EMB["🧮 Embeddings<br/>768-D vectors"]
        RAG["🔍 RAG retrieval"]
        LLM["✨ AI copilot<br/>local-first / cloud"]
    end

    DATA ==>|"each cadrage → a chronicle"| VAULT
    VAULT ==> EMB ==> RAG
    LLM -->|"assist · critical review · doc & diagram generation"| DATA
    RAG -->|"recall past projects"| DATA
    RAG -.->|grounds| LLM

    classDef dataNode fill:#0c1e3a,stroke:#3b82f6,stroke-width:2px,color:#bfdbfe
    classDef vaultNode fill:#2e1065,stroke:#a78bfa,stroke-width:2px,color:#ede9fe
    classDef coreNode fill:#241a52,stroke:#8b5cf6,stroke-width:1.5px,color:#e9d5ff
    class DATA dataNode
    class VAULT vaultNode
    class EMB,RAG,LLM coreNode

    style BMAD fill:#0a1628,stroke:#3b82f6,stroke-width:2px,color:#93c5fd
    style CORE fill:#1a1340,stroke:#8b5cf6,stroke-width:2px,color:#c4b5fd
```

> Your project designs stay in the walled vault on your own machine — the core simply brings the intelligence to them. Nothing is sent to a third-party server.

---

## 🚀 Installation & Running

To run the cartridge in sandbox/development mode:

```bash
# Install dependencies
npm install

# Start the local dev server
npm run dev
```

The app starts at `http://localhost:5190/`. You can run it standalone or load it as a cartridge inside a **Mnemosyne OS** host instance (the vault archiving, model inference, and file export run host-side).

---

## ⚖️ License

Distributed under the **Mnemosyne OS Cartridge License**. You are free to inspect, modify, and customize the code as long as it executes and distributes within the **Mnemosyne OS** ecosystem.

For commercial use, redistribution outside the platform, or standalone hosting, please see the [LICENSE.md](./LICENSE.md) file.

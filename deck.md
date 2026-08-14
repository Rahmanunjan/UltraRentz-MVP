# ArcRent Demo Video — Practice Script

**Target length:** 3–4 minutes

---

## Shot 1 — Hook (0:00–0:20)

> "Rental deposits sit as dead capital for months, and getting them back at the end of a tenancy is slow, opaque, and often disputed. ArcRent puts the deposit on-chain, lets it earn yield, and releases it automatically — without a platform, a landlord, or a human agent deciding when to let go of the money."

**Visual:** Title card or face to camera.

---

## Shot 2 — Problem (0:20–0:40)

> "Today, a deposit is just money sitting in someone's account. There's no yield, no transparency, and settlement depends on trust — trust the landlord will pay it back, trust the platform will mediate fairly. ArcRent replaces that with rules encoded in a smart contract."

**Visual:** Bullet text overlay — "dead capital → disputed refunds → no automation."

---

## Shot 3 — Architecture (0:40–1:10)

> "Here's how it works. A tenant funds a deposit into our vault contract in USDC. That deposit earns yield while the tenancy runs. When the lease is eligible for release, an autonomous agent — a script we built that runs independently, with no human triggering it — calls the contract to start the release. There's a mandatory delay window before funds actually move, so if anything looks wrong, there's time to catch it. The agent can never choose who gets paid or how much — that's always determined by the lease terms on-chain, never by the caller."

**Visual:** README architecture section, or a boxes-and-arrows sketch: Tenant → Vault → Agent → Delay → Release.

---

## Shot 4 — Live proof: deposit and yield (1:10–1:45)

**Screen recording, terminal + ArcScan.**

> "Let me show you this live on Arc Testnet. Here's Lease 2 — already created and funded."

**Action:** Run `cast call $VAULT "pendingYield(uint256)(uint256)" $LEASE_ID --rpc-url $RPC`. Point at the number on screen (confirmed reading: **14**, which at USDC's 6 decimals is 0.000014 USDC).

> "pendingYield is returning a real number here — small, because this is a short demo window, but nonzero and accruing entirely on-chain. That's real, verifiable yield — no manual calculation, no off-chain trust."

**Honesty line — say this plainly, once, no hedging:**

> "To be transparent: right now this yield is paid from a reserve we fund as the contract owner, not from an external DeFi protocol yet. The calculation and payout are fully on-chain and verifiable — integrating a real external yield source is our clearly identified next step, not something we're claiming already exists today."

---

## Shot 5 — Live proof: autonomous release (1:45–2:30)

> "Now here's the part that matters most for the Agentic Economy track — this next step happens with zero human input."

**Action:** Show the agent terminal (live log or captured recording of it firing). Point at the moment it calls `requestRelease` and, after the delay window, `executeRelease`.

> "No one clicked a button. The agent detected the lease was eligible and executed the release on its own."

**Action:** Switch to ArcScan, refresh, show the confirmed transaction.

> "Here's the transaction. `DepositReleased` fired, and yield was paid out alongside the principal — both events, one autonomous transaction."

*(If Lease 2's agent run hasn't happened live by recording time, use the fallback instead: "We proved this exact flow running fully unattended earlier — here's that transaction," and show `0xc1f54dac2d2e7707821f1e23c5c7322860bee159c0e7d22865fe4a0df4a03b76` on ArcScan.)*

---

## Shot 6 — Security model (2:30–2:50)

> "This works safely because the agent has no custody and no discretion. Recipients and amounts always come from the lease state, never from whoever calls the function. Disputes go through a defined path — a tenant can dispute a landlord's claim, and an independent arbiter resolves it, constrained so funds can never be created or destroyed by that decision."

**Visual:** Security bullet list from README (Ownable2Step, Pausable, ReentrancyGuard, SafeERC20, delayed admin transitions).

---

## Shot 7 — Validation and close (2:50–3:20)

> "We validated demand with students at the University of Hertfordshire — 40 signups in a single day for exactly this: fast automated deposit release, and earning yield while it's held. This hackathon build proves the core thesis end-to-end on Arc: a deposit that's held, earns yield, and settles itself. Next up is our pilot launch on the 17th of August, followed by real external DeFi yield integration and richer dispute tooling."

> "This is ArcRent — deposits that manage themselves. Thanks for watching."

**Visual:** End card — project name, repo link, ArcScan link.

---

## Reminders while practicing

- Confidence, no hedging, on what's built and proven (autonomy, escrow, on-chain yield mechanism).
- Plain honesty, stated once, on what's not yet built (external yield source, multisig, recurring rent) — don't repeat the caveat.
- If running long: trim Shot 2 and Shot 6 to one line each. Don't cut Shots 4–5 — they're your strongest evidence.
- Terminal font large, notifications off, ArcScan tab pre-loaded on the contract address.
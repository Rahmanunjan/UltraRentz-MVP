# xrent — Final Video Script (90s)
### Teleprompter-ready — print or keep on second screen

---

## SHOT 1 — 0:00–0:15 — SLIDE 1 (title)

> "xrent holds rental deposits on-chain, lets them earn yield, and releases them automatically — no platform, no landlord, no human deciding when funds move. It's already proven on Arc testnet with USDC. For this hackathon, we extended it to Flare — accepting FXRP as a deposit asset."

---

## SHOT 2 — 0:15–0:30 — SLIDE 5 (Flare Integration)

> "Same audited contract, unmodified — just pointed at a different asset on a different chain. That's the interoperability story."

---

## SHOT 3 — 0:30–1:10 — TERMINAL → pivot to EXPLORER at 1:05

| Time | Action | Say |
|------|--------|-----|
| 0:30 | Run balance check (`cast call ... balanceOf`) | *(silent — just let the FXRP balance show on screen)* |
| 0:33 | — | "Real FXRP, live on Coston2 testnet." |
| 0:40 | Run `createLease` | "First, we create the deposit record on-chain — tenant, landlord, amount, and the tenancy window, all written into the contract." |
| 0:50 | Run `approve` | "Before the vault can pull funds, we approve it to spend FXRP on our behalf — standard ERC-20 practice." |
| 0:58 | Run `fundLease` | "And funding — the vault pulls the FXRP and locks it in escrow. That's a live, funded deposit, earning yield from this point." |
| 1:05 | Cut to Coston2 Explorer, vault address page | "Here it is, confirmed on-chain — both transactions, real FXRP." |

---

## SHOT 4 — 1:10–1:30 — SLIDE 6 (Existing vs. New)

> "To be clear about scope: this proves the deposit and funding cycle end to end. The autonomous release — already proven fully unattended on our Arc deployment — is our next step on this chain, not yet re-run here. This is xrent, built by UltraRentz."

---

### Before you hit record:
- Terminal font size large enough to read on camera; scrollback cleared so only relevant output shows
- Explorer tab pre-loaded and ready to alt-tab into at 1:05, not typed live
- `$LEASE_HASH`, `$START`, `$END` env vars already set so the command doesn't stall on-camera
- Do NOT `cat .env` or show it on camera/scrollback — it contains your private key
- Load your key off-camera before recording (keystore via `cast wallet import` is safer than a raw `--private-key` flag)
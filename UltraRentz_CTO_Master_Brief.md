# ArcRent (formerly UltraRentz) - CTO Master Brief
Last updated: 12 August 2026, final sprint to deadline

## READ THIS FIRST
Deadline: Wed 12 Aug 2026, 13:00 UK time (late submission, email giles@encode.club, subject "Late submission - ArcRent"). Also feeds the real pilot launch 17 August 2026.

## THE ONE THING THIS SUBMISSION MUST PROVE
"A rental deposit can be held in USDC on Arc, earn verifiable on-chain yield, and be released autonomously by an AI agent under a non-custodial security model - genuinely qualifying for both DeFi and Agentic Economy tracks."

## CRITICAL DECISION: ArcLend investigation REJECTED, do not revisit
A separate/prior session produced a "brief" claiming discovery and verification of a lending protocol called "ArcLend" on Arc testnet, with specific addresses, ABIs, and on-chain economics data. Web search found NO independent evidence ArcLend exists - Circle's own materials name Aave, Maple, and Morpho as Arc's lending partners, not ArcLend. The "verified" data in that document was never produced by the user running and pasting real commands (unlike every other verified fact in this project). Strong likelihood this was fabricated/hallucinated by another AI session. DECISION: do not pursue ArcLend integration. Do not revisit this. Submit the honest, proven, reserve-funded system as-is.

## MAJOR MILESTONE ACHIEVED: fully autonomous release proven on-chain
scripts/agent.ts ran unattended and autonomously called executeRelease on its own, zero manual triggering, at 10:46:49 UTC 11 Aug. Confirmed tx: 0xc1f54dac2d2e7707821f1e23c5c7322860bee159c0e7d22865fe4a0df4a03b76
- DepositReleased event confirmed: full 5 USDC principal returned to tenant
- YieldPaid did NOT fire - correct/expected, lease only ran ~60-90s so 5% APY over that window rounds to 0 in integer math
- NEXT DEMO LEASE (Lease 2, not yet created) should use a LONGER duration so yield is visibly nonzero for the video

## CURRENT LIVE contract (Arc Testnet) - final, no more redeployments
- Address: 0x12a69815D9fF4C7DB6f84852f46CF09325daEeBD
- Agent wallet: 0xaECFfCE7c8f3F9cC823Ce6e10E7C1C42F8603E26 (key in .env as AGENT_PRIVATE_KEY, confirmed working)
- Main wallet (tenant/landlord/owner/arbiter): 0xb415e2C17c135F8Ec7560b59506edd1BD7A64F12 (key in .env as PRIVATE_KEY)
- Yield reserve funded with ~0.5 USDC
- Lease 1: fully complete (created, funded, released, zero yield paid - expected)
- Network: Arc Testnet, chain ID 5042002, RPC: https://rpc.testnet.arc.network
- Explorer: https://testnet.arcscan.app/address/0x12a69815D9fF4C7DB6f84852f46CF09325daEeBD

## Env vars (re-export fresh each terminal session - use ^ anchor on grep to avoid AGENT_PRIVATE_KEY/PRIVATE_KEY collision)
export RPC="https://rpc.testnet.arc.network"
export USDC="0x3600000000000000000000000000000000000000"
export MY_ADDRESS="0xb415e2C17c135F8Ec7560b59506edd1BD7A64F12"
export VAULT="0x12a69815D9fF4C7DB6f84852f46CF09325daEeBD"
export PRIVATE_KEY=$(grep "^PRIVATE_KEY=" .env | cut -d '=' -f2 | tr -d '\r\n ')
export AGENT_PRIVATE_KEY=$(grep "^AGENT_PRIVATE_KEY=" .env | cut -d '=' -f2 | tr -d '\r\n ')

## Repo
- https://github.com/UltraRentz/UltraRentz-MVP/tree/hackathon-active (public, confirmed working in incognito)
- STILL NEEDS: README.md updated with current contract address 0x12a69815D9fF4C7DB6f84852f46CF09325daEeBD - NOT YET DONE

## Frontend status
Pre-existing components: DepositForm.tsx, LoginCard.tsx, RentPaymentFlow.tsx, SuccessCard.tsx, YieldCalculator.tsx (not yet reviewed), plus an unrelated leftover YieldCalculatorHero.tsx describing a DIFFERENT product (Avalanche-based, West Yorkshire unis, 8.2% APY) - do not use its content, flag for deletion later.
Auth provider: Privy (usePrivy/useWallets), not Particle.
- DONE: RentPaymentFlow.tsx rewritten (was broken/duplicate code) - Privy-based, points at real contract, calls createLease->approve->fundLease, renders DepositForm+SuccessCard. Has hardcoded DEMO_LANDLORD_ADDRESS (=main wallet), documented in comments.
- DONE: DepositForm.tsx assessed - mostly fine, just needs selectedStrategy to always be the single FIXED_STRATEGY (5% APY) object, no strategy-picker UI needed.
- DONE: LoginCard.tsx rewritten for Privy (was using old useParticleAuth hook).
- DONE: SuccessCard.tsx was empty, now has real content.
- NOT YET REVIEWED: YieldCalculator.tsx (the real one referenced by DepositForm, distinct from YieldCalculatorHero.tsx)
- Frontend is NOT required for hackathon submission (ArcScan satisfies "live demo link"). LOWEST PRIORITY today - do after video/deck/submission, not before.

## TODAY'S SEQUENCE (agreed with user)
1. [ ] Update README.md with current contract address, commit + push
2. [ ] Record demo video (biggest remaining gap) - create a fresh LONGER-duration Lease 2 first so yield is visibly nonzero, capture live using video_script.md + Samson Q2U mic + Elgato Neo light
3. [ ] Format deck_content.md into an actual slide deck
4. [ ] Draft + send late submission email to giles@encode.club, subject "Late submission - ArcRent", before Wed 12 Aug 13:00 UK. Include: team names/emails (incl. Encode registration email - USER MUST PROVIDE), what was built (honest framing, no ArcLend), repo link, video link, deck link, live demo link (ArcScan), both tracks (DeFi + Agentic Economy)
5. [ ] LOWEST PRIORITY, only if time remains: finish frontend, deploy to Vercel

## Honest scope framing (use in deck/video/email, do not overclaim)
BUILT AND PROVEN: deposit escrow, automated non-custodial release, genuinely autonomous agent-triggered execution (proven unattended), on-chain yield payout mechanism (owner-funded reserve, explicitly NOT external DeFi yield - be honest about this)
NOT BUILT (roadmap only): recurring rent payments, 4-of-6 multisig, ERC-4626 vault, "passport" deposit to next tenancy, real external yield protocol integration

## Business validation (for deck/pitch)
University of Hertfordshire: 40 signups in one day. Validated USP: quick/automated release of rent deposits at end of tenancy + earning yield during tenancy. Confirms keeping MVP simple was the right call.

## Known minor issues, not blocking
- src/hooks/useParticleAuth.ts, src/lib/usePartcle.ts, YieldCalculatorHero.tsx (wrong product) still in repo, cosmetic cleanup only
- fundLease() has no double-funding guard, acceptable for MVP
- 66 npm audit vulnerabilities on ethers install - standard, do not fix now

## Session continuity rule
Update this file at natural checkpoints without being asked. Paste this file into any new session to resume immediately.
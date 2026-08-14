# xrent

Interoperable rental deposits, on Flare.

xrent is a non-custodial escrow protocol for rental deposits. Deposits are locked on-chain, earn yield during the tenancy, and are released automatically according to on-chain rules and an autonomous agent — not by trusting a platform. The protocol was originally built and proven on Arc (Circle's stablecoin-native L1) with USDC; this branch ports it to Flare, accepting **FXRP** — Flare's trust-minimized representation of XRP via FAssets — as the deposit asset.

Built for **Flare Summer Signal**, targeting **Bounty 1 — Interoperable Asset Products**.

## Target User

Tenants and landlords who currently hold rental deposits in slow, opaque, dispute-prone third-party schemes — and, more broadly, any FAssets holder (starting with XRP holders via FXRP) who wants their asset to do something productive rather than sit idle in a scheme.

## The Problem

Rental deposits sit as dead capital for the length of a tenancy, and settlement at the end is often slow, opaque, and disputed. Across the UK, Ireland, the Netherlands, Switzerland, and South Korea, roughly 1 in 4 renters struggle to get their full deposit back, and most deposit-scheme funds earn no interest for the tenant. Settlement depends on trust — trust the landlord, trust the scheme.

## Demo & Submission Links

- **Demo video:** https://www.loom.com/share/f490768b32c94e368e50aa19332fe95d
- **Presentation deck:** https://docs.google.com/presentation/d/1cIbqSouhMri6HC8QAwS_jRNPutf6QZh4
- **GitHub repo (this branch):** https://github.com/UltraRentz/UltraRentz-MVP/tree/xrent
- **Live contract (Coston2 testnet):** https://coston2-explorer.flare.network/address/0x0e86AA71fF2940F225a09307D54d28B47Dde1E49
- **Original Arc deployment (prior work):** https://testnet.arcscan.app/address/0x12a69815D9fF4C7DB6f84852f46CF09325daEeBD

## The Solution

xrent replaces "trust the landlord" or "trust the platform" with "trust the rules encoded in the contract."

- Deposits are locked in USDC (Arc) or FXRP (Flare) in an on-chain escrow tied to a specific deposit record.
- The deposit earns yield while held.
- A genuinely autonomous AI agent — a separate, independently-running script watching on-chain state — triggers release when a deposit record qualifies, with no human involved. The agent cannot choose the recipient or the amount; those are always derived from on-chain deposit-record state, never from the caller.
- Landlord claims go through a defined dispute path: submit, then tenant accepts or disputes, then an independent arbiter resolves disputed claims, constrained so funds can never be created or destroyed by the arbiter's decision.
- AI-triggered releases carry a mandatory delay window before execution, giving the protocol time to detect and dispute unexpected behavior before funds move.

## Why Flare + FXRP

Flare's core thesis is unlocking DeFi for assets that don't have native smart contracts, starting with XRP through FAssets. A rental deposit is exactly the kind of asset that benefits from this: it's currently locked in an unaccountable, non-programmable pot regardless of what it's denominated in. By accepting FXRP, xrent lets XRP holders put a real-world asset — their deposit — to work in a programmable, non-custodial contract, with the same audited logic already proven on Arc. FXRP's address is resolved dynamically via Flare's official `FlareContractRegistry`, never hardcoded, and its 6 decimals matched USDC's exactly — making this a genuine zero-code-change deployment onto a new chain and asset.

## Architecture

Tenant funds the deposit vault, scoped per deposit record. Yield accrues while held. Landlord submits claims against the deposit if needed. The autonomous agent script calls `requestRelease` when a deposit record becomes eligible, which starts a delay window, after which `executeRelease` can be called by anyone — this is when principal and any accrued yield are paid out together. Arbiter calls `resolveDispute`, only when a claim has been disputed.

### Contract: RentDepositVault.sol

- **Deposit-record lifecycle:** `createLease`, then `fundLease`, then optionally `submitClaim` followed by `acceptClaim` or `disputeClaim` followed by `resolveDispute`, then `requestRelease` (delay window), then `executeRelease`. (Function names retain their original `Lease` naming in code; externally, these represent deposit records, not legal tenancy agreements.)
- **Yield:** A fixed rate (5% simulated APY) calculated transparently on-chain via `pendingYield()`, paid from a reserve the contract owner funds via `fundYieldReserve()`. This is an honest, on-chain, verifiable demo mechanism — not yet a real external DeFi yield integration. That's a clearly identified next step, not something we're claiming already exists.
- **Security:** Ownable2Step, Pausable, ReentrancyGuard, SafeERC20, and delayed admin role transitions where agent and arbiter changes take twenty four hours to take effect.
- **Non-custodial by design:** Recipients and amounts are always derived from on-chain deposit-record state, never supplied by the caller. No role can redirect funds to an arbitrary address.
- **Asset-agnostic by design:** The contract treats the deposit token as a generic ERC-20, which is what made the FXRP deployment a configuration change rather than a rewrite.

### Autonomous agent: scripts/agent.ts

A standalone script that independently polls the contract, decides when a deposit record is eligible for release, and calls `requestRelease` / `executeRelease` on its own — no human triggers it. This has been proven running fully unattended on Arc Testnet with USDC. Run with: `npx ts-node scripts/agent.ts` (requires `AGENT_PRIVATE_KEY` in your environment).

## Deployed Contract on Coston2 (Flare testnet)

- **Vault address:** `0x0e86AA71fF2940F225a09307D54d28B47Dde1E49`
- **FXRP token address:** `0x0b6A3645c240605887a5532109323A3E12273dc7` (resolved via `FlareContractRegistry`)
- **Network:** Flare Coston2 testnet, chain ID 114
- **RPC:** `https://coston2-api.flare.network/ext/C/rpc`
- **Explorer:** https://coston2-explorer.flare.network/address/0x0e86AA71fF2940F225a09307D54d28B47Dde1E49

## Proof: Real FXRP Deposit Created and Funded On-Chain

A real FXRP deposit record has been created and funded on Coston2 — not a mock, not a simulation. 5 FXRP funded, confirmed on-chain. The fully unattended autonomous release cycle (already proven on Arc with USDC) is the next step for this deployment — see Roadmap.

## Running Locally

Requires [Foundry](https://getfoundry.sh).

Clone the repository, check out the `xrent` branch, then run: `forge install`, `forge build`, `forge test`.

### Deploying

Run `forge create` on `src/contracts/RentDepositVault.sol:RentDepositVault`, with the broadcast flag, the RPC URL set to the Coston2 RPC, the private key, and constructor args set to the FXRP token address, the agent address, and the arbiter address, in that order.

### Interacting (Example: Create and fund a deposit record)

Call `createLease` on the vault address with signature `createLease(address,address,bytes32,uint256,uint256,uint256,uint256)`, passing tenant, landlord, deposit-record hash, deposit amount, start time, end time, and claim period, signed with the private key, against the Coston2 RPC.

Then call `fundLease` on the vault address with signature `fundLease(uint256)`, passing the deposit-record id, signed with the private key, against the RPC.

### Running the Autonomous Agent

`cd` into the project, run `npm install ethers` and `npm install -D ts-node typescript @types/node`, then `npx ts-node scripts/agent.ts` with `AGENT_PRIVATE_KEY` set in your environment. It will poll the contract and autonomously request and execute releases as deposit records become eligible.

## Business Validation

Piloted the concept at the University of Hertfordshire and received 40 signups in a single day. The validated core appeal: fast, automated deposit release at the end of tenancy, and earning yield on the deposit while it's held — the exact mechanism this project proves on-chain, now extended to a second chain and asset.

## What Existed Before This Program vs. What's New

**Before this program:** The full xrent protocol — deposit escrow, autonomous agent release, on-chain yield mechanism, and dispute-path design — all built and proven on Arc testnet with USDC, including a fully unattended autonomous release cycle.

**New this program:** A second deployment of the same audited contract on Flare's Coston2 testnet, configured for FXRP after verifying decimal compatibility and resolving the token address through Flare's official registry. A full deposit-record creation-and-funding cycle was executed and confirmed on-chain with real FXRP.

## Roadmap

Next: prove the fully unattended autonomous release cycle on the FXRP/Coston2 deployment (already proven on Arc, not yet re-run here); add FXRP as a deposit option in the frontend alongside USDC; explore real external yield generation for FXRP deposits within the Flare DeFi ecosystem; feed real launch usage data back into which deposit assets users actually want. Official pilot launch: 17 August 2026 across Universities in West Yorkshire (University students experience the biggest pain point).

## License

MIT
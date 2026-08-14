# Flare Summer Signal — Submission Draft

## Project name
xrent (built by UltraRentz)

## Selected bounty
Interoperable Asset Products

## Short product description
xrent is a non-custodial escrow protocol for rental deposits. A tenant's deposit is held on-chain, earns yield during the tenancy, and is released automatically by an autonomous agent under a non-custodial security model — no platform, landlord, or human deciding when to release funds. For this hackathon, xrent's deposit mechanism was extended to accept FXRP (Flare's trust-minimized representation of XRP via FAssets) as a deposit asset alongside its existing USDC support, proven with a real, funded lease on Coston2 testnet.

## Target user
Renters and landlords — starting with UK university students, where the product was piloted (University of Hertfordshire, 40 signups in a single day) ahead of a live launch across six UK universities beginning 17 August 2026. This is not a narrow or local problem: Generation Rent's own 2025 survey of UK renters found that around a quarter struggle to get their full deposit back at the end of a tenancy, with roughly £5.4bn currently sitting in UK deposit protection schemes and only about half of tenants entitled to any interest on that money at all. Renter advocacy groups report the same pattern as a normal, systemic experience in Ireland, with disputes routed through a slow formal process that discourages most renters from ever challenging an unfair deduction — and comparable reporting shows the same underlying issue recurring across the Netherlands, Switzerland, and South Korea. xrent replaces "trust the landlord, trust the scheme" with rules encoded on-chain: the deposit earns yield instead of sitting idle, and release is automatic and non-custodial rather than dependent on a landlord's cooperation or a slow dispute process. Extending deposit support to FXRP additionally opens the product to XRP holders who want their holdings to be productive (earning yield) while serving as rental collateral, without leaving the XRP ecosystem's value proposition behind.

## Demo link, video, or working app link
[Add Loom link once recorded]

## GitHub repo or technical materials
https://github.com/UltraRentz/UltraRentz-MVP/tree/xrent

## How the project uses Flare
xrent's escrow contract (`RentDepositVault.sol`) was deployed a second time on Flare's Coston2 testnet, configured to accept FXRP — Flare's FAssets representation of XRP — as the deposit token, using the same lease-based escrow logic already proven on Arc with USDC. The FXRP token address was resolved dynamically via Flare's official `FlareContractRegistry` (not hardcoded, per Flare's own integration guidance): `registry.getContractAddressByName("AssetManagerFXRP")`, then that AssetManager's `.fAsset()`. A full lease cycle was executed on-chain with real FXRP: a lease was created, the vault was approved, and the lease was funded with 5 FXRP — all confirmed successful on Coston2.

## What was newly built, ported, integrated, or improved during the program
**Existed before the hackathon:** the full xrent protocol — deposit escrow (`RentDepositVault.sol`), the autonomous agent release mechanism (`scripts/agent.ts`), the on-chain yield mechanism, and the dispute-path design — all built and proven on Arc testnet with USDC, including a fully unattended autonomous release cycle.

**Newly built/ported during this program:** a second deployment of the existing, audited `RentDepositVault.sol` contract on Flare's Coston2 testnet, configured to accept FXRP instead of USDC as the deposit asset. This required verifying FXRP's decimal precision matched the contract's existing assumptions (confirmed: 6 decimals, identical to USDC — a genuine zero-code-change deployment), and resolving the correct FXRP token address via Flare's official contract registry rather than a hardcoded address. A full lease-creation-and-funding cycle was then executed and confirmed on-chain with real FXRP, proving the integration works end to end, not just in theory.

**Why this is meaningful:** it demonstrates that xrent's core escrow logic is asset-agnostic by design — the same audited contract, unmodified, can secure value denominated in a completely different underlying asset (XRP via FAssets) on a completely different chain, without rewriting any core logic. For Flare and the FAssets ecosystem, it's a concrete example of FXRP being used as productive collateral in a real-world use case (rental deposits) outside of pure DeFi trading/yield contexts.

## Smart contract addresses / deployment details
- Deployed on: **Flare Testnet Coston2**
- Vault contract (FXRP-configured): `0x0e86AA71fF2940F225a09307D54d28B47Dde1E49`
- FXRP token address (resolved via FlareContractRegistry): `0x0b6A3645c240605887a5532109323A3E12273dc7`
- Deployment tx: `0x8a89a853c27731a0bdbae4c61b75c2121fa92b0c06bf592ea187dfc10036beb2`
- Example proven lease cycle: createLease tx `0xf4798b621c4ab118f8594845be529c7bf8e9264458f2e9a97ee571188243623b`; approve + fundLease tx `0xb377c2aa2f579e4c5a1c0d43d341fc168996e4fb17fb08ff48589fae2f969405` (5 FXRP funded, lease ID 1)
- Explorer: https://coston2-explorer.flare.network/address/0x0e86AA71fF2940F225a09307D54d28B47Dde1E49

## Short roadmap / next steps
- Bring the FXRP-accepting vault's autonomous release cycle to the same fully-unattended, on-chain-proven standard already achieved on Arc with USDC.
- Extend the frontend deposit flow to let users choose FXRP as a deposit option alongside USDC.
- Explore real external yield generation for FXRP deposits (e.g. via existing FXRP yield protocols in the Flare ecosystem), replacing the current owner-funded reserve model used for the USDC path.
- Continue the live pilot launch across six UK universities beginning 17 August 2026, gathering real usage data to inform which deposit assets (USDC, FXRP, or others) users actually want.

## Additional context (encouraged, not required)
- **Network:** Coston2 testnet.
- **Traction:** University of Hertfordshire pilot validated demand (40 signups in one day) for the core product; live launch across six UK universities begins 17 August 2026, immediately following this hackathon window.
- **Honesty note:** the FXRP integration proves deposit and funding end to end. The autonomous release cycle — already proven unattended on the USDC/Arc deployment — has not yet been re-run on this specific FXRP lease; that is explicitly named above as a next step, not claimed as already complete on this chain.
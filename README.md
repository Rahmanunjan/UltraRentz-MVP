### ArcRent

Rental deposits, turned into programmable money.

ArcRent is a non-custodial escrow protocol for rental deposits, built on Arc, Circle's stablecoin-native L1. Deposits are held in USDC, earn yield during the tenancy, and are released automatically according to on-chain rules and an autonomous agent - not by trusting a platform.

Built for the Programmable Money Hackathon (Arc / Circle), targeting both the DeFi and Agentic Economy tracks.

### The problem
-----------

Rental deposits sit as dead capital for the length of a tenancy, and settlement at the end is often slow, opaque, and disputed. Cleaning, damage, and arrears claims routinely turn a simple refund into a drawn-out disagreement with no clear process.

### The solution
------------

ArcRent replaces "trust the landlord" or "trust the platform" with "trust the rules encoded in the contract."

-   Deposits are locked in USDC in an on-chain escrow tied to a specific lease.
-   The deposit earns yield during the tenancy.
-   A genuinely autonomous AI agent - a separate, independently-running script watching on-chain state - triggers release when a lease qualifies, with no human involved. The agent cannot choose the recipient or the amount; those are always derived from lease state, never from the caller. This makes agent-triggered settlement safe without giving the agent custody or arbitrary power, directly satisfying the Agentic Economy track's requirement for genuine autonomy without a human in the loop.
-   Landlord claims go through a defined dispute path: submit, then tenant accepts or disputes, then an independent arbiter resolves disputed claims, with the resolution constrained so funds can never be created or destroyed by the arbiter's decision.
-   AI-triggered releases carry a mandatory delay window before execution, giving the protocol time to detect and dispute unexpected behavior before funds move.

### Why Arc plus USDC
-----------------

Arc settles in sub-seconds with USDC as the native gas and settlement asset. Deposits, gas, and payouts all happen in the same unit of account, with no bridging or wrapping required. That is what makes programmable rent viable rather than theoretical.

### Architecture
------------

Tenant funds the RentDepositVault, which is a USDC escrow scoped per lease. Yield accrues during the tenancy. Landlord submits claims against the deposit if needed. The autonomous agent script calls requestRelease when a lease becomes eligible, which starts a delay window, after which executeRelease can be called by anyone - this is when principal and any accrued yield are paid out together. Arbiter calls resolveDispute, only when a claim has been disputed.

### Contract: RentDepositVault.sol

-   Lease lifecycle: createLease, then fundLease, then optionally submitClaim followed by acceptClaim or disputeClaim followed by resolveDispute, then requestRelease (one hour delay), then executeRelease.
-   Yield: a fixed rate (5% simulated APY) calculated transparently on-chain via pendingYield(), paid from a reserve the contract owner funds via fundYieldReserve(). This is an honest, on-chain, verifiable demo mechanism - not yet a real external DeFi yield integration. That's the clearly identified next step, not something we're claiming already exists.
-   Security: Ownable2Step, Pausable, ReentrancyGuard, SafeERC20, and delayed admin role transitions where agent and arbiter changes take twenty four hours to take effect.
-   Non-custodial by design: recipients and amounts are always derived from lease state, never supplied by the caller. No role can redirect funds to an arbitrary address.

### Autonomous agent: scripts/agent.ts

A standalone script that independently polls the contract, decides when a lease is eligible for release, and calls requestRelease / executeRelease on its own - no human triggers it. This has been proven running fully unattended on Arc Testnet. Run with: npx ts-node scripts/agent.ts (requires AGENT_PRIVATE_KEY in your environment).

### Deployed contract on Arc Testnet
--------------------------------

-   Address: 0x12a69815D9fF4C7DB6f84852f46CF09325daEeBD
-   Network: Arc Testnet, chain ID 5042002
-   RPC: https://rpc.testnet.arc.network
-   USDC: 0x3600000000000000000000000000000000000000, Arc's native gas token, ERC-20-compatible
-   Explorer: https://testnet.arcscan.app/address/0x12a69815D9fF4C7DB6f84852f46CF09325daEeBD

### Proof: a full cycle, fully autonomous

A complete deposit-to-release cycle has been proven on-chain, including the agent script executing the final release entirely unattended, with no manual trigger. Transaction: 0xc1f54dac2d2e7707821f1e23c5c7322860bee159c0e7d22865fe4a0df4a03b76

Running locally
---------------

Requires Foundry (https://getfoundry.sh).

Clone the repository, then run: forge install, forge build, forge test.

### Deploying

Run forge create on src/contracts/RentDepositVault.sol:RentDepositVault, with the broadcast flag, the rpc-url set to the Arc testnet RPC, the private key, and constructor-args set to the usdc address, the agent address, and the arbiter address, in that order.

### Interacting (example: create and fund a lease)

Call createLease on the vault address with signature createLease(address,address,bytes32,uint256,uint256,uint256,uint256), passing tenant, landlord, lease hash, deposit amount, start time, end time, and claim period, signed with the private key, against the RPC.

Then call fundLease on the vault address with signature fundLease(uint256), passing the lease id, signed with the private key, against the RPC.

### Running the autonomous agent

cd into the project, npm install ethers, npm install -D ts-node typescript @types/node, then npx ts-node scripts/agent.ts with AGENT_PRIVATE_KEY set in your environment. It will poll the contract and autonomously request and execute releases as leases become eligible.

### Business validation
-------------------

Piloted the concept at the University of Hertfordshire and received 40 signups in a single day. The validated core appeal: fast, automated deposit release at the end of tenancy, and earning yield on the deposit while it's held - which is exactly the mechanism this MVP proves on-chain.

### Roadmap
-------

This hackathon build proves the core thesis: a rental deposit can be held, earn yield, and be programmatically and autonomously settled in USDC on Arc. Next is the official pilot launch on 17 August 2026, followed by: real external DeFi yield integration (replacing the current reserve-funded demo mechanism), recurring rent payments, richer dispute resolution, digital inventory evidence, and a "passport" mechanism to carry a released deposit into a tenant's next tenancy.

### License
-------

MIT
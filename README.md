# ArcRent
=======

Rental deposits, turned into programmable money.

ArcRent is a non-custodial escrow protocol for rental deposits, built on Arc, Circle's stablecoin-native L1. Deposits are held in USDC, released automatically according to on-chain rules, and disputes are resolved through a defined, non-arbitrary process, not by trusting a platform.

Built for the Programmable Money Hackathon (Arc / Circle), targeting both the DeFi and Agentic Economy tracks.

# The problem
-----------

Rental deposits sit as dead capital for the length of a tenancy, and settlement at the end is often slow, opaque, and disputed. Cleaning, damage, and arrears claims routinely turn a simple refund into a drawn-out disagreement with no clear process.

# The solution
------------

ArcRent replaces "trust the landlord" or "trust the platform" with "trust the rules encoded in the contract."

-   Deposits are locked in USDC in an on-chain escrow tied to a specific lease.
-   An AI agent role can trigger release, but cannot choose the recipient or the amount. Those are always derived from lease state, never from the caller. This makes agent-triggered settlement safe without giving the agent custody or arbitrary power, directly demonstrating the Agentic Economy track's requirement for genuine autonomy without a human in the loop, while remaining non-custodial.
-   Landlord claims go through a defined dispute path: submit, then tenant accepts or disputes, then an independent arbiter resolves disputed claims, with the resolution constrained so funds can never be created or destroyed by the arbiter's decision.
-   AI-triggered releases carry a mandatory delay window before execution, giving the protocol time to detect and dispute unexpected behavior before funds move.

# Why Arc plus USDC
-----------------

Arc settles in sub-seconds with USDC as the native gas and settlement asset. Deposits, gas, and payouts all happen in the same unit of account, with no bridging or wrapping required. That is what makes programmable rent viable rather than theoretical.

# Architecture
------------

Tenant funds the RentDepositVault, which is a USDC escrow scoped per lease. Landlord submits claims against the deposit. AI Agent calls requestRelease, which starts a delay window, after which executeRelease can be called. Arbiter calls resolveDispute, only when a claim has been disputed.

### Contract: RentDepositVault.sol

-   Lease lifecycle: createLease, then fundLease, then optionally submitClaim followed by acceptClaim or disputeClaim followed by resolveDispute, then requestRelease (one hour delay), then executeRelease.
-   Security: Ownable2Step, Pausable, ReentrancyGuard, SafeERC20, and delayed admin role transitions where agent and arbiter changes take twenty four hours to take effect.
-   Non-custodial by design: recipients and amounts are always derived from lease state, never supplied by the caller. No role can redirect funds to an arbitrary address.

# Deployed contract on Arc Testnet
--------------------------------

-   Address: 0x1E3229c141404B6758836882B62E41ee3e50c190
-   Network: Arc Testnet, chain ID 5042002
-   RPC: https://rpc.testnet.arc.network
-   USDC: 0x3600000000000000000000000000000000000000, Arc's native gas token, ERC-20-compatible
-   Explorer: https://testnet.arcscan.app/address/0x1E3229c141404B6758836882B62E41ee3e50c190

Running locally
---------------

Requires Foundry (https://getfoundry.sh).

Clone the repository, then run: forge install, forge build, forge test.

### Deploying

Run forge create on src/contracts/RentDepositVault.sol:RentDepositVault, with the broadcast flag, the rpc-url set to the Arc testnet RPC, the private key, and constructor-args set to the usdc address, the agent address, and the arbiter address, in that order.

### Interacting (example: create and fund a lease)

Call createLease on the vault address with signature createLease(address,address,bytes32,uint256,uint256,uint256,uint256), passing tenant, landlord, lease hash, deposit amount, start time, end time, and claim period, signed with the private key, against the RPC.

Then call fundLease on the vault address with signature fundLease(uint256), passing the lease id, signed with the private key, against the RPC.

# Roadmap
-------

This hackathon build proves the core thesis that a rental deposit can be held and programmatically settled in USDC on Arc. Next is the official pilot launch on 17 August 2026, adding digital inventory evidence, maintenance records, partial-deduction settlement, and a proper wallet-connect frontend.

# License
-------

MIT
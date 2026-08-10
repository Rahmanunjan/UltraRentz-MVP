# ArcRent (formerly UltraRentz) — CTO Master Brief
Last updated: 10 August 2026, mid-submission-window

## READ THIS FIRST
Deadline: Mon 10 Aug 2026, 12:59 PM GMT+1 — TODAY, ~3 hours or less remaining.
Do not restart architecture discussion. Do not reintroduce Particle, Aave, or Arbitrum.

## Actual current contract (this supersedes any older brief)
`RentDepositVault.sol` — NOT the Aave/Arbitrum version. Current contract has:
- Lease struct: tenant, landlord, leaseHash, deposit, startTime, endTime, claimDeadline, claimedAmount, status
- Roles: `aiAgent` (can only call requestRelease — cannot choose recipient/amount), `arbiter` (resolves disputes)
- Flow: createLease → fundLease → [submitClaim → acceptClaim/disputeClaim → resolveDispute] → requestRelease (1hr delay) → executeRelease
- Security: Ownable2Step, Pausable, ReentrancyGuard, SafeERC20, delayed agent/arbiter changes
- Deliberately supports BOTH hackathon tracks: escrow = DeFi, non-custodial AI agent role = Agentic Economy
- NO yield mechanism — decided against adding one this close to deadline (too risky untested). Yield is a roadmap slide only.

## Auth decision (final)
Particle Network abandoned entirely. Demo uses raw wallet (private key in `.env`, gitignored) via `cast`/Foundry directly — no frontend auth flow needed for the demo if time is short. `window.ethereum` + ethers.BrowserProvider as fallback if a UI wallet-connect is built.

## Arc network facts
- RPC: https://rpc.testnet.arc.network
- Chain ID: 5042002
- USDC: native gas token AND ERC-20-like, at `0x3600000000000000000000000000000000000000`
- Faucet: https://faucet.circle.com (select Arc Testnet)

## Progress so far
- [x] Wallet funded with 20 testnet USDC (confirmed via faucet tx)
- [ ] Confirm balance shows via `cast call ... balanceOf` — IN PROGRESS
- [ ] Confirm approve/transferFrom works on Arc's USDC (critical — unblocks fundLease())
- [ ] Deploy RentDepositVault.sol to Arc testnet
- [ ] Run flow via `cast send`: createLease → fundLease → requestRelease/dispute path
- [ ] Record 3-min demo
- [ ] Public repo + README
- [ ] Submit

## Immediate next action
Run: `cast call $USDC "balanceOf(address)(uint256)" $MY_ADDRESS --rpc-url $RPC`
Then retry approve + transferFrom test. Report output before doing anything else.

## Hard rule for remainder of session
No new features. No contract changes. No yield. No agent script unless everything above is done with time to spare. Ship what exists.
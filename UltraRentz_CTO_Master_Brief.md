# ArcRent — CTO MASTER BRIEF

Last updated: **11 August 2026, ~14:35 UK time**

Status:
**Autonomous release proven. ArcLend DeFi candidate identified. On-chain ArcLend verification is now the immediate priority. Lease 2 remains LOCKED.**

---

# READ THIS FIRST

## Official submission deadline

**Wednesday 12 August 2026, 13:00 UK time**

Late submission must be sent to:

giles@encode.club

Subject:

Late submission – ArcRent

Internal CTO deadline:

**Wednesday 12 August 2026, 11:00 UK time**

The submission also feeds the real pilot launch planned for:

**17 August 2026**

---

# 1. THE ONE THING THIS SUBMISSION MUST PROVE

Target submission thesis:

> A rental deposit can be held in USDC on Arc, earn verifiable on-chain DeFi yield, and be released autonomously by an AI agent under a non-custodial security model — genuinely qualifying for both the DeFi and Agentic Economy tracks.

However:

## CRITICAL HONESTY RULE

The current ArcRent vault contains a reserve-funded demonstration yield mechanism.

That is NOT equivalent to genuine external DeFi yield.

Therefore:

> Never describe the current 5% reserve mechanism as if tenant USDC is already earning 5% from a DeFi protocol.

If ArcLend is successfully verified and integrated, the claim may be upgraded to genuine lending yield.

If ArcLend cannot be safely integrated before submission:

> Submit the proven architecture honestly and identify the reserve-funded mechanism as a demonstration mechanism.

---

# 2. MAJOR MILESTONE — AUTONOMOUS RELEASE PROVEN

The autonomous agent successfully ran unattended and called:

executeRelease()

at:

**10:46:49 UTC, 11 August 2026**

Confirmed transaction:

0xc1f54dac2d2e7707821f1e23c5c7322860bee159c0e7d22865fe4a0df4a03b76

Confirmed:

- DepositReleased event fired
- Full 5 USDC principal returned to tenant
- Autonomous agent executed the transaction
- No manual release trigger was required

This is a genuine on-chain proof of the Agentic Economy component.

---

# 3. YIELD RESULT FROM LEASE 1

YieldPaid did NOT fire.

This was expected.

Lease 1 lasted approximately 60–90 seconds.

With:

5 USDC deposit

5% APY

60–90 seconds

USDC uses six-decimal integer accounting.

The calculated yield rounded down to zero.

This is NOT a contract failure.

However:

> The existing 5% APY mechanism is reserve-funded and therefore must not be presented as external DeFi yield.

---

# 4. PREVIOUS LEASE 2 PLAN — REPLACED

The original assumption was:

> Create a longer Lease 2 lasting several hours so the 5% APY mechanism produces visible yield.

This assumption has been rejected.

Reasons:

1. A few hours may still produce less than one USDC base unit on a 5 USDC deposit.
2. The current mechanism is reserve-funded.
3. A longer lease does not transform the mechanism into genuine DeFi.
4. The DeFi track requires a meaningful financial use case.

Therefore:

# LEASE 2 IS LOCKED

Do NOT create Lease 2 until:

1. ArcLend has been verified.
2. The USDC market has been inspected.
3. Current supply rate has been determined.
4. Liquidity has been determined.
5. Supply/withdraw functionality has been verified.
6. Security risks have been evaluated.
7. The integration architecture has been chosen.
8. Required deposit and duration have been calculated.

---

# 5. MAJOR NEW FINDING — ARCLEND

The ArcLend investigation has now identified a concrete Arc Testnet DeFi lending candidate.

Published package:

arclend-sdk@1.0.2

The package contains:

- ArcLendGaslessRouter ABI
- ArcLendVault ABI
- LendingPool ABI
- MockERC20 ABI
- MockPriceOracle ABI
- Arc Testnet deployment addresses

The package identifies:

Arc Testnet

Chain ID:

5042002

This is significant.

The DeFi investigation has moved from:

"Does an Arc DeFi protocol exist?"

to:

"Can ArcRent safely use the ArcLend USDC supply market?"

---

# 6. ARCLEND DEPLOYMENT ADDRESSES

SDK-provided Arc Testnet addresses:

LendingPool:

0xa9f33671Ec86ABc4636f78211e8A34b1F9939351

MockPriceOracle:

0x08472bB502afeaCD3DEC8A4E6a32bB84F275f179

GaslessRouter:

0x13dc799E50494dB89fE4f724966939572Dc858db

USDC:

0x3600000000000000000000000000000000000000

EURC:

0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a

USYC:

0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C

USDC ArcLend Vault:

0x702f34adc721b79D0fA14B59ddAA85C852d747cA

EURC ArcLend Vault:

0xf9CE4c8c67C2AC3D059DA423956c495858Ce0305

IMPORTANT:

These addresses are currently CANDIDATES.

They have NOT yet been approved for tenant funds.

Every relevant address must be verified directly on-chain before integration.

---

# 7. ARCLEND LENDINGPOOL — CRITICAL DISCOVERY

The LendingPool ABI exposes:

supply(address asset, uint256 amount)

withdraw(address asset, uint256 amount)

This is the fundamental mechanism required for a lending-based yield strategy.

The pool also exposes:

getMarketData(address asset)

which returns:

- isActive
- totalSupply
- totalBorrow
- supplyRate
- borrowRate
- utilizationRate
- ltv
- liquidationThreshold
- liquidityIndex
- borrowIndex
- availableLiquidity

This is highly valuable.

It means the actual USDC supply market can potentially be queried directly rather than relying on an arbitrary APY assumption.

---

# 8. ARCLEND USER POSITION DATA

The LendingPool also exposes:

getUserReserveData(address user, address asset)

Returning:

- currentSupply
- currentBorrow
- supplyRate
- borrowRate

This may allow ArcRent to demonstrate:

ArcRent Vault

↓

USDC supplied to ArcLend

↓

User reserve position

↓

Current supply rate

↓

Accrued lending yield

This would provide much stronger evidence for the DeFi track than the existing reserve mechanism.

---

# 9. ARCLEND INTEREST ACCOUNTING

The pool exposes:

- liquidityIndex
- borrowIndex
- lastUpdateTimestamp
- totalSupply
- totalBorrow
- reserveFactor
- protocolReserves

This suggests the protocol uses index-based lending accounting.

Therefore genuine lending yield, if operational, would be generated through the protocol's lending-market accounting rather than ArcRent simply calculating:

deposit × arbitrary APY × time

This distinction is critical.

---

# 10. ARCLEND MARKET STRUCTURE

The LendingPool exposes:

markets(address asset)

The returned market structure contains:

- isActive
- isPaused
- decimals
- baseRate
- slopeRate
- optimalUtilization
- excessSlopeRate
- ltv
- liquidationThreshold
- liquidationBonus
- liquidityIndex
- borrowIndex
- lastUpdateTimestamp
- totalSupply
- totalBorrow
- reserveFactor
- protocolReserves
- supplyCap
- borrowCap

This provides the information necessary to perform a meaningful market inspection.

---

# 11. IMPORTANT — ARCLEND IS NOT YET PROVEN SAFE

The existence of:

supply()

withdraw()

supplyRate

liquidityIndex

totalSupply

totalBorrow

does NOT automatically prove that the strategy is suitable.

We still need to verify:

1. USDC market is active.
2. USDC market is not paused.
3. USDC is the correct Arc Testnet USDC.
4. USDC supply liquidity exists.
5. Supply rate is non-zero.
6. Interest actually accrues.
7. Withdrawal works.
8. ArcLend Vault is correctly deployed.
9. ArcLend Vault uses the intended LendingPool.
10. ArcRent can recover principal.
11. ArcRent can recover accrued yield.
12. Tenant principal remains protected if ArcLend fails.
13. Protocol administration does not create unacceptable risk.

---

# 12. ARCLEND ERC-4626 VAULT

The SDK contains an ArcLendVault ABI.

The vault exposes ERC-4626-style functions:

deposit()

mint()

withdraw()

redeem()

previewDeposit()

previewMint()

previewWithdraw()

previewRedeem()

convertToAssets()

convertToShares()

totalAssets()

totalSupply()

It also exposes:

asset()

pool()

This is potentially very important.

A possible architecture is:

Tenant

↓

USDC

↓

ArcRent Vault

↓

ArcLend ERC-4626 Vault

↓

ArcLend LendingPool

↓

USDC lending

↓

Yield

However:

> Do not automatically choose the ERC-4626 vault.

We must first inspect its deployment, accounting, permissions and relationship with the LendingPool.

---

# 13. POTENTIAL ARC RENT DEFI ARCHITECTURE

Preferred conceptual architecture:

TENANT

↓

USDC

↓

ArcRent programmable vault

↓

ArcLend strategy

↓

LendingPool

↓

USDC lending

↓

Accrued lending yield

↓

ArcRent

↓

Programmable settlement

↓

AI Agent

↓

Tenant / Landlord

The critical architectural principle is:

> ArcRent remains the programmable settlement authority.

ArcLend is the external financial strategy.

The AI agent is the execution mechanism.

---

# 14. NON-CUSTODIAL SECURITY PRINCIPLE

The agent must NOT be presented as unrestricted custodian of tenant funds.

Preferred model:

AGENT

↓

authorised execution

↓

ARC RENT SMART CONTRACT

↓

contract-enforced lease rules

The smart contract remains the security boundary.

The AI agent cannot arbitrarily decide who receives funds.

---

# 15. ARCLEND ADMINISTRATIVE CONTROLS

The LendingPool ABI exposes Ownable functionality:

owner()

transferOwnership()

renounceOwnership()

The pool also exposes administrative functions:

addMarket()

setPaused()

setMarketPaused()

setSupplyCap()

setBorrowCap()

setOracle()

setProtocolFee()

setFeeCollector()

withdrawProtocolReserves()

These controls require explicit security review.

---

# 16. ARCLEND OWNERSHIP RISK

We must determine:

Who owns LendingPool?

Can the owner:

- Pause the entire protocol?
- Pause USDC?
- Change the oracle?
- Change protocol fees?
- Change supply caps?
- Change borrow caps?
- Withdraw protocol reserves?
- Add markets?

None of these functions automatically make ArcLend unsafe.

But they materially affect protocol risk.

---

# 17. ORACLE RISK

The pool exposes:

oracle()

and:

setOracle(address)

We must determine whether USDC supply positions are exposed to oracle failure or manipulation.

For pure lending supply this may be less critical than for borrowing/liquidation.

Nevertheless:

> Oracle dependencies must be included in the threat model.

---

# 18. PAUSE RISK

The protocol exposes:

setPaused(bool)

and:

setMarketPaused(asset, bool)

Therefore we must understand:

ArcRent deposits USDC

↓

ArcLend supply

↓

ArcLend pauses

↓

Can ArcRent still withdraw?

If withdrawal becomes impossible, what happens to the tenant's deposit?

This is a critical integration question.

---

# 19. LIQUIDITY AND CAP RISK

The LendingPool exposes:

supplyCap

borrowCap

availableLiquidity

Therefore the integration should check before supplying:

- Is USDC active?
- Is USDC paused?
- Is supply cap sufficient?
- Is available liquidity sufficient?
- What is utilization?
- What is current supply rate?

The strategy must fail safely if the market cannot accept or return the required funds.

---

# 20. PROTOCOL FEE

The LendingPool exposes:

protocolFeeBps()

MAX_PROTOCOL_FEE()

getProtocolFeeConfig()

Therefore yield analysis must distinguish between:

Gross lending economics

↓

Protocol fees / reserve factor

↓

Net supplier return

Do not treat the displayed supply rate as automatically equivalent to an immediately withdrawable cash yield.

---

# 21. CURRENT LIVE ARCRENT CONTRACT

Address:

0x12a69815D9fF4C7DB6f84852f46CF09325daEeBD

Network:

Arc Testnet

Chain ID:

5042002

RPC:

https://rpc.testnet.arc.network

Explorer:

https://testnet.arcscan.app/address/0x12a69815D9fF4C7DB6f84852f46CF09325daEeBD

IMPORTANT:

The current ArcRent contract is considered the live final MVP contract.

Do NOT redeploy merely to introduce interesting architecture.

Every proposed change must first ask:

Can this requirement be achieved without redeploying?

If genuine DeFi integration fundamentally requires a new vault architecture, evaluate:

- Security
- Time
- Existing autonomous release proof
- Submission deadline
- Demonstration reliability

before proceeding.

---

# 22. LIVE WALLETS

## Agent wallet

0xaECFfCE7c8f3F9cC823Ce6e10E7C1C42F8603E26

Private key:

.env → AGENT_PRIVATE_KEY

Confirmed working.

This wallet has already autonomously executed a release.

## Main wallet

Tenant / landlord / owner / arbiter:

0xb415e2C17c135F8Ec7560b59506edd1BD7A64F12

Private key:

.env → PRIVATE_KEY

---

# 23. CURRENT YIELD RESERVE

The ArcRent vault has approximately:

0.5 USDC

remaining in the reserve.

Lease 1 generated zero yield.

Therefore the reserve remains approximately intact.

Current reserve flow:

Owner

↓

fundYieldReserve()

↓

USDC held by ArcRent

↓

pendingYield()

↓

YieldPaid()

This is a real on-chain reserve-funded mechanism.

It is NOT currently external DeFi yield.

---

# 24. CURRENT RESERVE YIELD CALCULATION

pendingYield() currently uses:

uint256 endPoint = block.timestamp < lease.endTime
    ? block.timestamp
    : lease.endTime;

uint256 elapsed = endPoint - lease.startTime;

return (
    lease.deposit *
    YIELD_RATE_BPS *
    elapsed
) / (365 days * 10_000);

Current conceptual configuration:

YIELD_RATE_BPS = 500

Equivalent to:

5% APY

But:

> This is currently a contract calculation backed by the vault reserve, not a guaranteed market rate and not an external DeFi protocol yield.

---

# 25. CURRENT FUNDING LOGIC

fundLease() currently:

1. Confirms lease exists.
2. Confirms caller is tenant.
3. Confirms lease is active.
4. Records vault USDC balance before transfer.
5. Uses safeTransferFrom().
6. Records balance after transfer.
7. Calculates actual amount received.
8. Requires received amount to equal lease deposit.
9. Emits LeaseFunded.

Architecture:

Tenant

↓

USDC approve()

↓

fundLease()

↓

ArcRent vault receives USDC

This has already been proven operationally.

---

# 26. FRONTEND STATUS

Existing components:

- DepositForm.tsx
- LoginCard.tsx
- RentPaymentFlow.tsx
- SuccessCard.tsx
- YieldCalculator.tsx

Authentication provider:

Privy

NOT Particle.

## RentPaymentFlow.tsx

Rewritten.

Now:

- Uses Privy
- Points to live ArcRent contract
- Calls createLease()
- Calls approve()
- Calls fundLease()
- Renders DepositForm
- Renders SuccessCard
- Removes duplicate UI
- Removes previous broken login logic

Landlord currently hardcoded:

DEMO_LANDLORD_ADDRESS = main wallet

This is documented because the MVP does not yet contain a property-listing system.

---

# 27. DEPOSIT FORM

DepositForm.tsx is mostly functional.

It currently uses Privy correctly.

Any selectedStrategy handling must correspond to the actual contract architecture.

If ArcLend is integrated, strategy handling may need to change from the current fixed strategy representation.

---

# 28. FRONTEND COMPONENTS NOT YET REVIEWED

- LoginCard.tsx
- SuccessCard.tsx
- YieldCalculator.tsx

Frontend remains secondary to proving the underlying technical and submission story.

---

# 29. BUSINESS VALIDATION

University of Hertfordshire:

40 signups in one day.

Validated USP:

> Quick / automated release of rent deposits at the end of tenancy while potentially earning yield during tenancy.

Students responded particularly to:

- Faster deposit settlement
- Automation
- Yield opportunity

rather than technical sophistication.

---

# 30. HONEST PRODUCT SCOPE

## BUILT AND PROVEN

- Arc Testnet deployment
- USDC deposit escrow
- Automated non-custodial release
- Autonomous AI-agent-triggered execution
- Unattended agent execution proven on-chain
- On-chain reserve-funded yield payout mechanism
- Programmable lease lifecycle
- Real USDC settlement
- ArcLend SDK discovered
- ArcLend LendingPool ABI inspected
- ArcLendVault ABI inspected
- ArcLend USDC deployment address identified

## UNDER ACTIVE VERIFICATION

- ArcLend USDC market
- Current USDC supply rate
- Actual USDC liquidity
- Interest accrual
- ArcLend withdrawal
- ArcLendVault deployment
- Vault accounting
- Pool ownership
- Pause controls
- Oracle risk
- Protocol fees
- Supply caps
- Borrow caps
- Safe ArcRent integration
- Whether real DeFi yield can be demonstrated before submission

## NOT BUILT — ROADMAP

- Recurring rent payments
- 4-of-6 multisig release
- Production ERC-4626 rental vault architecture
- Deposit passport to next tenancy
- Full dispute resolution
- Insurance
- Cross-chain rental settlement
- Production compliance architecture
- Full property-listing system
- Full rental agreement system
- Digital inventory
- Maintenance records

---

# 31. AGENTIC ECONOMY TRACK

The autonomous agent is a genuine product component.

Proven architecture:

LEASE STATE

↓

AGENT MONITORS

↓

AUTHORISED CONDITION SATISFIED

↓

AGENT SUBMITS TRANSACTION

↓

executeRelease()

↓

USDC SETTLEMENT

The agent wallet:

0xaECFfCE7c8f3F9cC823Ce6e10E7C1C42F8603E26

has already demonstrated unattended execution.

The agent does not have unrestricted custody.

The smart contract enforces the rules.

---

# 32. DEFI TRACK

The target DeFi architecture is:

USDC RENT DEPOSIT

↓

PROGRAMMABLE VAULT

↓

ARCLEND / REAL DEFI STRATEGY

↓

USDC LENDING YIELD

↓

PROGRAMMABLE SETTLEMENT

The current reserve mechanism demonstrates:

- programmable yield calculation
- reserve-backed payout
- on-chain accounting

But it does NOT independently prove external DeFi yield.

---

# 33. NEW DEFI TARGET

The leading candidate is now:

ARCLEND

Potential mechanism:

USDC lending / supply

Potential proof:

- USDC supplied to LendingPool
- User reserve position exists
- Supply rate is non-zero
- Liquidity index changes
- Withdraw returns principal + accrued interest
- Transactions are visible on-chain

Potential ArcRent architecture:

ArcRent

↓

ArcLend

↓

LendingPool

↓

USDC lending

↓

Interest accrual

↓

ArcRent

↓

Lease settlement

↓

AI agent

---

# 34. ARCLEND INVESTIGATION DECISION TREE

QUESTION 1:

Is the ArcLend USDC market currently active?

QUESTION 2:

Is it actually deployed at the SDK-provided address?

QUESTION 3:

Is the supplied USDC token address correct?

QUESTION 4:

Is there sufficient USDC liquidity?

QUESTION 5:

Is the supply rate currently non-zero?

QUESTION 6:

Does interest actually accrue?

QUESTION 7:

Can supplied USDC be withdrawn?

QUESTION 8:

Can ArcRent safely interact with the pool?

QUESTION 9:

Can tenant principal remain protected during a protocol failure?

QUESTION 10:

Can the integration be implemented and demonstrated before:

12 August 2026, 13:00 UK?

If YES:

Integrate ArcLend safely.

If NO:

Retain the proven reserve-funded mechanism and disclose it honestly.

---

# 35. ARCLEND VERIFICATION CHECKLIST

## A — LendingPool identity

Query:

owner()

paused()

oracle()

protocolFeeBps()

getAssetList()

## B — USDC market

Query:

getMarketData(USDC)

getMarketSafety(USDC)

markets(USDC)

## C — Current user position

Query:

getUserReserveData(
    main wallet or test wallet,
    USDC
)

Initially expected:

currentSupply = 0

currentBorrow = 0

## D — Market economics

Record:

supplyRate

borrowRate

utilizationRate

liquidityIndex

availableLiquidity

totalSupply

totalBorrow

## E — Token liquidity

Determine:

USDC balance of LendingPool

USDC balance of ArcLend Vault

## F — Ownership

Determine:

LendingPool owner

ArcLendVault pool

ArcLendVault asset

## G — Vault

Determine:

Vault totalAssets

Vault totalSupply

Vault convertToAssets()

Vault convertToShares()

Vault asset()

Vault pool()

## H — Supply/withdraw

Verify:

approve()

supply()

position increases

interest accrues

withdraw()

funds return

---

# 36. ARCLEND SECURITY REVIEW

Before any tenant deposit touches ArcLend, inspect:

- Contract address
- Ownership
- Upgradeability
- Pause controls
- Market pause controls
- Supply caps
- Borrow caps
- Deposit accounting
- Withdrawal accounting
- Interest accounting
- Token approvals
- Reentrancy
- External calls
- Oracle dependence
- Protocol fees
- Emergency controls
- Protocol liquidity
- Testnet assumptions
- Failure modes
- Whether ArcRent can recover funds
- Whether tenant principal remains protected
- Whether an external protocol failure can block settlement

Never send tenant funds into an unverified protocol merely to improve the pitch.

---

# 37. PREFERRED SECURITY MODEL

The preferred architecture is:

Tenant

↓

ArcRent smart contract

↓

ArcLend strategy

↓

LendingPool

↓

USDC lending

The ArcRent smart contract remains the programmable settlement boundary.

The AI agent only executes authorised contract functions.

The external DeFi protocol should not receive unrestricted control over ArcRent's settlement logic.

---

# 38. CURRENT VIDEO STATUS

Equipment:

- Samson Q2U microphone
- Elgato Key Light Neo

video_script.md exists.

It contains:

- Full script
- Shot list

The goal is to record a real live autonomous execution.

Ideal footage:

ArcRent UI

↓

Lease creation

↓

USDC deposit

↓

DeFi position

↓

Yield/rate visible

↓

Agent monitoring

↓

Autonomous execution

↓

ArcScan transaction

↓

Settlement

If genuine ArcLend integration is completed, the DeFi position should become part of the recording.

---

# 39. IDEAL DEMO STORY

## Problem

Rental deposits can become locked in disputes and remain financially inactive.

## Solution

ArcRent turns the deposit into programmable money.

## Deposit

Tenant funds a USDC deposit on Arc.

## DeFi

USDC can be supplied to a verifiable Arc-native lending market.

## Automation

An autonomous agent monitors the lease.

## Settlement

The smart contract enforces the authorised release.

## Proof

ArcScan demonstrates the actual transactions.

---

# 40. CORE PRODUCT THESIS

ArcRent is NOT:

"A blockchain deposit account."

ArcRent is:

> A programmable financial infrastructure layer for rental deposits.

Long-term lifecycle:

TENANCY CREATED

↓

DEPOSIT FUNDED

↓

USDC LOCKED

↓

DEFI STRATEGY

↓

YIELD

↓

TENANCY ENDS

↓

PROGRAMMABLE SETTLEMENT

↓

AI AGENT EXECUTES

↓

TENANT / LANDLORD SETTLEMENT

---

# 41. PITCH LANGUAGE — SAFE VERSION

## One-line pitch

> ArcRent turns rental deposits into programmable money.

## Expanded

> ArcRent is programmable rental infrastructure that uses USDC, smart contracts, DeFi yield strategies and autonomous agents to transform rental deposits into transparent, automated financial agreements.

## If ArcLend is successfully integrated

Use language such as:

> ArcRent supplies rental-deposit USDC into Arc-native lending infrastructure, allowing the deposit to participate in verifiable on-chain lending economics while remaining governed by programmable rental-settlement rules.

## If ArcLend is NOT integrated

Use:

> The current MVP demonstrates programmable rental deposits and autonomous settlement using an on-chain reserve-funded yield mechanism. Real Arc-native DeFi integration is the next protocol stage.

Never claim:

"Tenant USDC earns 5% APY"

unless there is actual evidence supporting that claim.

---

# 42. REPOSITORY

Repository:

https://github.com/UltraRentz/UltraRentz-MVP/tree/hackathon-active

Public and confirmed accessible in incognito.

README.md still needs to document:

- Current deployed contract
- Arc Testnet
- Chain ID 5042002
- Agent architecture
- Live transaction proof
- Current reserve-funded yield mechanism
- ArcLend investigation
- Any actual DeFi protocol integrated before submission

Current contract:

0x12a69815D9fF4C7DB6f84852f46CF09325daEeBD

---

# 43. SUBMISSION REQUIREMENTS

Late submission email must contain:

1. Project name and team
2. Full team names and email addresses
3. Encode registration email
4. Detailed explanation of what was built
5. Repository
6. Demo video
7. Presentation/deck
8. Live demo
9. Track selection
10. Optional team video

Every public link must be accessible to judges without requesting permission.

---

# 44. P0 — IMMEDIATE PRIORITY

## 1. Verify ArcLend LendingPool

Query live contract.

## 2. Verify USDC market

Confirm active status and token identity.

## 3. Inspect live economics

Record:

- Supply rate
- Utilization
- Liquidity
- Supply cap
- Liquidity index

## 4. Inspect ownership and controls

Determine:

- Owner
- Pause authority
- Oracle
- Fees
- Caps

## 5. Inspect ArcLendVault

Verify:

- Deployment
- Asset
- Pool
- Accounting
- Permissions

## 6. Determine supply/withdraw path

Establish how ArcRent would safely enter and exit the strategy.

## 7. Security decision

Determine whether tenant funds could safely interact with ArcLend.

## 8. Architecture decision

Choose:

REAL ARCLEND INTEGRATION

or:

HONEST RESERVE-BASED DEMO

## 9. Calculate Lease 2

Only after the above.

## 10. Execute Lease 2

Only after architecture is confirmed.

---

# 45. P1 — SUBMISSION PRODUCTION

After technical path is proven:

1. Record demo
2. Update README
3. Commit and push
4. Edit/finalise video
5. Finalise deck
6. Deploy frontend to Vercel if necessary
7. Verify every public link
8. Prepare submission email

---

# 46. P2 — AFTER SUBMISSION

Lower priority:

- Finish LoginCard.tsx
- Finish SuccessCard.tsx
- Finish YieldCalculator.tsx
- Deploy polished frontend
- Improve wallet UX
- Remove obsolete Particle files
- Production security review
- Full rental agreement system
- Property listings
- Digital inventory
- Maintenance records
- Dispute workflow
- Real yield protocol integration if not completed
- Recurring rent
- Insurance
- Cross-border settlement
- Agent ecosystem

---

# 47. KNOWN MINOR ISSUES

Remaining obsolete files:

src/hooks/useParticleAuth.ts

src/lib/usePartcle.ts

These are cosmetic because authentication has moved to Privy.

Known contract issue:

fundLease() currently has no explicit double-funding guard.

Dependency issue:

66 npm audit vulnerabilities were previously reported through ethers dependencies.

Do NOT perform unrelated dependency cleanup during submission preparation.

---

# 48. NO-REDEPLOYMENT PRINCIPLE

The live ArcRent contract is already proven.

Therefore:

> Do not redeploy unless the new DeFi architecture genuinely cannot be implemented safely using the existing contract.

Before redeployment ask:

1. Is it technically necessary?
2. Does it materially strengthen the submission?
3. Does it introduce new security risk?
4. Does it invalidate existing transaction proof?
5. Can it be tested before the deadline?
6. Does it threaten the autonomous-release demo?

If yes to significant risk:

DO NOT REDEPLOY.

---

# 49. CTO DECISION FRAMEWORK

For every proposed change:

QUESTION 1:

Does this strengthen the ArcRent submission?

QUESTION 2:

Does this demonstrate programmable money?

QUESTION 3:

Does this genuinely strengthen the DeFi or Agentic Economy claim?

QUESTION 4:

Can it be verified on-chain?

QUESTION 5:

Can it be implemented safely before the deadline?

QUESTION 6:

Does it threaten functionality already proven?

If YES to question 6:

DO NOT MAKE THE CHANGE without explicit CTO review.

---

# 50. CURRENT CRIT

## C — CONTEXT

ArcRent has:

- Live Arc Testnet contract
- Working USDC deposits
- Proven autonomous release
- Public GitHub
- Partially rebuilt frontend
- Video script
- Deck content
- Late submission deadline
- ArcLend SDK identified
- ArcLend LendingPool ABI inspected
- ArcLendVault ABI inspected
- ArcLend deployment addresses identified

## R — ROLE

ChatGPT operates as:

- CTO
- Senior Solidity Engineer
- Senior Web3 Engineer
- DeFi Architect
- Security Reviewer
- Product Strategist
- Hackathon Submission Lead

## I — IMMEDIATE PRODUCT QUESTION

> Can ArcRent safely route rental-deposit USDC into ArcLend's live USDC lending market, generate genuine verifiable lending yield, preserve tenant principal, and still allow programmable autonomous settlement?

## T — TASKS

1. Verify LendingPool
2. Verify USDC market
3. Verify USDC token
4. Verify live supply rate
5. Verify liquidity
6. Verify interest accounting
7. Verify ArcLendVault
8. Inspect security/admin controls
9. Determine safe integration architecture
10. Calculate Lease 2
11. Execute only after confirmation
12. Record on-chain evidence
13. Finish submission

---

# 51. CURRENT CRITICAL PATH

The project is now at:

ARCLEND SDK

↓

LENDINGPOOL

↓

VERIFY USDC MARKET

↓

VERIFY RATE + LIQUIDITY

↓

VERIFY VAULT

↓

SECURITY REVIEW

↓

INTEGRATION DECISION

↓

LEASE 2

↓

REAL DEFI PROOF

↓

VIDEO

↓

README

↓

DECK

↓

SUBMISSION

---

# 52. WHAT WE MUST NOT DO

Do NOT:

- Create Lease 2 prematurely.
- Send tenant funds to an unverified protocol.
- Assume SDK addresses are automatically safe.
- Assume supplyRate means guaranteed APY.
- Assume testnet yield behaves like mainnet yield.
- Call lending "staking".
- Claim external DeFi yield without transaction evidence.
- Redeploy the ArcRent contract unnecessarily.
- Break the proven autonomous-release flow.
- Spend submission time on cosmetic frontend work before the DeFi decision.
- Perform unrelated dependency upgrades.
- Fake protocol integration for the video.

---

# 53. WHAT WE SHOULD DO

We SHOULD:

- Verify everything on-chain.
- Prefer the simplest safe integration.
- Preserve the existing ArcRent settlement architecture.
- Keep the agent permissioned.
- Keep tenant principal protected by contract rules.
- Demonstrate actual transactions.
- Record ArcScan evidence.
- Distinguish gross and net yield.
- Document protocol risks.
- Make conservative claims.
- Choose reliability over complexity.

---

# 54. CURRENT PROJECT SCORECARD

## Agentic Economy

STATUS:

GREEN / PROVEN

Evidence:

Autonomous agent successfully executed:

executeRelease()

Transaction:

0xc1f54dac2d2e7707821f1e23c5c7322860bee159c0e7d22865fe4a0df4a03b76

---

## Programmable Money

STATUS:

GREEN / PROVEN

Evidence:

- Lease state
- USDC funding
- Contract-controlled release
- Autonomous execution
- Settlement

---

## DeFi

STATUS:

AMBER / ACTIVE INVESTIGATION

Evidence currently available:

- ArcLend SDK
- LendingPool ABI
- supply()
- withdraw()
- supplyRate
- liquidityIndex
- market data
- ArcLendVault ABI

Missing:

- Live USDC market verification
- Live rate
- Live liquidity
- Actual supply transaction
- Actual withdrawal
- Actual accrued yield
- Security approval

---

## Frontend

STATUS:

AMBER

Core flow largely functional.

Polish remains secondary.

---

## Submission

STATUS:

AMBER / TIME CRITICAL

Deadline:

12 August 2026, 13:00 UK

Internal deadline:

12 August 2026, 11:00 UK

---

# 55. SINGLE HIGHEST-VALUE ACTION

The next action is NOT:

Create Lease 2.

The next action is:

> Verify the live ArcLend USDC market and determine whether it can safely become ArcRent's genuine DeFi yield strategy.

Specifically:

getMarketData(USDC)

getMarketSafety(USDC)

markets(USDC)

getUserReserveData(user, USDC)

owner()

paused()

oracle()

protocolFeeBps()

Then inspect ArcLendVault:

asset()

pool()

totalAssets()

totalSupply()

---

# 56. FINAL CTO PRINCIPLE

> DO NOT FAKE THE DEFI STORY.

ArcRent has already proven something valuable:

> An autonomous agent can trigger a real programmable rental-deposit settlement on Arc.

We have now identified a concrete Arc-native lending protocol candidate.

The next question is whether ArcLend can safely connect genuine DeFi yield to that already-proven architecture.

If YES:

> Integrate it safely and demonstrate it.

If NO:

> Submit the proven architecture honestly, clearly label the reserve-funded mechanism, and position real DeFi integration as the next stage.

The objective is NOT to claim the most sophisticated system.

The objective is:

> BUILD THE STRONGEST THING WE CAN ACTUALLY PROVE.

---

# SESSION CONTINUITY RULE

At every new session:

1. Read this Master Brief.
2. Identify the current deadline.
3. Identify the current blocker.
4. Identify the highest-value task.
5. Apply CRIT.
6. Apply Pareto.
7. Do not restart completed work.
8. Do not redeploy the live contract without explicit reason.
9. Verify external protocol assumptions before integrating them.
10. Update this Brief at natural checkpoints.

CURRENT BLOCKER:

ARCLEND LIVE USDC MARKET VERIFICATION

CURRENT HIGHEST-VALUE TASK:

VERIFY ARCLEND ON-CHAIN

CURRENT LOCKED ACTION:

DO NOT CREATE LEASE 2 YET.

CURRENT DEADLINE:

12 AUGUST 2026 — 13:00 UK

INTERNAL DEADLINE:

12 AUGUST 2026 — 11:00 UK
# arclend-sdk

Contract ABIs and deployment addresses for [ArcLend](https://github.com/osr21/arclend) — an Aave-inspired DeFi lending and borrowing protocol on **Arc Testnet** (Chain ID `5042002`, Circle's EVM L1).

## Install

```bash
npm install arclend-sdk
# or
yarn add arclend-sdk
# or
pnpm add arclend-sdk
```

## Quick start

```typescript
import {
  ARC_TESTNET,
  LendingPoolABI,
  ArcLendVaultABI,
  ArcLendGaslessRouterABI,
  MockERC20ABI,
} from "arclend-sdk";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(ARC_TESTNET.rpcUrl);

// Core lending pool
const pool = new ethers.Contract(
  ARC_TESTNET.LendingPool,
  LendingPoolABI,
  provider
);

// Read market data for USDC
const market = await pool.getMarketData(ARC_TESTNET.tokens.USDC);
console.log("USDC supply APY:", market.supplyRate);
console.log("USDC borrow APY:", market.borrowRate);

// Read a user's account summary
const account = await pool.getUserAccountData("0xYourAddress");
console.log("Health factor:", account.healthFactor);
console.log("Available borrows (USD):", account.availableBorrowsUSD);
```

## Network

| Parameter      | Value                                |
|----------------|--------------------------------------|
| Network Name   | Arc Testnet                          |
| Chain ID       | `5042002`                            |
| RPC URL        | `https://rpc.testnet.arc.network`    |
| Block Explorer | `https://testnet.arcscan.app`        |
| Native Gas     | USDC (ERC-20 precompile)             |
| Faucet         | `https://faucet.circle.com`          |

## Deployed contracts

| Contract              | Address                                      | Arcscan |
|-----------------------|----------------------------------------------|---------|
| `LendingPool`         | `0x4dc7A9BbcB1139cDeDf5274272F541461ef4d20E` | [view](https://testnet.arcscan.app/address/0x4dc7A9BbcB1139cDeDf5274272F541461ef4d20E#code) |
| `MockPriceOracle`     | `0x542e06e674424F8316FAAB31Be12f5D149A03d7a` | [view](https://testnet.arcscan.app/address/0x542e06e674424F8316FAAB31Be12f5D149A03d7a#code) |
| `GaslessRouter`       | `0xFE338289BA0f113933853759baD76B251932341a` | [view](https://testnet.arcscan.app/address/0xFE338289BA0f113933853759baD76B251932341a#code) |
| `ArcLendVault (USDC)` | `0x363C4eE3CfD814D3CC3bc72aCe4259453cF651EB` | [view](https://testnet.arcscan.app/address/0x363C4eE3CfD814D3CC3bc72aCe4259453cF651EB#code) |
| `ArcLendVault (EURC)` | `0xf9A7CD2c92CB6957ECeFffE2881c5Bd163a2CAeD` | [view](https://testnet.arcscan.app/address/0xf9A7CD2c92CB6957ECeFffE2881c5Bd163a2CAeD#code) |

## Supported assets

| Asset | Symbol | Decimals | Address |
|-------|--------|----------|---------|
| USD Coin   | USDC | 6 | `0x3600000000000000000000000000000000000000` |
| Euro Coin  | EURC | 6 | `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a` |
| US Yield Coin | USYC | 6 | `0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C` |

> **Note:** USYC is a stub contract on Arc Testnet as of June 2026. Supply and borrow are disabled until Circle deploys the full contract.

## Exports

```typescript
// Deployed addresses + network config
import { ARC_TESTNET } from "arclend-sdk";

// Contract ABIs (typed TypeScript as const — full type inference)
import { LendingPoolABI }             from "arclend-sdk"; // core pool
import { ArcLendVaultABI }            from "arclend-sdk"; // ERC-4626 vault
import { ArcLendGaslessRouterABI }    from "arclend-sdk"; // EIP-3009 gasless supply
import { MockERC20ABI }               from "arclend-sdk"; // testnet token faucet
import { MockPriceOracleABI }         from "arclend-sdk"; // admin price feed
```

## Key LendingPool functions

```typescript
// Supply collateral (requires prior ERC-20 approve)
await pool.supply(assetAddress, amountInTokenUnits);

// Borrow against your collateral
await pool.borrow(assetAddress, amountInTokenUnits);

// Repay debt (requires prior ERC-20 approve)
await pool.repay(assetAddress, amountInTokenUnits);

// Withdraw supplied collateral
await pool.withdraw(assetAddress, amountInTokenUnits);

// Read market state
const [isActive, totalSupply, totalBorrow, supplyRate, borrowRate, utilization]
  = await pool.getMarketData(assetAddress);

// Read user position
const [currentSupply, currentBorrow, scaledSupply, scaledBorrow]
  = await pool.getUserReserveData(userAddress, assetAddress);

// Get all active market addresses
const markets = await pool.getAssetList();
```

## ERC-4626 vaults (composable yield)

The USDC and EURC vaults are standard ERC-4626 tokens (`alvUSDC`, `alvEURC`). Any ERC-4626-aware protocol can deposit, price, or accept them as collateral with no custom integration.

```typescript
const vault = new ethers.Contract(
  ARC_TESTNET.integrations.vaults.USDC,
  ArcLendVaultABI,
  signer
);

// Deposit 100 USDC → receive alvUSDC shares (auto-accruing yield)
await usdcToken.approve(vault.target, 100_000_000n);
const shares = await vault.deposit(100_000_000n, receiverAddress);

// Check share value (rises as interest accrues)
const assets = await vault.convertToAssets(shares);
```

## Gasless supply (EIP-3009)

Users can supply USDC/EURC without holding gas (USDC on Arc) by signing an off-chain authorization. A relayer submits the transaction and pays gas on their behalf.

```typescript
// 1. User signs a ReceiveWithAuthorization off-chain (EIP-3009)
// 2. POST the signature to your relayer:
const response = await fetch("/api/gasless/supply", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ vault, from, value, validAfter, validBefore, nonce, v, r, s }),
});
const { txHash, shares } = await response.json();
```

## License

MIT

/**
 * ArcRent Autonomous Release Agent
 *
 * This script IS the "agent" referred to in the contract's aiAgent role.
 * It runs independently, watches on-chain state, and decides on its own
 * when to call requestRelease() -- no human triggers it.
 *
 * Decision logic (the "real signal" the hackathon track asks for):
 *   - Poll isEligibleForTenantRelease(leaseId) for every known lease
 *   - When true, autonomously call requestRelease(leaseId)
 *   - Separately, poll pending release requests and call executeRelease()
 *     once their delay window has passed
 *
 * Run with: npx ts-node scripts/agent.ts
 */

import { ethers } from "ethers";

// ---- Config ----
const RPC_URL = process.env.RPC_URL || "https://rpc.testnet.arc.network";
const VAULT_ADDRESS = process.env.VAULT_ADDRESS || "0x12a69815D9fF4C7DB6f84852f46CF09325daEeBD";
const AGENT_PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY as string;
const POLL_INTERVAL_MS = 15_000; // 15s -- fast enough to look responsive on camera

if (!AGENT_PRIVATE_KEY) {
  throw new Error("AGENT_PRIVATE_KEY not set. Load it from .env before running.");
}

const VAULT_ABI = [
  "function nextLeaseId() view returns (uint256)",
  "function isEligibleForTenantRelease(uint256 leaseId) view returns (bool)",
  "function releaseRequests(uint256 leaseId) view returns (uint256 leaseId, uint256 amount, uint256 executeAfter, bool executed)",
  "function requestRelease(uint256 leaseId) external",
  "function executeRelease(uint256 leaseId) external",
  "event ReleaseRequested(uint256 indexed leaseId, uint256 amount, uint256 executeAfter)",
  "event DepositReleased(uint256 indexed leaseId, address indexed recipient, uint256 amount)",
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(AGENT_PRIVATE_KEY, provider);
const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, wallet);

function log(msg: string) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function checkLease(leaseId: bigint) {
  try {
    const request = await vault.releaseRequests(leaseId);
    const alreadyRequested = request.executeAfter !== 0n;

    if (!alreadyRequested) {
      const eligible: boolean = await vault.isEligibleForTenantRelease(leaseId);
      if (eligible) {
        log(`Lease ${leaseId} is eligible for release. Requesting autonomously.`);
        const tx = await vault.requestRelease(leaseId);
        log(`requestRelease tx sent: ${tx.hash}`);
        await tx.wait();
        log(`requestRelease confirmed for lease ${leaseId}.`);
      } else {
        log(`Lease ${leaseId}: not yet eligible.`);
      }
      return;
    }

    if (request.executed) {
      return;
    }

    const nowSec = BigInt(Math.floor(Date.now() / 1000));
    if (nowSec >= request.executeAfter) {
      log(`Lease ${leaseId} release delay has passed. Executing autonomously.`);
      const tx = await vault.executeRelease(leaseId);
      log(`executeRelease tx sent: ${tx.hash}`);
      await tx.wait();
      log(`executeRelease confirmed for lease ${leaseId}.`);
    } else {
      const secondsLeft = request.executeAfter - nowSec;
      log(`Lease ${leaseId}: release pending, ${secondsLeft}s remaining until executable.`);
    }
  } catch (err) {
    log(`Error checking lease ${leaseId}: ${(err as Error).message}`);
  }
}

async function tick() {
  const next = await vault.nextLeaseId();
  for (let i = 1n; i < next; i++) {
    await checkLease(i);
  }
}

async function main() {
  log(`ArcRent agent starting. Watching vault ${VAULT_ADDRESS} on ${RPC_URL}`);
  log(`Agent wallet: ${await wallet.getAddress()}`);
  await tick();
  setInterval(tick, POLL_INTERVAL_MS);
}

main().catch((err) => {
  console.error("Fatal agent error:", err);
  process.exit(1);
});
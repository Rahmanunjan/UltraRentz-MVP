import { useState, useCallback } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import DepositForm from "./DepositForm";
import SuccessCard from "./SuccessCard";
import type { YieldStrategy } from "../types/protocol";

// ---- Current live Arc testnet deployment ----
const VAULT_ADDRESS = "0x12a69815D9fF4C7DB6f84852f46CF09325daEeBD";
const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";

// DEMO SIMPLIFICATION: a fixed landlord address for the demo lease.
// In a real flow this would come from the property listing, not be hardcoded.
const DEMO_LANDLORD_ADDRESS = "0xb415e2C17c135F8Ec7560b59506edd1BD7A64F12";

const VAULT_ABI = [
  "function createLease(address tenant, address landlord, bytes32 leaseHash, uint256 depositAmount, uint256 startTime, uint256 endTime, uint256 claimPeriod) external returns (uint256 leaseId)",
  "function fundLease(uint256 leaseId) external",
  "function nextLeaseId() view returns (uint256)",
];

const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
];

// Matches the contract's fixed YIELD_RATE_BPS (500 = 5%). The contract has
// no strategy selection, so this is presented as a single fixed strategy
// rather than a menu of options.
const FIXED_STRATEGY: YieldStrategy = {
  name: "ArcRent Vault (Arc testnet)",
  apy: 5,
};

const RentPaymentFlow = () => {
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();

  const [amount, setAmount] = useState("1200");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"PENDING" | "SECURED">("PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = useCallback(async () => {
    setError(null);

    if (!authenticated) {
      login();
      return;
    }

    const wallet = wallets[0];
    if (!wallet) {
      setError("No wallet connected.");
      return;
    }

    try {
      const provider = await wallet.getEthersProvider();
      const signer = await provider.getSigner();
      const tenantAddress = await signer.getAddress();

      const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer);
      const usdc = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);

      const depositAmount = ethers.parseUnits(amount, 6); // USDC has 6 decimals

      // Demo lease terms: starts now, ends in 30 days, 7-day claim window.
      // A real flow would take these from an actual tenancy agreement.
      const now = Math.floor(Date.now() / 1000);
      const startTime = now;
      const endTime = now + 30 * 24 * 60 * 60;
      const claimPeriod = 7 * 24 * 60 * 60;
      const leaseHash = ethers.keccak256(
        ethers.toUtf8Bytes(`${address || "demo-property"}-${now}`)
      );

      // 1. Create the lease
      const createTx = await vault.createLease(
        tenantAddress,
        DEMO_LANDLORD_ADDRESS,
        leaseHash,
        depositAmount,
        startTime,
        endTime,
        claimPeriod
      );
      await createTx.wait();

      // Determine the lease ID: nextLeaseId was just incremented, so the
      // lease we created is (current nextLeaseId - 1).
      const nextId: bigint = await vault.nextLeaseId();
      const leaseId = nextId - 1n;

      // 2. Approve the vault to pull the deposit
      const approveTx = await usdc.approve(VAULT_ADDRESS, depositAmount);
      await approveTx.wait();

      // 3. Fund the lease
      const fundTx = await vault.fundLease(leaseId);
      await fundTx.wait();

      setStatus("SECURED");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Deposit failed.";
      setError(message);
      console.error("Deposit error:", err);
    }
  }, [amount, address, authenticated, login, wallets]);

  const onConfirmWrapped = async () => {
    setLoading(true);
    await handleConfirm();
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-950/30 border border-red-900 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {status === "PENDING" ? (
        <DepositForm
          amount={amount}
          setAmount={setAmount}
          address={address}
          setAddress={setAddress}
          selectedStrategy={FIXED_STRATEGY}
          onConfirm={onConfirmWrapped}
        />
      ) : (
        <SuccessCard />
      )}

      {loading && (
        <p className="text-center text-neutral-500 text-sm mt-4">
          Processing on-chain transactions...
        </p>
      )}
    </div>
  );
};

export default RentPaymentFlow;
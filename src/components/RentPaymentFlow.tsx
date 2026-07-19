import React, { useState } from 'react';
import { Shield, ArrowRight, CheckCircle, LogIn } from 'lucide-react';
import { ethers } from 'ethers';
import { useConnect, useAuthCore } from "@particle-network/auth-core-modal";

const VAULT_ADDRESS = "0x..."; // ADD YOUR CONTRACT ADDRESS
const VAULT_ABI = ["function deposit(uint256 amount) external"];

const RentPaymentFlow = () => {
  const { connect, disconnect } = useConnect();
  const { userInfo } = useAuthCore();
  const [amount, setAmount] = useState('1200');
  const [isDepositing, setIsDepositing] = useState(false);
  const [status, setStatus] = useState<'PENDING' | 'SECURED'>('PENDING');

  const handleLogin = async () => {
    await connect({ socialType: 'google' });
  };

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      // Particle injects a provider into window.ethereum
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer);
      
      const tx = await vault.deposit(ethers.parseUnits(amount, 6));
      await tx.wait();
      setStatus('SECURED');
    } catch (err) {
      console.error(err);
      alert("Transaction failed.");
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
      <h2 className="text-xl font-black mb-8 flex items-center gap-2">
        UltraRentz Vault <Shield size={20} className="text-emerald-400" />
      </h2>

      {!userInfo ? (
        <button onClick={handleLogin} className="w-full bg-blue-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
          <LogIn size={16} /> Sign in with Google
        </button>
      ) : status === 'PENDING' ? (
        <div className="space-y-6">
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
            <p className="text-neutral-500 text-xs uppercase mb-2">Deposit Amount (USDC)</p>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-transparent text-2xl font-mono outline-none" />
          </div>
          
          <button onClick={handleDeposit} disabled={isDepositing} className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-neutral-200 transition-all">
            {isDepositing ? "Securing..." : "Secure Deposit & Earn 4.2% APR"}
          </button>
        </div>
      ) : (
        <div className="p-8 text-center bg-emerald-950/20 border border-emerald-900/50 rounded-2xl">
          <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold">Deposit Secured</h3>
        </div>
      )}
    </div>
  );
};

export default RentPaymentFlow;
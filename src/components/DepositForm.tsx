import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const URZ_CONTRACT_ADDRESS = '0xB1c01f7e6980AbdbAec0472C0e1A58EB46D39f3C';
const URZ_CONTRACT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];
const URZ_DECIMALS = 18;

const POPULAR_TOKENS = [
  { name: "USD Coin", symbol: "USDC" },
  { name: "Tether", symbol: "USDT" },
  { name: "DAI Stablecoin", symbol: "DAI" },
  { name: "Wrapped Ether", symbol: "WETH" },
  { name: "UltraRentz Token", symbol: "URZ" },
];

const POPULAR_FIATS = [
  { name: "US Dollar", symbol: "USD" },
  { name: "Euro", symbol: "EUR" },
  { name: "British Pound", symbol: "GBP" },
  { name: "Japanese Yen", symbol: "JPY" },
  { name: "Swiss Franc", symbol: "CHF" },
];

interface DepositFormProps {
  depositAmount: string;
  setDepositAmount: (value: string) => void;
  tenancyStartDate: string;
  setTenancyStartDate: (value: string) => void;
  tenancyDurationMonths: string;
  setTenancyDurationMonths: (value: string) => void;
  tenancyEnd: string;
  setTenancyEnd: (value: string) => void;
  paymentMode: 'fiat' | 'token';
  setPaymentMode: (value: 'fiat' | 'token') => void;
  fiatConfirmed: boolean;
  ethereumProvider: ethers.BrowserProvider | null;
  ethereumSigner: ethers.Signer | null;
  ethereumAccount: string | null;
  setEthereumProvider: (provider: ethers.BrowserProvider | null) => void;
  setEthereumSigner: (signer: ethers.Signer | null) => void;
  setEthereumAccount: (account: string | null) => void;
  landlordInput: string;
  setLandlordInput: (val: string) => void;
  paymentStatus: string | null;
  setPaymentStatus: (val: string | null) => void;
  paymentTxHash: string | null;
  setPaymentTxHash: (val: string | null) => void;
  connectEthereumWallet: () => Promise<void>;
  darkMode: boolean;
}

export default function DepositForm({
  depositAmount,
  setDepositAmount,
  tenancyStartDate,
  setTenancyStartDate,
  tenancyDurationMonths,
  setTenancyDurationMonths,
  tenancyEnd,
  setTenancyEnd,
  paymentMode,
  // Unused props safely prefixed with underscore:
  setPaymentMode: _setPaymentMode,
  fiatConfirmed: _fiatConfirmed,
  setEthereumProvider: _setEthereumProvider,
  setEthereumSigner: _setEthereumSigner,
  setEthereumAccount: _setEthereumAccount,
  ethereumProvider,
  ethereumSigner,
  ethereumAccount,
  landlordInput,
  setLandlordInput,
  paymentStatus,
  setPaymentStatus,
  paymentTxHash,
  setPaymentTxHash,
  connectEthereumWallet,
  darkMode
}: DepositFormProps) {
  const [selectedToken, setSelectedToken] = useState("URZ");
  const [selectedFiat, setSelectedFiat] = useState("USD");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const inputStyle = `w-full border p-2 mb-2 rounded ${darkMode ? 'bg-black text-white border-white' : 'bg-white text-black border-black'}`;

  useEffect(() => {
    if (paymentMode === "token") {
      setPaymentStatus(null);
      setPaymentTxHash(null);
      setIsProcessingPayment(false);
    }
  }, [paymentMode]);

  const handlePayToken = useCallback(async () => {
    setPaymentStatus(null);
    setPaymentTxHash(null);
    setIsProcessingPayment(true);

    const parsedDepositAmount = parseFloat(depositAmount);
    if (isNaN(parsedDepositAmount) || parsedDepositAmount <= 0) {
      setPaymentStatus("❌ Invalid deposit amount.");
      setIsProcessingPayment(false);
      return;
    }
    if (!tenancyStartDate || !tenancyEnd || new Date(tenancyEnd) <= new Date(tenancyStartDate)) {
      setPaymentStatus("❌ Invalid tenancy dates.");
      setIsProcessingPayment(false);
      return;
    }
    if (!ethers.isAddress(landlordInput.trim())) {
      setPaymentStatus("❌ Invalid landlord address.");
      setIsProcessingPayment(false);
      return;
    }
    if (!ethereumProvider || !ethereumSigner || !ethereumAccount) {
      setPaymentStatus("❌ Wallet not connected.");
      setIsProcessingPayment(false);
      return;
    }

    try {
      const amountWei = ethers.parseUnits(depositAmount, URZ_DECIMALS);
      const urzContract = new ethers.Contract(URZ_CONTRACT_ADDRESS, URZ_CONTRACT_ABI, ethereumSigner);
      const tx = await urzContract.transfer(landlordInput.trim(), amountWei);

      setPaymentStatus(`⏳ Transaction sent! Waiting... Tx Hash: ${tx.hash}`);
      setPaymentTxHash(tx.hash);

      const receipt = await tx.wait();
      if (receipt?.status === 1) {
        setPaymentStatus(`🎉 Payment Confirmed! ${depositAmount} ${selectedToken} sent.`);
      } else {
        setPaymentStatus("❌ Transaction failed or reverted.");
      }
    } catch (error: any) {
      if (error.code === 4001) {
        setPaymentStatus("❌ Transaction rejected.");
      } else {
        setPaymentStatus(`❌ Error: ${error.message}`);
      }
      setPaymentTxHash(null);
    } finally {
      setIsProcessingPayment(false);
    }
  }, [ethereumProvider, ethereumSigner, ethereumAccount, depositAmount, tenancyStartDate, tenancyEnd, landlordInput, selectedToken]);

  return (
    <div className={`p-4 border rounded shadow ${darkMode ? 'bg-black text-white border-white' : 'bg-white text-black border-black'}`}>
      <h2 className="text-lg font-bold mb-4">Rent Deposit Payment</h2>

      <label className="block mb-1 font-semibold">Deposit Amount</label>
      <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className={inputStyle} />

      <label className="block mb-1 font-semibold">Tenancy Start Date</label>
      <input type="date" value={tenancyStartDate} onChange={(e) => setTenancyStartDate(e.target.value)} className={inputStyle} />

      <label className="block mb-1 font-semibold">Tenancy Duration (Months)</label>
      <select value={tenancyDurationMonths} onChange={(e) => setTenancyDurationMonths(e.target.value)} className={inputStyle}>
        {Array.from({ length: 8 }, (_, i) => (i + 1) * 3).map((m) => (
          <option key={m} value={m}>{m} months</option>
        ))}
      </select>

      <label className="block mb-1 font-semibold">Tenancy End Date</label>
      <input type="date" value={tenancyEnd} onChange={(e) => setTenancyEnd(e.target.value)} className={inputStyle} />

      <label className="block mb-1 font-semibold">Landlord Wallet Address</label>
      <input type="text" value={landlordInput} onChange={(e) => setLandlordInput(e.target.value)} className={inputStyle} />

      <label className="block mb-1 font-semibold">Select Token</label>
      <select value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)} className={inputStyle}>
        {POPULAR_TOKENS.map((token) => (
          <option key={token.symbol} value={token.symbol}>{token.name} ({token.symbol})</option>
        ))}
      </select>

      <label className="block mb-1 font-semibold">Select Fiat</label>
      <select value={selectedFiat} onChange={(e) => setSelectedFiat(e.target.value)} className={inputStyle}>
        {POPULAR_FIATS.map((fiat) => (
          <option key={fiat.symbol} value={fiat.symbol}>{fiat.name} ({fiat.symbol})</option>
        ))}
      </select>

      {!ethereumAccount ? (
        <button onClick={connectEthereumWallet} className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4">Connect Wallet</button>
      ) : (
        <button onClick={handlePayToken} disabled={isProcessingPayment} className="bg-green-600 text-white px-4 py-2 rounded w-full mt-4">
          {isProcessingPayment ? "Processing..." : `Pay Token (${selectedToken})`}
        </button>
      )}

      {paymentStatus && (
        <div className={`mt-4 p-3 border rounded text-sm ${darkMode ? 'border-green-400 text-green-400' : 'text-green-600 border-green-300'}`}>
          <p>{paymentStatus}</p>
          {paymentTxHash && (
            <p>
              Tx: <a href={`https://moonbase.moonscan.io/tx/${paymentTxHash}`} target="_blank" rel="noopener noreferrer" className="underline">
                {paymentTxHash}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

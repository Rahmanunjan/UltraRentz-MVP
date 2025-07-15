// src/components/RentDepositOrchestrator.tsx
// This component orchestrates the overall rent deposit process,
// utilizing the specialized DepositForm and SignatoryForm components.

import React, { useState, useCallback, useEffect } from 'react';
import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Enable, web3Accounts, web3FromSource } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

// Import your specialized components
import DepositForm from './DepositForm';
import SignatoryForm from './SignatoryForm';

// Define the structure for the overall DApp state that this component will manage
interface RentDepositState {
  depositAmount: string;
  tenancyStartDate: string; // Added new state for start date
  tenancyEnd: string;
  paymentMode: 'fiat' | 'token';
  renterSignatories: string[];
  landlordSignatories: string[];
  landlordInput: string;
  
  api: ApiPromise | null;
  polkadotAccount: InjectedAccountWithMeta | null;
  accountSource: any;

  paymentStatus: string | null;
  paymentTxHash: string | null;
}

const RentDepositOrchestrator: React.FC = () => {
  const [state, setState] = useState<RentDepositState>({
    depositAmount: '',
    tenancyStartDate: '', // Initialize new state
    tenancyEnd: '',
    paymentMode: 'token',
    renterSignatories: [],
    landlordSignatories: [],
    landlordInput: '',
    api: null,
    polkadotAccount: null,
    accountSource: null,
    paymentStatus: null,
    paymentTxHash: null,
  });

  const updateState = useCallback((updates: Partial<RentDepositState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  // Effect to initialize Polkadot API connection
  useEffect(() => {
    const initializeApi = async () => {
      updateState({ paymentStatus: "Connecting to Polkadot..." });
      try {
        const provider = new WsProvider('wss://rpc.polkadot.io'); // Use a stable Polkadot RPC endpoint
        const apiInstance = await ApiPromise.create({ provider });
        await apiInstance.isReady;
        updateState({ api: apiInstance, paymentStatus: "Polkadot API ready." });
      } catch (error: any) {
        console.error("Failed to connect to Polkadot API:", error);
        updateState({ paymentStatus: `Error connecting to Polkadot: ${error.message || "Unknown error"}` });
      }
    };

    if (!state.api) {
      initializeApi();
    }

    return () => {
      state.api?.disconnect();
    };
  }, [state.api, updateState]);


  // Wallet connection logic (centralized here)
  const connectPolkadotWallet = useCallback(async () => {
    updateState({ paymentStatus: "Connecting wallet..." });
    try {
      const extensions = await web3Enable("UltraRentzDapp");
      if (extensions.length === 0) {
        alert("⚠️ No Polkadot extension found or access denied.");
        updateState({ paymentStatus: "Connection failed: No extension." });
        return;
      }

      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        alert("⚠️ No accounts found in Polkadot extension.");
        updateState({ paymentStatus: "Connection failed: No accounts." });
        return;
      }

      const account = accounts[0]; // Select the first account, or allow user selection
      const injector = await web3FromSource(account.meta.source);

      updateState({
        polkadotAccount: account,
        accountSource: injector,
        paymentStatus: `✅ Wallet connected: ${account.address}`,
      });
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      updateState({ paymentStatus: `❌ Error connecting wallet: ${error.message || "Unknown error"}` });
    }
  }, [updateState]);

  const setRenterSignatories = useCallback((newSignatories: string[]) => {
    updateState({ renterSignatories: newSignatories });
  }, [updateState]);

  const setLandlordSignatories = useCallback((newSignatories: string[]) => {
    updateState({ landlordSignatories: newSignatories });
  }, [updateState]);


  return (
    <div className="main-container">
      <h1>UltraRentz Deposit & Signatory Setup</h1>

      {/* 1. Deposit Form Section (using DepositForm.tsx) */}
      <DepositForm
        depositAmount={state.depositAmount}
        setDepositAmount={(val) => updateState({ depositAmount: val })}
        tenancyStartDate={state.tenancyStartDate} // Pass new prop
        setTenancyStartDate={(val) => updateState({ tenancyStartDate: val })} // Pass new prop setter
        tenancyEnd={state.tenancyEnd}
        setTenancyEnd={(val) => updateState({ tenancyEnd: val })}
        paymentMode={state.paymentMode}
        setPaymentMode={(val) => updateState({ paymentMode: val as 'fiat' | 'token' })}
        fiatConfirmed={false}
        polkadotAccount={state.polkadotAccount}
        accountSource={state.accountSource}
        api={state.api}
        landlordInput={state.landlordInput}
        setLandlordInput={(val) => updateState({ landlordInput: val })}
        paymentStatus={state.paymentStatus}
        setPaymentStatus={(val) => updateState({ paymentStatus: val })}
        paymentTxHash={state.paymentTxHash}
        setPaymentTxHash={(val) => updateState({ paymentTxHash: val })}
        connectPolkadotWallet={connectPolkadotWallet} // Pass the centralized connectWallet function
      />

      <div style={{ margin: '30px 0', borderBottom: '1px solid #eee' }}></div>

      {/* 2. Renter Signatories Section (using SignatoryForm.tsx) */}
      <SignatoryForm
        type="Renter"
        signatories={state.renterSignatories}
        setSignatories={setRenterSignatories}
        input={''}
        setInput={() => {}}
      />

      <div style={{ margin: '30px 0', borderBottom: '1px solid #eee' }}></div>

      {/* 3. Landlord Signatories Section (using SignatoryForm.tsx) */}
      <SignatoryForm
        type="Landlord"
        signatories={state.landlordSignatories}
        setSignatories={setLandlordSignatories}
        input={''}
        setInput={() => {}}
      />

      {/* Overall status display if needed outside specific forms */}
      {state.paymentStatus && !state.paymentTxHash && (
        <p className="status-text" style={{ marginTop: '20px', textAlign: 'center', color: state.paymentStatus.startsWith('Error') || state.paymentStatus.startsWith('❌') ? 'red' : 'green' }}>
          {state.paymentStatus}
        </p>
      )}
      {state.paymentTxHash && (
        <p className="status-text" style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.8em', wordBreak: 'break-all' }}>
          Transaction Hash: {state.paymentTxHash}
        </p>
      )}

      <button
        type="button"
        className="primary-button mt-4"
        style={{ width: '100%', padding: '15px', fontSize: '1.1em' }}
        onClick={() => {
          console.log("Final Setup Confirmed:", {
            depositAmount: state.depositAmount,
            tenancyStartDate: state.tenancyStartDate,
            tenancyEnd: state.tenancyEnd,
            paymentMode: state.paymentMode,
            renterSignatories: state.renterSignatories,
            landlordSignatories: state.landlordSignatories,
            landlordInput: state.landlordInput,
          });
          alert("Overall Rent Deposit Setup Confirmed (stub for smart contract interaction).");
        }}
        disabled={
            !state.api ||
            !state.polkadotAccount ||
            !state.depositAmount ||
            parseFloat(state.depositAmount) <= 0 ||
            !state.tenancyStartDate ||
            !state.tenancyEnd ||
            new Date(state.tenancyEnd) <= new Date(state.tenancyStartDate) ||
            state.renterSignatories.length < 1 ||
            state.landlordSignatories.length < 1
        }
      >
        Finalize Deposit & Signatories
      </button>

    </div>
  );
};

export default RentDepositOrchestrator;

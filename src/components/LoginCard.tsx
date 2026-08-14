import React from "react";
import { LogIn } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

export default function LoginCard() {
  const { login, authenticated, ready } = usePrivy();

  const handleLogin = async () => {
    login();
  };

  const isLoading = !ready;

  return (
    <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl text-white relative z-10">
      <h1 className="text-3xl font-black mb-3">UltraRentz</h1>

      <p className="text-neutral-400 mb-8">
        Protect your rent deposit. Earn yield while your deposit is secured.
      </p>

      <button
        onClick={handleLogin}
        disabled={isLoading || authenticated}
        className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition disabled:opacity-50"
      >
        <LogIn size={18} />
        {isLoading ? "Loading..." : authenticated ? "Connected" : "Continue with Wallet"}
      </button>
    </div>
  );
}
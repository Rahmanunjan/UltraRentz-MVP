import React, { useState, useCallback } from "react";
import { Shield, CheckCircle, LogIn } from "lucide-react";
import { ethers } from "ethers";
import {
  useAuthCore,
  useConnect,
} from "@particle-network/auth-core-modal";


const VAULT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const VAULT_ABI = [
  "function deposit(uint256 amount) external",
];


const RentPaymentFlow = () => {

  console.log("🚀 RentPaymentFlow rendered");


  const auth = useAuthCore();

  const { connect } = useConnect();

  const { userInfo } = auth;


  console.log(
    "AUTH KEYS:",
    Object.keys(auth)
  );

  console.log(
    "CONNECT TYPE:",
    typeof connect
  );


  const [amount, setAmount] =
    useState("1200");

  const [isDepositing, setIsDepositing] =
    useState(false);

  const [status, setStatus] =
    useState<"PENDING" | "SECURED">("PENDING");



  /**
   * Particle Google Login
   */
  const handleLogin = async () => {

    console.log(
      "========== LOGIN START =========="
    );


    try {

      if (!connect) {

        throw new Error(
          "Particle connect() unavailable"
        );

      }


      console.log(
        "Calling Particle Google login..."
      );


      const result = await connect({

        socialType: "google",

      });


      console.log(
        "✅ LOGIN SUCCESS"
      );


      console.dir(result);


    } catch (error: any) {


      console.error(
        "❌ LOGIN FAILED"
      );


      console.error(error);


      console.log(
        "Error message:",
        error?.message
      );


      console.log(
        "Error code:",
        error?.code
      );


    }


    console.log(
      "========== LOGIN END =========="
    );

  };



  /**
   * Deposit into UltraRentz Vault
   */
  const handleDeposit = useCallback(async () => {


    setIsDepositing(true);


    try {


      console.log(
        "Starting deposit..."
      );


      const ethereum =
        (window as any).ethereum;


      if (!ethereum) {

        throw new Error(
          "Wallet provider not found"
        );

      }



      const provider =
        new ethers.BrowserProvider(
          ethereum
        );



      const signer =
        await provider.getSigner();



      console.log(
        "Wallet:",
        await signer.getAddress()
      );



      const vault =
        new ethers.Contract(
          VAULT_ADDRESS,
          VAULT_ABI,
          signer
        );



      const tx =
        await vault.deposit(
          ethers.parseUnits(
            amount,
            6
          )
        );



      console.log(
        "Transaction:",
        tx.hash
      );



      await tx.wait();



      console.log(
        "✅ Deposit confirmed"
      );


      setStatus(
        "SECURED"
      );



    } catch (error: any) {


      console.error(
        "❌ Deposit error:",
        error
      );


    } finally {


      setIsDepositing(false);


    }


  }, [amount]);




  return (

    <div className="
      max-w-xl
      mx-auto
      bg-neutral-900
      border
      border-neutral-800
      rounded-[32px]
      p-8
      shadow-2xl
    ">


      <h2 className="
        text-xl
        font-black
        mb-8
        flex
        items-center
        gap-2
      ">

        UltraRentz Vault

        <Shield
          size={20}
          className="text-emerald-400"
        />

      </h2>



      {!userInfo ? (

        <button

          onClick={handleLogin}

          className="
            w-full
            bg-blue-600
            py-4
            rounded-2xl
            font-bold
            flex
            items-center
            justify-center
            gap-2
            hover:bg-blue-700
            transition
          "

        >

          <LogIn size={16}/>

          Sign in with Google


        </button>


      ) : status === "PENDING" ? (


        <div className="space-y-6">


          <div className="
            p-4
            bg-neutral-950
            rounded-xl
            border
            border-neutral-800
          ">


            <p className="
              text-neutral-500
              text-xs
              uppercase
              mb-2
            ">

              Deposit Amount (USDC)

            </p>


            <input

              value={amount}

              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }

              className="
                w-full
                bg-transparent
                text-2xl
                font-mono
                outline-none
              "

            />


          </div>




          <button

            onClick={handleDeposit}

            disabled={isDepositing}

            className="
              w-full
              bg-white
              text-black
              py-4
              rounded-2xl
              font-bold
              hover:bg-neutral-200
              transition
            "

          >

            {
              isDepositing
                ? "Securing..."
                : "Secure Deposit & Earn 4.2% APR"
            }


          </button>


        </div>


      ) : (


        <div className="
          p-8
          text-center
          bg-emerald-950/20
          border
          border-emerald-900/50
          rounded-2xl
        ">


          <CheckCircle

            size={48}

            className="
              text-emerald-400
              mx-auto
              mb-4
            "

          />


          <h3 className="
            text-lg
            font-bold
          ">

            Deposit Secured

          </h3>


          <p className="
            text-neutral-400
            mt-2
          ">

            Your funds are now protected inside the UltraRentz Vault.

          </p>


        </div>


      )}


    </div>

  );

};


export default RentPaymentFlow;
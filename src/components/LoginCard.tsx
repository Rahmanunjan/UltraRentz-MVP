import React from "react";
import { LogIn } from "lucide-react";

import { useParticleAuth } from "../hooks/useParticleAuth";


export default function LoginCard() {


  const {
    login,
    isLoading,
    error,
  } = useParticleAuth();



  const handleLogin = async () => {

    console.log(
      "🟢 UltraRentz login clicked"
    );

    await login();

  };



  return (

    <div
      className="
      w-full
      max-w-md
      bg-neutral-900
      border
      border-neutral-800
      rounded-3xl
      p-8
      shadow-2xl
      text-white
      relative
      z-10
      "
    >

      <h1
        className="
        text-3xl
        font-black
        mb-3
        "
      >
        UltraRentz
      </h1>


      <p
        className="
        text-neutral-400
        mb-8
        "
      >
        Protect your rent deposit.
        Earn yield while your deposit is secured.
      </p>


      <button

        onClick={handleLogin}

        disabled={isLoading}

        className="
        w-full
        bg-blue-600
        hover:bg-blue-700
        py-4
        rounded-2xl
        font-bold
        flex
        items-center
        justify-center
        gap-3
        transition
        "

      >

        <LogIn size={18}/>


        {
          isLoading
          ? "Connecting..."
          : "Continue with Google"
        }


      </button>


      {
        error && (

          <p
            className="
            text-red-400
            text-sm
            mt-4
            "
          >
            {error}
          </p>

        )
      }


    </div>

  );

}
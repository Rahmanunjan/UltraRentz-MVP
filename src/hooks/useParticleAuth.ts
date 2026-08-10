import { useState } from "react";

import {
  useConnect,
  useUserInfo,
} from "@particle-network/auth-core-modal";

export function useParticleAuth() {
  const { connect } = useConnect();

  const { userInfo } = useUserInfo();

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🚀 Starting Particle Google login...");

      const result = await connect({
        socialType: "google",
      });

      console.log("✅ Particle connect result:", result);

      return result;

    } catch (err: any) {
      console.error(
        "❌ Particle Google login failed:",
        err
      );

      console.error(
        "Error type:",
        typeof err
      );

      console.error(
        "Error name:",
        err?.name
      );

      console.error(
        "Error message:",
        err?.message
      );

      console.error(
        "Error code:",
        err?.code
      );

      console.error(
        "Error data:",
        err?.data
      );

      try {
        console.error(
          "Full error JSON:",
          JSON.stringify(err, null, 2)
        );
      } catch {
        console.error(
          "Could not stringify Particle error"
        );
      }

      setError(
        err?.message ||
        "Google login failed"
      );

      return null;

    } finally {
      setIsLoading(false);
    }
  };

  return {
    user: userInfo,
    login,
    isLoading,
    error,
  };
}


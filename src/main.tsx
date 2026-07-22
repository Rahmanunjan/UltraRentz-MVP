import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthCoreContextProvider } from "@particle-network/auth-core-modal";
import { ArbitrumSepolia } from "@particle-network/chains";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthCoreContextProvider
      options={{
        projectId: "d6e00d17-4973-4494-82ea-d21658467294",
        clientKey: "c2w50ATDvdGdVDwcSIc8p60iuktn3JoYqmZr0DyS",
        appId: "1d30b26e-4a99-493b-8a96-04f4c185d67e",
        chains: [ArbitrumSepolia],
      }}
    >
      <App />
    </AuthCoreContextProvider>
  </StrictMode>
);
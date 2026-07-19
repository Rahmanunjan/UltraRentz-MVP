import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthCoreContextProvider } from "@particle-network/auth-core-modal";
import { Arbitrum } from "@particle-network/chains";
import App from "./App";
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthCoreContextProvider
      options={{
        projectId: "d6e00d17-4973-4494-82ea-d21658467294",
        clientKey: "c2w50ATDvdGdVDwcSIc8p60iuktn3JoYqmZr0DyS",
        appId: "d6e00d17-4973-4494-82ea-d21658467294",
        chains: [Arbitrum],
      }}
    >
      <App />
    </AuthCoreContextProvider>
  </StrictMode>
);
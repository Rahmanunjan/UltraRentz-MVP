import { useState, useEffect } from "react";
import RentDepositApp from "./components/RentDepositApp"; // This will now be your orchestrator
import "./styles.css"; // Your existing custom styles

export default function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="main-container">
      {/* The Tailwind CSS CDN and config will now be in public/index.html */}

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="theme-toggle"
      >
        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      
      {/* RentDepositApp will now act as the orchestrator for your DApp */}
      <RentDepositApp />
    </div>
  );
}

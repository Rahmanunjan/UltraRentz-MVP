import React from "react";
import LoginCard from "./components/LoginCard";
import "./index.css";

export default function App() {
  return (
    // Added a true black background container to make white text and glowing orbs pop
    <div className="min-h-screen w-full bg-[#030303] relative overflow-x-hidden flex items-center justify-center">
      
      {/* Background orbs */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {/* Blue Orb */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'rgba(37, 99, 235, 0.25)',
          borderRadius: '50%',
          filter: 'blur(140px)',
        }} />
        {/* Purple Orb */}
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'rgba(147, 51, 234, 0.25)',
          borderRadius: '50%',
          filter: 'blur(140px)',
        }} />
      </div>
      
      {/* UltraRentz Authentication */}
      <LoginCard />
    </div>
  );
}
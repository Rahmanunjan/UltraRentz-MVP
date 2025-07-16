import { useCallback } from 'react'; // Corrected React import and added useCallback

// Removed unused imports from './components/ui/'
// import { input } from './components/ui/input';
// import { textarea } from './components/ui/textarea';
// import { button } from './components/ui/button';

interface YieldInfoProps {
  userRole: string;
  yieldAmount: string; // Consider if this should be a number or BigInt from the start if it's for display
  yieldToken: string;
  yieldStatus: string;
  setYieldStatus: (status: string) => void; // This can still be used for internal status messages before calling onClaimYield
  // New prop: function to call when the "Earn Yield" button is clicked
  onClaimYield: () => void;
  // New prop: to indicate if the yield claiming operation is currently in progress
  isClaiming?: boolean;
}

export default function YieldInfo({
  userRole,
  yieldAmount,
  yieldToken,
  yieldStatus,
  setYieldStatus, // Kept for potential internal status updates if needed
  onClaimYield, // The actual function to trigger the yield claim process
  isClaiming = false, // Default to false
}: YieldInfoProps) {

  // Memoize the handler for the "Earn Yield" button
  const handleYieldClick = useCallback(() => {
    // Optionally, you could add pre-claim validation here if needed
    // setYieldStatus("Initiating yield claim..."); // Optional interim status
    onClaimYield(); // Call the parent-provided claim function
  }, [onClaimYield]); // Dependency: onClaimYield prop

  return (
    <div className="form-section">
      <h2>Earn Yield</h2>
      <div className="info-text">
        <strong>User Role:</strong> {userRole || "N/A"}
      </div>
      <div className="info-text">
        <strong>Yield Amount:</strong> {yieldAmount || "0"}
      </div>
      <div className="info-text">
        <strong>Yield Token:</strong> {yieldToken || "N/A"}
      </div>
      <button
        type="button"
        onClick={handleYieldClick} // Use the memoized handler
        disabled={isClaiming} // Disable the button while claiming is in progress
        // Retaining the original inline styles for the button (assuming they come from primary-button class)
        style={{
          backgroundColor: '#0f5132', // Example color, replace with your actual primary-button style
          color: 'white',
          borderRadius: '6px',
          padding: '10px 20px', // Adjusted padding for better button appearance
          cursor: isClaiming ? 'not-allowed' : 'pointer', // Change cursor when disabled
          border: 'none', // Assuming primary-button has no border
          minWidth: '120px', // Ensure consistent width for button text change
          transition: 'background-color 0.3s ease', // Smooth transition for hover/disabled state
        }}
      >
        {isClaiming ? "Claiming..." : "Earn Yield"} {/* Dynamic button text */}
      </button>
      {/* Display the status from props */}
      {yieldStatus && (
        <p
          className="status-text"
          style={{
            marginTop: '10px',
            color: yieldStatus.includes("✅") ? 'green' : (yieldStatus.includes("Error") ? 'red' : 'inherit'), // Basic color based on status content
          }}
        >
          {yieldStatus}
        </p>
      )}
    </div>
  );
}
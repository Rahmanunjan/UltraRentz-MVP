import { useCallback } from 'react'; // Import useCallback
// Removed unused import from './components/ui/button'

interface StakeDepositFormProps {
  stakeStatus: string;
  setStakeStatus: (status: string) => void;
  // New prop: function to call when the "Stake Deposit" button is clicked
  onStakeDeposit: () => void;
  // New prop: to indicate if the staking operation is currently in progress
  isStaking?: boolean;
}

export default function StakeDepositForm({
  stakeStatus,
  setStakeStatus, // This can still be used for internal status messages before calling onStakeDeposit
  onStakeDeposit, // The actual function to trigger the staking process
  isStaking = false, // Default to false
}: StakeDepositFormProps) {

  // Memoize the handler for the stake button
  const handleStakeClick = useCallback(() => {
    // Optionally, you could add pre-staking validation here if needed
    // setStakeStatus("Initiating staking process..."); // Optional interim status
    onStakeDeposit(); // Call the parent-provided staking function
  }, [onStakeDeposit]); // Dependency: onStakeDeposit prop

  return (
    <div className="form-section">
      <h2>Stake Your Deposit</h2>
      <button
        type="button"
        onClick={handleStakeClick} // Use the memoized handler
        disabled={isStaking} // Disable the button while staking is in progress
        // Retaining the original inline styles for the button as per your constraint
        style={{
          backgroundColor: '#0f5132', // Example color, replace with your actual primary-button style
          color: 'white',
          borderRadius: '6px',
          padding: '10px 20px', // Adjusted padding for better button appearance
          cursor: isStaking ? 'not-allowed' : 'pointer', // Change cursor when disabled
          border: 'none', // Assuming primary-button has no border
          minWidth: '150px', // Ensure consistent width for button text change
          transition: 'background-color 0.3s ease', // Smooth transition for hover/disabled state
        }}
      >
        {isStaking ? "Staking..." : "🚀 Stake Deposit"} {/* Dynamic button text */}
      </button>
      {/* Display the status from props */}
      {stakeStatus && (
        <p
          className="status-text"
          style={{
            marginTop: '10px',
            color: stakeStatus.includes("✅") ? 'green' : (stakeStatus.includes("Error") ? 'red' : 'inherit'), // Basic color based on status content
          }}
        >
          {stakeStatus}
        </p>
      )}
    </div>
  );
}
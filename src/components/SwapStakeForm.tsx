import React, { useCallback } from "react"; // Import useCallback

interface SwapStakeFormProps {
  swapAmountIn: string;
  setSwapAmountIn: (val: string) => void;
  swapTokenIn: string;
  setSwapTokenIn: (val: string) => void;
  swapTokenOut: string;
  setSwapTokenOut: (val: string) => void;
  swapStatus: string;
  // Add a submission handler prop for better separation of concerns
  onSwapStakeSubmit: (data: { amount: number; tokenIn: string; tokenOut: string }) => void;
  // Optional: Prop to indicate if the submission is in progress
  isSubmitting?: boolean;
}

const SwapStakeForm: React.FC<SwapStakeFormProps> = ({
  swapAmountIn,
  setSwapAmountIn,
  swapTokenIn,
  setSwapTokenIn,
  swapTokenOut,
  setSwapTokenOut,
  swapStatus,
  onSwapStakeSubmit, // New prop for submission handler
  isSubmitting = false, // Default to false
}) => {

  // Validate inputs before submission
  const validateForm = useCallback(() => {
    const amount = parseFloat(swapAmountIn);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount greater than 0 for the swap.");
      return false;
    }
    if (!swapTokenIn.trim()) {
      alert("Please specify the 'Token In' for the swap.");
      return false;
    }
    if (!swapTokenOut.trim()) {
      alert("Please specify the 'Token Out' for the swap.");
      return false;
    }
    return true;
  }, [swapAmountIn, swapTokenIn, swapTokenOut]);

  // Handle the button click event
  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      // Pass the data up to the parent component for actual logic
      onSwapStakeSubmit({
        amount: parseFloat(swapAmountIn),
        tokenIn: swapTokenIn.trim(),
        tokenOut: swapTokenOut.trim(),
      });
    }
  }, [validateForm, onSwapStakeSubmit, swapAmountIn, swapTokenIn, swapTokenOut]); // Dependencies for useCallback

  // Determine if the button should be disabled
  const isButtonDisabled = isSubmitting || !validateForm();


  return (
    <div className="form-group">
      <h2>Token Swap + Stake</h2>

      <input
        type="number"
        placeholder="Amount to Swap"
        value={swapAmountIn}
        onChange={(e) => {
          // Allow empty string or valid positive numbers
          const value = e.target.value;
          if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
            setSwapAmountIn(value);
          }
        }}
        className="form-input"
        disabled={isSubmitting} // Disable input during submission
      />

      <input
        type="text"
        placeholder="Token In (e.g. USDC)"
        value={swapTokenIn}
        onChange={(e) => setSwapTokenIn(e.target.value)}
        className="form-input"
        disabled={isSubmitting} // Disable input during submission
      />

      <input
        type="text"
        placeholder="Token Out (e.g. stETH)"
        value={swapTokenOut}
        onChange={(e) => setSwapTokenOut(e.target.value)}
        className="form-input"
        disabled={isSubmitting} // Disable input during submission
      />

      {swapStatus && (
        <p className="status-text">Status: {swapStatus}</p>
      )}

      <button
        type="button"
        className="primary-button mt-2"
        onClick={handleSubmit}
        disabled={isButtonDisabled} // Button disabled based on validation and submission status
      >
        {isSubmitting ? "Processing..." : "Swap + Stake"}
      </button>
    </div>
  );
};

export default SwapStakeForm;
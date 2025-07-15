import React from "react";

interface DaoReferralFormProps {
  daoReferral: string;
  setDaoReferral: (val: string) => void;
  daoDecision: string;
  setDaoDecision: (val: string) => void;
  // Change appealFee to number in interface if you intend to store it as such
  // For now, keeping it string to align with current state management,
  // but handling conversion internally.
  appealFee: string; // Keeping as string due to prop signature, converting internally.
  setAppealFee: (val: string) => void;
  // Optional: Add a submission handler prop for better separation of concerns
  // onSubmitReferral?: (data: { referral: string; decision: string; fee: number | null }) => void;
}

const DaoReferralForm: React.FC<DaoReferralFormProps> = ({
  daoReferral,
  setDaoReferral,
  daoDecision,
  setDaoDecision,
  appealFee,
  setAppealFee,
  // onSubmitReferral, // If you add this prop
}) => {
  // Internal state for validation messages (not altering visual style)
  const [referralError, setReferralError] = React.useState<string | null>(null);
  const [decisionError, setDecisionError] = React.useState<string | null>(null);
  const [appealFeeError, setAppealFeeError] = React.useState<string | null>(null);

  const handleAppealFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAppealFee(value); // Keep state as string for external consistency

    // Basic validation for number input
    if (value === "") {
      setAppealFeeError(null); // Clear error if empty
    } else if (isNaN(Number(value))) {
      setAppealFeeError("Please enter a valid number.");
    } else if (Number(value) < 0) {
      setAppealFeeError("Appeal fee cannot be negative.");
    } else {
      setAppealFeeError(null);
    }
  };

  const handleSubmit = () => {
    // Clear previous errors
    setReferralError(null);
    setDecisionError(null);
    setAppealFeeError(null);

    let isValid = true;

    // Validate daoReferral
    if (!daoReferral.trim()) {
      setReferralError("DAO referral description is required.");
      isValid = false;
    }

    // Validate daoDecision
    if (!daoDecision.trim()) {
      setDecisionError("DAO decision is required.");
      isValid = false;
    }

    // Validate appealFee (after user input handling)
    const numericAppealFee = parseFloat(appealFee);
    if (appealFee.trim() !== "" && (isNaN(numericAppealFee) || numericAppealFee < 0)) {
        setAppealFeeError("Please enter a valid non-negative appeal fee.");
        isValid = false;
    }


    if (isValid) {
      // Replace with actual DAO submission handler, e.g., PAPI call
      console.log("DAO Referral Data:", {
        daoReferral,
        daoDecision,
        appealFee: numericAppealFee, // Pass the numeric value for backend/blockchain
      });
      alert("DAO Referral submitted (stub). In a real DApp, this would interact with the blockchain.");
      // If you added onSubmitReferral prop:
      // onSubmitReferral({ referral: daoReferral, decision: daoDecision, fee: numericAppealFee });
    } else {
      alert("Please correct the errors in the form."); // Simple alert for MVP validation
    }
  };

  const isFormValid = daoReferral.trim() !== "" && daoDecision.trim() !== "" && appealFeeError === null;


  return (
    <div className="form-group">
      <h2>DAO Referral & Decision</h2>

      <textarea
        placeholder="Describe your DAO referral or issue..."
        value={daoReferral}
        onChange={(e) => {
          setDaoReferral(e.target.value);
          setReferralError(null); // Clear error on change
        }}
        className="form-textarea"
        rows={4}
      />
      {referralError && <p className="text-red-500 text-sm mt-1">{referralError}</p>} {/* Assuming a red text class */}


      <input
        type="text"
        placeholder="DAO Decision"
        value={daoDecision}
        onChange={(e) => {
          setDaoDecision(e.target.value);
          setDecisionError(null); // Clear error on change
        }}
        className="form-input"
      />
      {decisionError && <p className="text-red-500 text-sm mt-1">{decisionError}</p>}


      <input
        type="number"
        placeholder="Appeal Fee (in tokens)"
        value={appealFee}
        onChange={handleAppealFeeChange}
        className="form-input"
      />
      {appealFeeError && <p className="text-red-500 text-sm mt-1">{appealFeeError}</p>}


      <button
        type="button"
        className="primary-button mt-2"
        onClick={handleSubmit}
        disabled={!isFormValid} // Disable button if form is not valid
      >
        Submit Referral
      </button>
    </div>
  );
};

export default DaoReferralForm;
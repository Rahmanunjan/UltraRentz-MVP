import { useCallback } from 'react';

interface StakeDepositFormProps {
  stakeStatus: string;
  setStakeStatus: (status: string) => void;
  onStakeDeposit: () => void;
  isStaking?: boolean;
}

export default function StakeDepositForm({
  stakeStatus,
  setStakeStatus: _setStakeStatus, // ✅ Alias here to avoid "unused" error
  onStakeDeposit,
  isStaking = false,
}: StakeDepositFormProps) {

  const handleStakeClick = useCallback(() => {
    onStakeDeposit();
  }, [onStakeDeposit]);

  return (
    <div className="form-section">
      <h2>Stake Your Deposit</h2>
      <button
        type="button"
        onClick={handleStakeClick}
        disabled={isStaking}
        style={{
          backgroundColor: '#0f5132',
          color: 'white',
          borderRadius: '6px',
          padding: '10px 20px',
          cursor: isStaking ? 'not-allowed' : 'pointer',
          border: 'none',
          minWidth: '150px',
          transition: 'background-color 0.3s ease',
        }}
      >
        {isStaking ? "Staking..." : "🚀 Stake Deposit"}
      </button>

      {stakeStatus && (
        <p
          className="status-text"
          style={{
            marginTop: '10px',
            color: stakeStatus.includes("✅")
              ? 'green'
              : stakeStatus.includes("Error")
              ? 'red'
              : 'inherit',
          }}
        >
          {stakeStatus}
        </p>
      )}
    </div>
  );
}

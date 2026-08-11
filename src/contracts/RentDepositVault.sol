// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RentDepositVault
 * @notice Lease-specific USDC rental deposit escrow with simulated yield.
 *
 * SECURITY MODEL
 *
 * 1. Each deposit belongs to a specific lease.
 * 2. The AI agent cannot arbitrarily withdraw funds.
 * 3. AI may only execute a release that has already become eligible.
 * 4. Tenant receives the deposit automatically when:
 *      - lease has ended
 *      - no landlord claim exists
 *      - claim deadline has expired
 * 5. Landlord claims are limited to the deposit amount.
 * 6. Tenant can accept or dispute a landlord claim.
 * 7. Disputed claims require an arbiter decision.
 * 8. AI-triggered releases have a delay.
 * 9. Recipient addresses are taken from the lease, not supplied
 *    by the caller.
 * 10. Yield is paid from an owner-funded reserve, calculated
 *     transparently on-chain. This is a DEMO mechanism -- production
 *     would route idle deposits into an Arc-native lending/yield
 *     protocol instead of a manually funded reserve.
 *
 * IMPORTANT:
 * This is a security-oriented prototype and should still undergo
 * professional smart-contract auditing before handling production funds.
 */
contract RentDepositVault is
    Ownable2Step,
    Pausable,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;

    // -----------------------------------------------------------------------
    // CONSTANTS
    // -----------------------------------------------------------------------

    uint256 public constant AGENT_DELAY = 1 hours;
    uint256 public constant YIELD_RATE_BPS = 500; // 5% simulated APY - DEMO ONLY

    // -----------------------------------------------------------------------
    // IMMUTABLES
    // -----------------------------------------------------------------------

    IERC20 public immutable usdc;

    // -----------------------------------------------------------------------
    // ROLES
    // -----------------------------------------------------------------------

    address public aiAgent;
    address public arbiter;

    // -----------------------------------------------------------------------
    // YIELD RESERVE
    // -----------------------------------------------------------------------

    uint256 public yieldReserve;

    // -----------------------------------------------------------------------
    // LEASE STATE
    // -----------------------------------------------------------------------

    enum LeaseStatus {
        Active,
        ClaimPeriod,
        Claimed,
        Disputed,
        Resolved,
        Released
    }

    struct Lease {
        address tenant;
        address landlord;

        // Hash of property/lease metadata stored off-chain.
        // For example:
        // keccak256(abi.encode(propertyId, leaseAgreementHash))
        bytes32 leaseHash;

        uint256 deposit;
        uint256 startTime;
        uint256 endTime;

        // Time after lease expiry during which landlord can make
        // a deposit claim.
        uint256 claimDeadline;

        // Amount landlord has claimed.
        uint256 claimedAmount;

        LeaseStatus status;
    }

    mapping(uint256 => Lease) public leases;

    uint256 public nextLeaseId = 1;

    // -----------------------------------------------------------------------
    // AI RELEASE REQUEST
    // -----------------------------------------------------------------------

    struct ReleaseRequest {
        uint256 leaseId;
        uint256 amount;
        uint256 executeAfter;
        bool executed;
    }

    mapping(uint256 => ReleaseRequest) public releaseRequests;

    // -----------------------------------------------------------------------
    // ADMIN TRANSITION DELAYS
    // -----------------------------------------------------------------------

    uint256 public constant AGENT_CHANGE_DELAY = 24 hours;

    address public pendingAgent;
    uint256 public pendingAgentTime;

    address public pendingArbiter;
    uint256 public pendingArbiterTime;

    // -----------------------------------------------------------------------
    // EVENTS
    // -----------------------------------------------------------------------

    event LeaseCreated(
        uint256 indexed leaseId,
        address indexed tenant,
        address indexed landlord,
        uint256 deposit,
        uint256 startTime,
        uint256 endTime,
        uint256 claimDeadline,
        bytes32 leaseHash
    );

    event LeaseFunded(
        uint256 indexed leaseId,
        uint256 amount
    );

    event LandlordClaimSubmitted(
        uint256 indexed leaseId,
        uint256 amount
    );

    event ClaimAccepted(
        uint256 indexed leaseId,
        uint256 amount
    );

    event ClaimDisputed(
        uint256 indexed leaseId
    );

    event ClaimResolved(
        uint256 indexed leaseId,
        uint256 tenantAmount,
        uint256 landlordAmount
    );

    event ReleaseRequested(
        uint256 indexed leaseId,
        uint256 amount,
        uint256 executeAfter
    );

    event DepositReleased(
        uint256 indexed leaseId,
        address indexed recipient,
        uint256 amount
    );

    event AgentChangeRequested(
        address indexed newAgent,
        uint256 executeAfter
    );

    event AgentUpdated(
        address indexed newAgent
    );

    event ArbiterChangeRequested(
        address indexed newArbiter,
        uint256 executeAfter
    );

    event ArbiterUpdated(
        address indexed newArbiter
    );

    event YieldReserveFunded(
        uint256 amount
    );

    event YieldPaid(
        uint256 indexed leaseId,
        address indexed recipient,
        uint256 amount
    );

    // -----------------------------------------------------------------------
    // ERRORS
    // -----------------------------------------------------------------------

    error InvalidAddress();
    error InvalidLease();
    error InvalidAmount();
    error InvalidDates();
    error NotTenant();
    error NotLandlord();
    error NotArbiter();
    error NotAgent();
    error LeaseNotActive();
    error LeaseNotEnded();
    error ClaimPeriodActive();
    error ClaimPeriodExpired();
    error ClaimAlreadyExists();
    error ClaimTooLarge();
    error NoClaim();
    error NotDisputed();
    error AlreadyReleased();
    error ReleaseNotReady();
    error ReleaseAlreadyRequested();
    error InvalidResolution();
    error NothingToRelease();
    error AgentChangeNotReady();
    error ArbiterChangeNotReady();
    error InsufficientVaultBalance();

    // -----------------------------------------------------------------------
    // MODIFIERS
    // -----------------------------------------------------------------------

    modifier onlyAgent() {
        if (msg.sender != aiAgent) {
            revert NotAgent();
        }
        _;
    }

    modifier onlyArbiter() {
        if (msg.sender != arbiter) {
            revert NotArbiter();
        }
        _;
    }

    // -----------------------------------------------------------------------
    // CONSTRUCTOR
    // -----------------------------------------------------------------------

    constructor(
        address _usdc,
        address _aiAgent,
        address _arbiter
    )
        Ownable(msg.sender)
    {
        if (_usdc == address(0)) {
            revert InvalidAddress();
        }

        if (_aiAgent == address(0)) {
            revert InvalidAddress();
        }

        if (_arbiter == address(0)) {
            revert InvalidAddress();
        }

        usdc = IERC20(_usdc);
        aiAgent = _aiAgent;
        arbiter = _arbiter;
    }

    // -----------------------------------------------------------------------
    // LEASE CREATION
    // -----------------------------------------------------------------------

    /**
     * @notice Create a rental lease.
     *
     * The tenant and landlord are permanently attached to this lease.
     * Funds cannot later be redirected to arbitrary addresses.
     */
    function createLease(
        address tenant,
        address landlord,
        bytes32 leaseHash,
        uint256 depositAmount,
        uint256 startTime,
        uint256 endTime,
        uint256 claimPeriod
    )
        external
        whenNotPaused
        nonReentrant
        returns (uint256 leaseId)
    {
        if (tenant == address(0) || landlord == address(0)) {
            revert InvalidAddress();
        }

        if (depositAmount == 0) {
            revert InvalidAmount();
        }

        if (endTime <= startTime) {
            revert InvalidDates();
        }

        if (claimPeriod == 0) {
            revert InvalidDates();
        }

        leaseId = nextLeaseId++;

        leases[leaseId] = Lease({
            tenant: tenant,
            landlord: landlord,
            leaseHash: leaseHash,
            deposit: depositAmount,
            startTime: startTime,
            endTime: endTime,
            claimDeadline: endTime + claimPeriod,
            claimedAmount: 0,
            status: LeaseStatus.Active
        });

        emit LeaseCreated(
            leaseId,
            tenant,
            landlord,
            depositAmount,
            startTime,
            endTime,
            endTime + claimPeriod,
            leaseHash
        );
    }

    // -----------------------------------------------------------------------
    // FUND LEASE
    // -----------------------------------------------------------------------

    /**
     * @notice Fund a lease with USDC.
     *
     * The caller must be the tenant.
     *
     * The actual vault balance change is measured so accounting is
     * protected against fee-on-transfer style tokens.
     */
    function fundLease(uint256 leaseId)
        external
        whenNotPaused
        nonReentrant
    {
        Lease storage lease = leases[leaseId];

        if (lease.tenant == address(0)) {
            revert InvalidLease();
        }

        if (msg.sender != lease.tenant) {
            revert NotTenant();
        }

        if (lease.status != LeaseStatus.Active) {
            revert LeaseNotActive();
        }

        uint256 beforeBalance = usdc.balanceOf(address(this));

        usdc.safeTransferFrom(
            msg.sender,
            address(this),
            lease.deposit
        );

        uint256 afterBalance = usdc.balanceOf(address(this));

        uint256 received = afterBalance - beforeBalance;

        if (received != lease.deposit) {
            revert InvalidAmount();
        }

        emit LeaseFunded(
            leaseId,
            received
        );
    }

    // -----------------------------------------------------------------------
    // YIELD RESERVE
    // -----------------------------------------------------------------------

    /**
     * @notice Owner tops up the yield reserve with real USDC.
     *
     * DEMO NOTE: in production this would be replaced by routing idle
     * deposits into an Arc-native lending/yield protocol. For this
     * demo, the vault owner seeds a real, on-chain, verifiable reserve
     * instead of faking a number.
     */
    function fundYieldReserve(uint256 amount)
        external
        onlyOwner
        nonReentrant
    {
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        yieldReserve += amount;
        emit YieldReserveFunded(amount);
    }

    /**
     * @notice Returns the simulated yield accrued for a lease so far.
     *
     * Calculated at YIELD_RATE_BPS simple APY over the time elapsed
     * between the lease start and either now or the lease end time,
     * whichever is earlier.
     */
    function pendingYield(uint256 leaseId)
        public
        view
        returns (uint256)
    {
        Lease memory lease = leases[leaseId];

        if (lease.tenant == address(0)) {
            return 0;
        }

        uint256 endPoint = block.timestamp < lease.endTime
            ? block.timestamp
            : lease.endTime;

        if (endPoint <= lease.startTime) {
            return 0;
        }

        uint256 elapsed = endPoint - lease.startTime;

        return (lease.deposit * YIELD_RATE_BPS * elapsed) / (365 days * 10_000);
    }

    // -----------------------------------------------------------------------
    // LANDLORD CLAIM
    // -----------------------------------------------------------------------

    /**
     * @notice Landlord submits a damage/arrears claim.
     *
     * Claims cannot exceed the tenant's deposit.
     */
    function submitClaim(
        uint256 leaseId,
        uint256 amount
    )
        external
        whenNotPaused
        nonReentrant
    {
        Lease storage lease = leases[leaseId];

        if (lease.tenant == address(0)) {
            revert InvalidLease();
        }

        if (msg.sender != lease.landlord) {
            revert NotLandlord();
        }

        if (block.timestamp < lease.endTime) {
            revert LeaseNotEnded();
        }

        if (block.timestamp > lease.claimDeadline) {
            revert ClaimPeriodExpired();
        }

        if (lease.status != LeaseStatus.ClaimPeriod) {
            if (lease.status != LeaseStatus.Active) {
                revert ClaimAlreadyExists();
            }

            lease.status = LeaseStatus.ClaimPeriod;
        }

        if (amount == 0) {
            revert InvalidAmount();
        }

        if (amount > lease.deposit) {
            revert ClaimTooLarge();
        }

        if (lease.claimedAmount != 0) {
            revert ClaimAlreadyExists();
        }

        lease.claimedAmount = amount;
        lease.status = LeaseStatus.Claimed;

        emit LandlordClaimSubmitted(
            leaseId,
            amount
        );
    }

    // -----------------------------------------------------------------------
    // TENANT ACCEPTS CLAIM
    // -----------------------------------------------------------------------

    /**
     * @notice Tenant accepts the landlord's claim.
     *
     * This is preferable to giving an AI unrestricted authority.
     */
    function acceptClaim(uint256 leaseId)
        external
        whenNotPaused
        nonReentrant
    {
        Lease storage lease = leases[leaseId];

        if (lease.tenant == address(0)) {
            revert InvalidLease();
        }

        if (msg.sender != lease.tenant) {
            revert NotTenant();
        }

        if (lease.status != LeaseStatus.Claimed) {
            revert NoClaim();
        }

        lease.status = LeaseStatus.Resolved;

        emit ClaimAccepted(
            leaseId,
            lease.claimedAmount
        );
    }

    // -----------------------------------------------------------------------
    // TENANT DISPUTES CLAIM
    // -----------------------------------------------------------------------

    /**
     * @notice Tenant disputes a landlord claim.
     *
     * Once disputed, the AI agent cannot release the deposit.
     * An arbiter must resolve the dispute.
     */
    function disputeClaim(uint256 leaseId)
        external
        whenNotPaused
        nonReentrant
    {
        Lease storage lease = leases[leaseId];

        if (lease.tenant == address(0)) {
            revert InvalidLease();
        }

        if (msg.sender != lease.tenant) {
            revert NotTenant();
        }

        if (lease.status != LeaseStatus.Claimed) {
            revert NoClaim();
        }

        lease.status = LeaseStatus.Disputed;

        emit ClaimDisputed(leaseId);
    }

    // -----------------------------------------------------------------------
    // ARBITRATION
    // -----------------------------------------------------------------------

    /**
     * @notice Arbiter resolves a disputed claim.
     *
     * tenantAmount + landlordAmount must equal the original deposit.
     *
     * This prevents the arbiter from accidentally creating or destroying
     * accounting value.
     */
    function resolveDispute(
        uint256 leaseId,
        uint256 tenantAmount,
        uint256 landlordAmount
    )
        external
        onlyArbiter
        whenNotPaused
        nonReentrant
    {
        Lease storage lease = leases[leaseId];

        if (lease.tenant == address(0)) {
            revert InvalidLease();
        }

        if (lease.status != LeaseStatus.Disputed) {
            revert NotDisputed();
        }

        if (
            tenantAmount + landlordAmount !=
            lease.deposit
        ) {
            revert InvalidResolution();
        }

        lease.status = LeaseStatus.Resolved;

        emit ClaimResolved(
            leaseId,
            tenantAmount,
            landlordAmount
        );
    }

    // -----------------------------------------------------------------------
    // AI RELEASE REQUEST
    // -----------------------------------------------------------------------

    /**
     * @notice AI requests a release.
     *
     * CRITICAL SECURITY PROPERTY:
     *
     * The AI does NOT specify the recipient.
     *
     * The recipient is determined by protocol state.
     *
     * The AI also cannot choose an arbitrary amount.
     *
     * The amount is derived from the lease.
     */
    function requestRelease(uint256 leaseId)
        external
        onlyAgent
        whenNotPaused
        nonReentrant
    {
        Lease storage lease = leases[leaseId];

        if (lease.tenant == address(0)) {
            revert InvalidLease();
        }

        if (lease.status == LeaseStatus.Released) {
            revert AlreadyReleased();
        }

        ReleaseRequest storage request =
            releaseRequests[leaseId];

        if (request.executeAfter != 0 && !request.executed) {
            revert ReleaseAlreadyRequested();
        }

        uint256 amount;

        /**
         * CASE 1:
         *
         * Lease ended.
         * No landlord claim.
         * Claim deadline has expired.
         *
         * Entire deposit returns to tenant.
         */
        if (
            block.timestamp >= lease.claimDeadline &&
            lease.claimedAmount == 0
        ) {
            amount = lease.deposit;

            lease.status = LeaseStatus.Resolved;
        }

        /**
         * CASE 2:
         *
         * Landlord claim was accepted/resolved.
         *
         * For this simplified implementation, the claim amount goes
         * to the landlord and the remainder goes to the tenant.
         */
        else if (
            lease.status == LeaseStatus.Resolved &&
            lease.claimedAmount > 0
        ) {
            amount = lease.deposit;
        }

        else {
            revert NothingToRelease();
        }

        releaseRequests[leaseId] = ReleaseRequest({
            leaseId: leaseId,
            amount: amount,
            executeAfter: block.timestamp + AGENT_DELAY,
            executed: false
        });

        emit ReleaseRequested(
            leaseId,
            amount,
            block.timestamp + AGENT_DELAY
        );
    }

    // -----------------------------------------------------------------------
    // EXECUTE RELEASE
    // -----------------------------------------------------------------------

    /**
     * @notice Execute a previously approved AI release.
     *
     * The AI agent can call requestRelease(), but the delay gives
     * the protocol time to detect/dispute unexpected actions.
     *
     * Accrued yield (if any, and if the reserve has funds) is paid
     * to the tenant alongside the principal release.
     */
    function executeRelease(uint256 leaseId)
        external
        whenNotPaused
        nonReentrant
    {
        ReleaseRequest storage request =
            releaseRequests[leaseId];

        Lease storage lease = leases[leaseId];

        if (request.executeAfter == 0) {
            revert ReleaseNotReady();
        }

        if (request.executed) {
            revert AlreadyReleased();
        }

        if (block.timestamp < request.executeAfter) {
            revert ReleaseNotReady();
        }

        if (lease.status == LeaseStatus.Disputed) {
            revert NotDisputed();
        }

        request.executed = true;
        lease.status = LeaseStatus.Released;

        // ---------------------------------------------------------------
        // YIELD PAYOUT (added, DEMO mechanism)
        // ---------------------------------------------------------------
        uint256 yieldDue = pendingYield(leaseId);
        if (yieldDue > yieldReserve) {
            yieldDue = yieldReserve;
        }
        if (yieldDue > 0) {
            yieldReserve -= yieldDue;
            usdc.safeTransfer(lease.tenant, yieldDue);
            emit YieldPaid(leaseId, lease.tenant, yieldDue);
        }

        /**
         * NO ARBITRARY RECIPIENTS.
         *
         * Recipients come directly from the lease.
         */
        if (lease.claimedAmount == 0) {

            // Entire deposit goes back to tenant.
            usdc.safeTransfer(
                lease.tenant,
                lease.deposit
            );

            emit DepositReleased(
                leaseId,
                lease.tenant,
                lease.deposit
            );
        }
        else {

            uint256 landlordAmount =
                lease.claimedAmount;

            uint256 tenantAmount =
                lease.deposit - landlordAmount;

            if (landlordAmount > 0) {
                usdc.safeTransfer(
                    lease.landlord,
                    landlordAmount
                );

                emit DepositReleased(
                    leaseId,
                    lease.landlord,
                    landlordAmount
                );
            }

            if (tenantAmount > 0) {
                usdc.safeTransfer(
                    lease.tenant,
                    tenantAmount
                );

                emit DepositReleased(
                    leaseId,
                    lease.tenant,
                    tenantAmount
                );
            }
        }
    }

    // -----------------------------------------------------------------------
    // ADMIN: AI AGENT
    // -----------------------------------------------------------------------

    /**
     * @notice Begin changing the AI agent.
     *
     * IMPORTANT:
     * Agent changes are delayed.
     */
    function requestAgentChange(address newAgent)
        external
        onlyOwner
    {
        if (newAgent == address(0)) {
            revert InvalidAddress();
        }

        pendingAgent = newAgent;
        pendingAgentTime =
            block.timestamp + AGENT_CHANGE_DELAY;

        emit AgentChangeRequested(
            newAgent,
            pendingAgentTime
        );
    }

    /**
     * @notice Finalise an AI agent change after the delay.
     */
    function executeAgentChange()
        external
        onlyOwner
    {
        if (
            pendingAgent == address(0) ||
            block.timestamp < pendingAgentTime
        ) {
            revert AgentChangeNotReady();
        }

        aiAgent = pendingAgent;

        pendingAgent = address(0);
        pendingAgentTime = 0;

        emit AgentUpdated(aiAgent);
    }

    // -----------------------------------------------------------------------
    // ADMIN: ARBITER
    // -----------------------------------------------------------------------

    function requestArbiterChange(address newArbiter)
        external
        onlyOwner
    {
        if (newArbiter == address(0)) {
            revert InvalidAddress();
        }

        pendingArbiter = newArbiter;

        pendingArbiterTime =
            block.timestamp + AGENT_CHANGE_DELAY;

        emit ArbiterChangeRequested(
            newArbiter,
            pendingArbiterTime
        );
    }

    function executeArbiterChange()
        external
        onlyOwner
    {
        if (
            pendingArbiter == address(0) ||
            block.timestamp < pendingArbiterTime
        ) {
            revert ArbiterChangeNotReady();
        }

        arbiter = pendingArbiter;

        pendingArbiter = address(0);
        pendingArbiterTime = 0;

        emit ArbiterUpdated(arbiter);
    }

    // -----------------------------------------------------------------------
    // EMERGENCY PAUSE
    // -----------------------------------------------------------------------

    /**
     * @notice Emergency stop.
     *
     * Owner can pause new operations if a serious vulnerability is detected.
     *
     * In a production protocol, ownership should ideally be a multisig,
     * not an EOA.
     */
    function pause()
        external
        onlyOwner
    {
        _pause();
    }

    function unpause()
        external
        onlyOwner
    {
        _unpause();
    }

    // -----------------------------------------------------------------------
    // VIEW FUNCTIONS
    // -----------------------------------------------------------------------

    function getLease(uint256 leaseId)
        external
        view
        returns (Lease memory)
    {
        return leases[leaseId];
    }

    /**
     * @notice Returns the amount currently held by the vault.
     */
    function vaultBalance()
        external
        view
        returns (uint256)
    {
        return usdc.balanceOf(address(this));
    }

    /**
     * @notice Returns whether a lease is eligible for automatic
     * tenant release.
     */
    function isEligibleForTenantRelease(
        uint256 leaseId
    )
        public
        view
        returns (bool)
    {
        Lease memory lease = leases[leaseId];

        return (
            lease.tenant != address(0) &&
            block.timestamp >= lease.claimDeadline &&
            lease.claimedAmount == 0 &&
            lease.status != LeaseStatus.Released
        );
    }
}
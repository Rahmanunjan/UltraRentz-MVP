// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import {Test} from "forge-std/Test.sol";
import {RentDepositVault} from "@src/contracts/RentDepositVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev Minimal mintable ERC20 test double. Avoids depending on wherever
///      OpenZeppelin's own mocks happen to live in this repo's pinned
///      lib/openzeppelin-contracts version.
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/// @notice Proves that an arbiter's dispute ruling is NOT enforced by
///         executeRelease — the payout silently reverts to the landlord's
///         original (disputed) claim amount instead.
contract RentDepositVaultDisputeBugTest is Test {
    RentDepositVault vault;
    MockUSDC usdc;

    address owner = address(this);
    address agent = address(0xA6E47);
    address arbiter = address(0xA6B17E4);
    address tenant = address(0x7E4A47);
    address landlord = address(0x1A47D);

    uint256 constant DEPOSIT = 1_000e18;

    function setUp() public {
        usdc = new MockUSDC();
        vault = new RentDepositVault(address(usdc), agent, arbiter);

        usdc.mint(tenant, DEPOSIT);
        vm.prank(tenant);
        usdc.approve(address(vault), DEPOSIT);
    }

    function _createAndFundLease(uint256 start, uint256 end, uint256 claimPeriod)
        internal
        returns (uint256 leaseId)
    {
        leaseId = vault.createLease(
            tenant, landlord, keccak256("lease-1"), DEPOSIT, start, end, claimPeriod
        );
        vm.prank(tenant);
        vault.fundLease(leaseId);
    }

    /// @dev Arbiter rules 100% to the tenant (landlord's claim was bogus).
    ///      The contract should pay the tenant the full deposit back.
    ///      Instead, it pays the landlord's original claimed amount.
    function test_ArbiterRulingIsIgnored_LandlordGetsPaidAnyway() public {
        uint256 start = block.timestamp;
        uint256 end = start + 30 days;
        uint256 claimPeriod = 7 days;

        uint256 leaseId = _createAndFundLease(start, end, claimPeriod);

        vm.warp(end + 1);

        // Landlord submits a bogus claim for the FULL deposit.
        vm.prank(landlord);
        vault.submitClaim(leaseId, DEPOSIT);

        // Tenant disputes it.
        vm.prank(tenant);
        vault.disputeClaim(leaseId);

        // Arbiter rules entirely in the tenant's favor: landlord gets 0.
        vm.prank(arbiter);
        vault.resolveDispute(leaseId, DEPOSIT, 0);

        // Agent requests release, delay passes, anyone executes.
        vm.prank(agent);
        vault.requestRelease(leaseId);
        vm.warp(block.timestamp + vault.AGENT_DELAY());

        uint256 landlordBefore = usdc.balanceOf(landlord);
        uint256 tenantBefore = usdc.balanceOf(tenant);

        vault.executeRelease(leaseId);

        uint256 landlordAfter = usdc.balanceOf(landlord);
        uint256 tenantAfter = usdc.balanceOf(tenant);

        // What SHOULD happen per the arbiter's ruling:
        //   landlord receives 0, tenant receives the full deposit back.
        //
        // What ACTUALLY happens: the payout ignores the ruling and uses
        // lease.claimedAmount (the landlord's original, disputed claim),
        // so the landlord is paid the full deposit despite losing the dispute.
        assertEq(
            landlordAfter - landlordBefore,
            0,
            "BUG: landlord was paid despite arbiter ruling 0 in their favor"
        );
        assertEq(
            tenantAfter - tenantBefore,
            DEPOSIT,
            "BUG: tenant did not receive the deposit the arbiter awarded them"
        );
    }
}
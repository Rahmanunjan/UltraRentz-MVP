// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {Script, console} from "forge-std/Script.sol";
import "../src/contracts/RentDepositVault.sol";

contract DeployMVP is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        RentDepositVault vault = new RentDepositVault();

        vm.stopBroadcast();
        
        console.log("Vault deployed at:", address(vault));
    }
}
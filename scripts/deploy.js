const hre = require("hardhat");

async function main() {
    console.log("Deploying contract...");
    const AuthMessageContract = await hre.ethers.getContractFactory("AuthMessageContract");
    const contract = await AuthMessageContract.deploy();

    await contract.waitForDeployment();

    console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

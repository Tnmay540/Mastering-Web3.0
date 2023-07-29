const hre = require("hardhat");

async function main() {

  const storage = await hre.ethers.deployContract("VotingContract");

  await storage.waitForDeployment();

  console.log(
    `VotingContract deployed to ${storage.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const SmartWallet = await ethers.getContractFactory("SmartWallet");
    const smartWallet = await SmartWallet.deploy(deployer.address);
    console.log("SmartWallet contract deployed to:", smartWallet.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  
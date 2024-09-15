const { expect } = require("chai");

describe("SmartWallet", function () {
  let SmartWallet;
  let smartWallet;
  let owner;
  let recoveryAddress;
  let addr1;

  beforeEach(async function () {
    [owner, recoveryAddress, addr1] = await ethers.getSigners();
    SmartWallet = await ethers.getContractFactory("SmartWallet");
    smartWallet = await SmartWallet.deploy(recoveryAddress.address);
    await smartWallet.deployed();
  });

  it("Should set the right owner", async function () {
    expect(await smartWallet.owner()).to.equal(owner.address);
  });

  it("Should deposit ETH", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    await owner.sendTransaction({
      to: smartWallet.address,
      value: depositAmount,
    });
    const balance = await smartWallet.getBalance();
    expect(balance).to.equal(depositAmount);
  });

  it("Should allow the owner to withdraw", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    await owner.sendTransaction({
      to: smartWallet.address,
      value: depositAmount,
    });

    await smartWallet.withdraw(depositAmount, owner.address);
    const balance = await smartWallet.getBalance();
    expect(balance).to.equal(0);
  });

  it("Should transfer ETH to another address", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    await owner.sendTransaction({
      to: smartWallet.address,
      value: depositAmount,
    });

    await smartWallet.transferTo(addr1.address, depositAmount);
    expect(await ethers.provider.getBalance(addr1.address)).to.equal(
      depositAmount
    );
  });
});

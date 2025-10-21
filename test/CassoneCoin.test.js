const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CassoneCoin", function () {
  let cassoneCoin;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  const INITIAL_SUPPLY = 1000000; // 1 million tokens

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy CassoneCoin contract
    const CassoneCoin = await ethers.getContractFactory("CassoneCoin");
    cassoneCoin = await CassoneCoin.deploy(INITIAL_SUPPLY);
    await cassoneCoin.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await cassoneCoin.name()).to.equal("Cassone Coin");
      expect(await cassoneCoin.symbol()).to.equal("CASS");
    });

    it("Should have 18 decimals", async function () {
      expect(await cassoneCoin.decimals()).to.equal(18);
    });

    it("Should mint initial supply to deployer", async function () {
      const ownerBalance = await cassoneCoin.balanceOf(owner.address);
      const expectedSupply = ethers.parseUnits(INITIAL_SUPPLY.toString(), 18);
      expect(ownerBalance).to.equal(expectedSupply);
    });

    it("Should set the right owner", async function () {
      expect(await cassoneCoin.owner()).to.equal(owner.address);
    });

    it("Should have correct total supply", async function () {
      const totalSupply = await cassoneCoin.totalSupply();
      const expectedSupply = ethers.parseUnits(INITIAL_SUPPLY.toString(), 18);
      expect(totalSupply).to.equal(expectedSupply);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const amount = ethers.parseEther("100");

      // Transfer from owner to addr1
      await cassoneCoin.transfer(addr1.address, amount);
      expect(await cassoneCoin.balanceOf(addr1.address)).to.equal(amount);

      // Transfer from addr1 to addr2
      await cassoneCoin.connect(addr1).transfer(addr2.address, ethers.parseEther("50"));
      expect(await cassoneCoin.balanceOf(addr2.address)).to.equal(ethers.parseEther("50"));
      expect(await cassoneCoin.balanceOf(addr1.address)).to.equal(ethers.parseEther("50"));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await cassoneCoin.balanceOf(owner.address);

      // Try to send more tokens than addr1 has
      await expect(
        cassoneCoin.connect(addr1).transfer(owner.address, ethers.parseEther("1"))
      ).to.be.reverted;

      // Owner balance shouldn't have changed
      expect(await cassoneCoin.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await cassoneCoin.balanceOf(owner.address);
      const amount = ethers.parseEther("100");

      // Transfer from owner to addr1
      await cassoneCoin.transfer(addr1.address, amount);

      // Transfer from owner to addr2
      await cassoneCoin.transfer(addr2.address, amount);

      const finalOwnerBalance = await cassoneCoin.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - (amount * 2n));

      expect(await cassoneCoin.balanceOf(addr1.address)).to.equal(amount);
      expect(await cassoneCoin.balanceOf(addr2.address)).to.equal(amount);
    });

    it("Should emit Transfer event", async function () {
      const amount = ethers.parseEther("100");

      await expect(cassoneCoin.transfer(addr1.address, amount))
        .to.emit(cassoneCoin, "Transfer")
        .withArgs(owner.address, addr1.address, amount);
    });

    it("Should handle zero amount transfers", async function () {
      await expect(cassoneCoin.transfer(addr1.address, 0))
        .to.emit(cassoneCoin, "Transfer")
        .withArgs(owner.address, addr1.address, 0);
    });
  });

  describe("Allowances", function () {
    it("Should approve tokens for spending", async function () {
      const amount = ethers.parseEther("100");

      await cassoneCoin.approve(addr1.address, amount);
      expect(await cassoneCoin.allowance(owner.address, addr1.address)).to.equal(amount);
    });

    it("Should emit Approval event", async function () {
      const amount = ethers.parseEther("100");

      await expect(cassoneCoin.approve(addr1.address, amount))
        .to.emit(cassoneCoin, "Approval")
        .withArgs(owner.address, addr1.address, amount);
    });

    it("Should transfer tokens using allowance", async function () {
      const amount = ethers.parseEther("100");

      // Owner approves addr1 to spend tokens
      await cassoneCoin.approve(addr1.address, amount);

      // addr1 transfers from owner to addr2
      await cassoneCoin.connect(addr1).transferFrom(owner.address, addr2.address, amount);

      expect(await cassoneCoin.balanceOf(addr2.address)).to.equal(amount);
      expect(await cassoneCoin.allowance(owner.address, addr1.address)).to.equal(0);
    });

    it("Should fail transferFrom if allowance is insufficient", async function () {
      const amount = ethers.parseEther("100");

      // Approve only 50 tokens
      await cassoneCoin.approve(addr1.address, ethers.parseEther("50"));

      // Try to transfer 100 tokens
      await expect(
        cassoneCoin.connect(addr1).transferFrom(owner.address, addr2.address, amount)
      ).to.be.reverted;
    });

    it("Should update allowance after partial transferFrom", async function () {
      const approvedAmount = ethers.parseEther("100");
      const transferAmount = ethers.parseEther("40");

      await cassoneCoin.approve(addr1.address, approvedAmount);
      await cassoneCoin.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);

      expect(await cassoneCoin.allowance(owner.address, addr1.address))
        .to.equal(approvedAmount - transferAmount);
    });

    it("Should allow increasing allowance", async function () {
      await cassoneCoin.approve(addr1.address, ethers.parseEther("100"));
      await cassoneCoin.approve(addr1.address, ethers.parseEther("200"));

      expect(await cassoneCoin.allowance(owner.address, addr1.address))
        .to.equal(ethers.parseEther("200"));
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      const initialSupply = await cassoneCoin.totalSupply();

      await cassoneCoin.mint(addr1.address, mintAmount);

      expect(await cassoneCoin.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await cassoneCoin.totalSupply()).to.equal(initialSupply + mintAmount);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");

      await expect(
        cassoneCoin.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWithCustomError(cassoneCoin, "OwnableUnauthorizedAccount");
    });

    it("Should emit Transfer event when minting", async function () {
      const mintAmount = ethers.parseEther("1000");

      await expect(cassoneCoin.mint(addr1.address, mintAmount))
        .to.emit(cassoneCoin, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, mintAmount);
    });

    it("Should mint to multiple addresses", async function () {
      const mintAmount = ethers.parseEther("500");

      await cassoneCoin.mint(addr1.address, mintAmount);
      await cassoneCoin.mint(addr2.address, mintAmount);

      expect(await cassoneCoin.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await cassoneCoin.balanceOf(addr2.address)).to.equal(mintAmount);
    });

    it("Should update total supply correctly after multiple mints", async function () {
      const initialSupply = await cassoneCoin.totalSupply();
      const mintAmount1 = ethers.parseEther("500");
      const mintAmount2 = ethers.parseEther("300");

      await cassoneCoin.mint(addr1.address, mintAmount1);
      await cassoneCoin.mint(addr2.address, mintAmount2);

      expect(await cassoneCoin.totalSupply())
        .to.equal(initialSupply + mintAmount1 + mintAmount2);
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await cassoneCoin.transferOwnership(addr1.address);
      expect(await cassoneCoin.owner()).to.equal(addr1.address);
    });

    it("Should emit OwnershipTransferred event", async function () {
      await expect(cassoneCoin.transferOwnership(addr1.address))
        .to.emit(cassoneCoin, "OwnershipTransferred")
        .withArgs(owner.address, addr1.address);
    });

    it("Should not allow non-owner to transfer ownership", async function () {
      await expect(
        cassoneCoin.connect(addr1).transferOwnership(addr2.address)
      ).to.be.revertedWithCustomError(cassoneCoin, "OwnableUnauthorizedAccount");
    });

    it("Should allow new owner to mint after ownership transfer", async function () {
      await cassoneCoin.transferOwnership(addr1.address);

      const mintAmount = ethers.parseEther("1000");
      await cassoneCoin.connect(addr1).mint(addr2.address, mintAmount);

      expect(await cassoneCoin.balanceOf(addr2.address)).to.equal(mintAmount);
    });

    it("Should not allow old owner to mint after ownership transfer", async function () {
      await cassoneCoin.transferOwnership(addr1.address);

      await expect(
        cassoneCoin.mint(addr2.address, ethers.parseEther("1000"))
      ).to.be.revertedWithCustomError(cassoneCoin, "OwnableUnauthorizedAccount");
    });

    it("Should renounce ownership", async function () {
      await cassoneCoin.renounceOwnership();
      expect(await cassoneCoin.owner()).to.equal(ethers.ZeroAddress);
    });

    it("Should not allow minting after renouncing ownership", async function () {
      await cassoneCoin.renounceOwnership();

      await expect(
        cassoneCoin.mint(addr1.address, ethers.parseEther("1000"))
      ).to.be.revertedWithCustomError(cassoneCoin, "OwnableUnauthorizedAccount");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle maximum uint256 approval", async function () {
      const maxUint256 = ethers.MaxUint256;
      await cassoneCoin.approve(addr1.address, maxUint256);
      expect(await cassoneCoin.allowance(owner.address, addr1.address)).to.equal(maxUint256);
    });

    it("Should revert on transfer to zero address", async function () {
      await expect(
        cassoneCoin.transfer(ethers.ZeroAddress, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(cassoneCoin, "ERC20InvalidReceiver");
    });

    it("Should revert on approve to zero address", async function () {
      await expect(
        cassoneCoin.approve(ethers.ZeroAddress, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(cassoneCoin, "ERC20InvalidSpender");
    });

    it("Should handle self-transfer", async function () {
      const amount = ethers.parseEther("100");
      const initialBalance = await cassoneCoin.balanceOf(owner.address);

      await cassoneCoin.transfer(owner.address, amount);

      expect(await cassoneCoin.balanceOf(owner.address)).to.equal(initialBalance);
    });
  });

  describe("Gas Optimization", function () {
    it("Should efficiently handle batch transfers", async function () {
      const amount = ethers.parseEther("10");

      for (let i = 0; i < 5; i++) {
        await cassoneCoin.transfer(addrs[i].address, amount);
      }

      for (let i = 0; i < 5; i++) {
        expect(await cassoneCoin.balanceOf(addrs[i].address)).to.equal(amount);
      }
    });
  });
});

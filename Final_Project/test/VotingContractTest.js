const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingContract", function () {
  let votingContract;
  let owner, addr1, addr2, addr3;

  beforeEach(async () => {
    const VotingContract = await ethers.getContractFactory("VotingContract");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    votingContract = await VotingContract.deploy();

  });

  it("should set the owner to the address that created the contract", async () => {
    const contractOwner = await votingContract.owner();
    expect(contractOwner).to.equal(owner.address);
  });

  it("should start with votingStarted and votingEnded as false", async () => {
    const votingStarted = await votingContract.votingStarted();
    const votingEnded = await votingContract.votingEnded();
    expect(votingStarted).to.equal(false);
    expect(votingEnded).to.equal(false);
  });

  it("should allow candidates to register themselves", async () => {
    await votingContract.connect(addr1).registerCandidate(0, "Candidate 1");
    await votingContract.connect(addr2).registerCandidate(1, "Candidate 2");
    await votingContract.connect(addr3).registerCandidate(2, "Candidate 3");

    const candidate1 = await votingContract.candidates(0, addr1.address);
    const candidate2 = await votingContract.candidates(1, addr2.address);
    const candidate3 = await votingContract.candidates(2, addr3.address);

    expect(candidate1.isRegistered).to.equal(true);
    expect(candidate2.isRegistered).to.equal(true);
    expect(candidate3.isRegistered).to.equal(true);
  });


  it("should allow registered voters to vote", async () => {
    await votingContract.connect(owner).registerCandidate(0, "Candidate 1");
    await votingContract.connect(addr1).registerCandidate(0, "Candidate 2");
    await votingContract.connect(addr2).registerCandidate(0, "Candidate 3");
    await votingContract.connect(addr1).registerVoter();
    await votingContract.connect(owner).startVoting();
    await votingContract.connect(addr1).vote(0, owner.address,addr1.address, addr2.address);
    const candidate1Votes = await votingContract.candidates(0, owner.address);
    expect(candidate1Votes.voteCount).to.equal(5);
  });

  it("should prevent unregistered voters from voting", async () => {
    await votingContract.connect(owner).registerCandidate(0, "Candidate 1");
    await expect(votingContract.connect(addr1).vote(0, owner.address, addr1.address, addr2.address)).to.be.revertedWith(
      "You are not a registered voter"
    );
  });

  it("should prevent voters from voting multiple times", async () => {
    await votingContract.connect(owner).registerCandidate(0, "Candidate 1");
    await votingContract.connect(addr1).registerCandidate(0, "Candidate 2");
    await votingContract.connect(addr2).registerCandidate(0, "Candidate 3");
    await votingContract.connect(addr1).registerVoter();
    await votingContract.connect(owner).startVoting();
    await votingContract.connect(addr1).vote(0, owner.address,addr1.address, addr2.address);
    await expect(votingContract.connect(addr1).vote(0, owner.address,addr1.address, addr2.address)).to.be.revertedWith(
      "You have already cast your vote"
    );
  });

  it("should declare the correct winner after voting ends", async () => {
    await votingContract.connect(addr1).registerCandidate(0, "Candidate 1");
    await votingContract.connect(addr2).registerCandidate(0, "Candidate 2");
    await votingContract.connect(addr3).registerCandidate(0, "Candidate 3");
    await votingContract.connect(addr1).registerVoter();
    await votingContract.connect(addr2).registerVoter();
    await votingContract.connect(addr3).registerVoter();
    await votingContract.connect(owner).startVoting();
    await votingContract.connect(addr1).vote(0, addr1.address, addr2.address, addr3.address);
    await votingContract.connect(addr2).vote(0, addr1.address, addr2.address, addr3.address);
    await votingContract.connect(owner).endVoting();
    const result = await votingContract.connect(owner).declareResult(0);
    expect(result.winner).to.equal(addr1.address);
    expect(result.votes).to.equal(10);
  });

});

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    address public owner;
    bool public votingStarted;
    bool public votingEnded;

    struct Candidate {
        string name;
        bool isRegistered;
        uint256 voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        address firstPreference;
        address secondPreference;
        address thirdPreference;
    }

    enum Post {
        President,
        GeneralSecretaryGamesSports,
        GeneralSecretaryMediaCulture,
        GeneralSecretaryScienceTech,
        GeneralSecretaryAcademicsCareer
    }

    mapping(Post => mapping(address => Candidate)) public candidates;
    mapping(Post => address[]) public candidateAddressesByPost;
    mapping(address => bool) public isCandidateRegistered;
    mapping(address => Voter) public voters;

    event CandidateRegistered(Post indexed post, address indexed candidateAddress, string candidateName);
    event VoteCast(Post indexed post, address indexed voter, address indexed candidate, uint8 preference);
    event VotingStarted();
    event VotingEnded();
    event ResultDeclared(Post indexed post, address indexed winner, uint256 votes);
    event Error(string message);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "You are not a registered voter");
        _;
    }

    modifier onlyBeforeVotingStarts() {
        require(!votingStarted, "Voting has already started");
        _;
    }

    modifier onlyDuringVoting() {
        require(votingStarted && !votingEnded, "Voting is not in progress");
        _;
    }

    modifier onlyAfterVotingEnds() {
        require(votingEnded, "Voting is still in progress");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerCandidate(Post post, string memory name) external onlyBeforeVotingStarts {
        require(post >= Post.President && post <= Post.GeneralSecretaryAcademicsCareer, "Invalid post");
        require(!isCandidateRegistered[msg.sender], "You have already registered as a candidate");

        candidates[post][msg.sender] = Candidate(name, true, 0);
        candidateAddressesByPost[post].push(msg.sender);
        isCandidateRegistered[msg.sender] = true;

        emit CandidateRegistered(post, msg.sender, name);
    }

    function registerVoter() external onlyBeforeVotingStarts {
        require(!voters[msg.sender].isRegistered, "You are already a registered voter");
        voters[msg.sender].isRegistered = true;
    }

    function vote(Post post, address firstPreference, address secondPreference, address thirdPreference) external onlyRegisteredVoter onlyDuringVoting {
        require(!voters[msg.sender].hasVoted, "You have already cast your vote");
        require(firstPreference != address(0), "Invalid candidate address");

        require(candidates[post][firstPreference].isRegistered, "First preference candidate is not registered");
        require(candidates[post][secondPreference].isRegistered || secondPreference == address(0), "Second preference candidate is not registered");
        require(candidates[post][thirdPreference].isRegistered || thirdPreference == address(0), "Third preference candidate is not registered");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].firstPreference = firstPreference;
        voters[msg.sender].secondPreference = secondPreference;
        voters[msg.sender].thirdPreference = thirdPreference;

        // Increment vote counts
        candidates[post][firstPreference].voteCount += 5;
        if (secondPreference != address(0)) {
            candidates[post][secondPreference].voteCount += 3;
        }
        if (thirdPreference != address(0)) {
            candidates[post][thirdPreference].voteCount += 1;
        }

        emit VoteCast(post, msg.sender, firstPreference, 1);
        emit VoteCast(post, msg.sender, secondPreference, 2);
        emit VoteCast(post, msg.sender, thirdPreference, 3);
    }

    function startVoting() external onlyOwner onlyBeforeVotingStarts {
        votingStarted = true;
        emit VotingStarted();
    }

    function endVoting() external onlyOwner onlyDuringVoting {
        votingEnded = true;
        votingStarted = false;
        emit VotingEnded();
    }

    function declareResult(Post post) public view returns (address winner, uint256 votes) {
        require(votingEnded, "Voting is still in progress");
        
        address[] storage candidateAddresses = candidateAddressesByPost[post];
        for (uint256 i = 0; i < candidateAddresses.length; i++) {
            address candidateAddress = candidateAddresses[i];
            uint256 candidateVotes = candidates[post][candidateAddress].voteCount;
            if (candidateVotes > votes) {
                votes = candidateVotes;
                winner = candidateAddress;
            }
        }
    }
}

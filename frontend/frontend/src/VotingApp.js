
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
const VotingContractABI =  [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "enum VotingContract.Post",
          "name": "post",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "candidateAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "candidateName",
          "type": "string"
        }
      ],
      "name": "CandidateRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "Error",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "enum VotingContract.Post",
          "name": "post",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "votes",
          "type": "uint256"
        }
      ],
      "name": "ResultDeclared",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "enum VotingContract.Post",
          "name": "post",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "candidate",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "preference",
          "type": "uint8"
        }
      ],
      "name": "VoteCast",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "VotingEnded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "VotingStarted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "enum VotingContract.Post",
          "name": "",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidateAddressesByPost",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum VotingContract.Post",
          "name": "",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isRegistered",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum VotingContract.Post",
          "name": "post",
          "type": "uint8"
        }
      ],
      "name": "declareResult",
      "outputs": [
        {
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "votes",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "endVoting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "isCandidateRegistered",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum VotingContract.Post",
          "name": "post",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "registerCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "registerVoter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "startVoting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum VotingContract.Post",
          "name": "post",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "firstPreference",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "secondPreference",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "thirdPreference",
          "type": "address"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isRegistered",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "hasVoted",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "firstPreference",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "secondPreference",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "thirdPreference",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingEnded",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingStarted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

const contractAddress = '0x45C53A15d77CBE5fC7aEf77DC9C2Bd33286E65aD';
function VotingApp() {
  const [web3, setWeb3] = useState(null);
  const [currentAccount, setCurrentAccount] = useState('');
  const [votingContract, setVotingContract] = useState(null);
  const [votingStarted, setVotingStarted] = useState(false);
  const [votingEnded, setVotingEnded] = useState(false);
  const [registeredAsVoter, setRegisteredAsVoter] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [selectedPost, setSelectedPost] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [voteResults, setVoteResults] = useState({});

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.requestAccounts();
          if (accounts.length === 0) {
            console.error('No Ethereum accounts found.');
            return;
          }

          setCurrentAccount(accounts[0]);

          const contract = new web3Instance.eth.Contract(VotingContractABI, contractAddress);
          setVotingContract(contract);
          window.ethereum.on('accountsChanged', (accounts) => {
            setCurrentAccount(accounts[0] || '');
          });

          const isVotingStarted = await contract.methods.votingStarted().call();
          setVotingStarted(isVotingStarted);

          const isVotingEnded = await contract.methods.votingEnded().call();
          setVotingEnded(isVotingEnded);
          const isRegisteredVoter = await contract.methods.voters(currentAccount).call();
          setRegisteredAsVoter(isRegisteredVoter.isRegistered);
          if (isVotingStarted) {
            await fetchCandidates(contract);
          }
        } else {
          console.error('Please install MetaMask to use this app.');
        }
      } catch (error) {
        console.error('Error initializing web3:', error);
      }
    };
    initWeb3();
  }, [currentAccount]);

  const fetchCandidates = async (contract) => {
    try {
      const postNames = Object.values(contract.methods.Post);
      const candidatesData = {};

      for (const post of postNames) {
        const candidateAddresses = await contract.methods.candidateAddressesByPost(post).call();
        const candidates = await Promise.all(
          candidateAddresses.map((address) => contract.methods.candidates(post, address).call())
        );

        candidatesData[post] = candidates;
      }

      setCandidates(candidatesData);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const registerCandidate = async () => {
    try {
      await votingContract.methods.registerCandidate(selectedPost, candidateName).send({ from: currentAccount });
      alert('Successfully registered as a candidate!');
    } catch (error) {
      console.error('Error registering as a candidate:', error);
    }
  };

  const registerVoter = async () => {
    try {
      await votingContract.methods.registerVoter().send({ from: currentAccount });
      setRegisteredAsVoter(true);
      alert('Successfully registered as a voter!');
    } catch (error) {
      console.error('Error registering as a voter:', error);
    }
  };

  const castVote = async (post, firstPreference, secondPreference, thirdPreference) => {
    try {
      await votingContract.methods.vote(post, firstPreference, secondPreference, thirdPreference).send({ from: currentAccount });
      alert('Vote successfully cast!');
    } catch (error) {
      console.error('Error casting vote:', error);
    }
  };

  const startVoting = async () => {
    try {
      await votingContract.methods.startVoting().send({ from: currentAccount });
      setVotingStarted(true);
      await fetchCandidates(votingContract);
    } catch (error) {
      console.error('Error starting voting:', error);
    }
  };

  const endVoting = async () => {
    try {
      await votingContract.methods.endVoting().send({ from: currentAccount });
      setVotingEnded(true);
    } catch (error) {
      console.error('Error ending voting:', error);
    }
  };

  const declareResult = async (post) => {
    try {
      const result = await votingContract.methods.declareResult(post).call();
      setVoteResults((prevResults) => ({ ...prevResults, [post]: result }));
    } catch (error) {
      console.error('Error declaring result:', error);
    }
  };

  const connectAccount = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error('Error connecting account:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Voting Contract App</h1>
        <p>Connected Account: {currentAccount || 'Not Connected'}</p>
        <button onClick={connectAccount}>Connect Account</button>
        {currentAccount && (
          <>
            <button onClick={registerVoter} disabled={votingStarted || votingEnded || registeredAsVoter}>
              Register as Voter
            </button>
            {registeredAsVoter && (
              <>
                <h2>Vote</h2>
                {Object.entries(candidates).map(([post, postCandidates]) => (
                  <div key={post}>
                    <h3>{post}</h3>
                    {postCandidates.map((candidate) => (
                      <p key={candidate.name}>
                        {candidate.name} - Votes: {candidate.voteCount}
                      </p>
                    ))}
                  </div>
                ))}
                {!votingStarted && !votingEnded && (
                  <>
                    <h2>Register as Candidate</h2>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="Enter your name"
                    />
                    <select value={selectedPost} onChange={(e) => setSelectedPost(e.target.value)}>
                      <option value="">Select Post</option>
                      <option value="President">President</option>
                      <option value="GeneralSecretaryGamesSports">General Secretary - Games & Sports</option>
                      <option value="GeneralSecretaryMediaCulture">General Secretary - Media & Culture</option>
                      <option value="GeneralSecretaryScienceTech">General Secretary - Science & Tech</option>
                      <option value="GeneralSecretaryAcademicsCareer">General Secretary - Academics & Career</option>
                    </select>
                    <button onClick={registerCandidate}>Register as Candidate</button>
                  </>
                )}
                {votingStarted && !votingEnded && (
                  <>
                    <h2>Cast Your Vote</h2>
                    {/* Render voting form here */}
                  </>
                )}
                {votingEnded && (
                  <>
                    <h2>Results</h2>
                    {Object.entries(voteResults).map(([post, result]) => (
                      <p key={post}>
                        {post} - Winner: {result.winner}, Votes: {result.votes}
                      </p>
                    ))}
                  </>
                )}
                {!votingStarted && (
                  <button onClick={startVoting} disabled={votingStarted || votingEnded}>
                    Start Voting
                  </button>
                )}
                {votingStarted && (
                  <button onClick={endVoting} disabled={votingEnded}>
                    End Voting
                  </button>
                )}
              </>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default VotingApp;

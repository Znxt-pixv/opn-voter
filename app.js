let connectedWallet = null;
let votes = { A: 0, B: 0, C: 0 };
let hasVoted = false;

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask not found! Please install it first.');
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    connectedWallet = accounts[0];

    const short = connectedWallet.slice(0, 6) + '...' + connectedWallet.slice(-4);
    document.getElementById('walletAddress').textContent = '✅ Connected: ' + short;
    document.getElementById('connectBtn').textContent = 'Connected!';
    document.getElementById('connectBtn').style.background = '#16a34a';

  } catch (err) {
    alert('Failed to connect wallet. Please try again.');
  }
}

function vote(proposal) {
  if (!connectedWallet) {
    alert('Please connect your wallet first!');
    return;
  }

  if (hasVoted) {
    alert('You have already voted!');
    return;
  }

  votes[proposal]++;
  hasVoted = true;

  document.getElementById('votes' + proposal).textContent = 'Votes: ' + votes[proposal];
  alert('✅ Vote for Proposal ' + proposal + ' submitted successfully!');
}
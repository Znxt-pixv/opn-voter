import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBOKOm_luxzue2cSo5IhjpT9q7o6rEcdi4",
  authDomain: "opn-voter.firebaseapp.com",
  projectId: "opn-voter",
  storageBucket: "opn-voter.firebasestorage.app",
  messagingSenderId: "124941919726",
  appId: "1:124941919726:web:6e407dc4f27abf2fde5aff"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let connectedWallet = null;

// Load votes on start
async function loadVotes() {
  const docRef = doc(db, "votes", "proposals");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById('votesA').textContent = 'Votes: ' + (data.A || 0);
    document.getElementById('votesB').textContent = 'Votes: ' + (data.B || 0);
    document.getElementById('votesC').textContent = 'Votes: ' + (data.C || 0);
  }
}

loadVotes();

window.connectWallet = async function() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask not found! Please install it first.');
    return;
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectedWallet = accounts[0];
    const short = connectedWallet.slice(0, 6) + '...' + connectedWallet.slice(-4);
    document.getElementById('walletAddress').textContent = '✅ Connected: ' + short;
    document.getElementById('connectBtn').textContent = 'Connected!';
    document.getElementById('connectBtn').style.background = '#16a34a';
  } catch (err) {
    alert('Failed to connect wallet.');
  }
}

window.vote = async function(proposal) {
  if (!connectedWallet) {
    alert('Please connect your wallet first!');
    return;
  }

  // Check if wallet already voted
  const walletRef = doc(db, "voters", connectedWallet);
  const walletSnap = await getDoc(walletRef);
  if (walletSnap.exists()) {
    alert('You have already voted!');
    return;
  }

  // Save vote
  const votesRef = doc(db, "votes", "proposals");
  const votesSnap = await getDoc(votesRef);

  if (!votesSnap.exists()) {
    await setDoc(votesRef, { A: 0, B: 0, C: 0 });
  }

  await updateDoc(votesRef, { [proposal]: increment(1) });
  await setDoc(walletRef, { voted: true, proposal: proposal });

  alert('✅ Vote for Proposal ' + proposal + ' submitted successfully!');
  loadVotes();
}

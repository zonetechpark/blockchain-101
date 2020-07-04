const Blockchain = require("./blockchain");

// Create a BLK object
const bitcoin = new Blockchain();

// STAGE ONE
// Create new transactions
bitcoin.createNewTransaction(120000, "Dan", "Alex");
bitcoin.createNewTransaction(23000, "Alex", "Bob");
bitcoin.createNewTransaction(87678, "Bob", "Dan");
bitcoin.createNewTransaction(678, "Alex", "Dan");

// createNewBlock, getLastBlock, createNewTransaction, hashBlock, proofOfWork
let lastBlock = bitcoin.getLastBlock();
let previousBlockHash = lastBlock.hash;

// Calculate nonce
let nonce = bitcoin.proofOfWork(previousBlockHash, bitcoin.newTransactions);
console.log(nonce);

// Hash the block
let hash = bitcoin.hashBlock(previousBlockHash, bitcoin.newTransactions, nonce);
console.log(hash);

// Create new block
bitcoin.createNewBlock(nonce, previousBlockHash, hash);

console.log(bitcoin);

// STAGE TWO
// Create new transactions
bitcoin.createNewTransaction(654567, "Alex", "Dan");
bitcoin.createNewTransaction(23000, "Chris", "Bob");
bitcoin.createNewTransaction(87678, "Alice", "Rebecca");

// createNewBlock, getLastBlock, createNewTransaction, hashBlock, proofOfWork
lastBlock = bitcoin.getLastBlock();
previousBlockHash = lastBlock.hash;

// Calculate nonce
nonce = bitcoin.proofOfWork(previousBlockHash, bitcoin.newTransactions);

// Hash the block
hash = bitcoin.hashBlock(previousBlockHash, bitcoin.newTransactions, nonce);

// Create new block
bitcoin.createNewBlock(nonce, previousBlockHash, hash);

console.log(bitcoin);

// bitcoin.createNewBlock(235, "0987UIJBVFTYUIJJU87TGH", "87UJY8I8HBFHJ");
// bitcoin.createNewBlock(235, "0987UIJBVFTYUIOIGHJK87TGH", "87UJY8JHHJHBFHJ");
// bitcoin.createNewBlock(235, "0987UIJBVFTYUIJUKJU87TGH", "87UJY8HHJ8HBFHJ");
// bitcoin.createNewTransaction(23000, "Alex", "Bob");
// bitcoin.createNewTransaction(87678, "Bob", "Dan");
// bitcoin.createNewTransaction(678, "Alex", "Dan");

// const prev = "0987UIJBVFTYUIJJU87TGH";
// const blocData = [
//   {
//     amount: 97878,
//     sender: "Alex",
//     recipient: "Bob",
//   },
//   {
//     amount: 8756,
//     sender: "Alex",
//     recipient: "Dan",
//   },
//   {
//     amount: 34545,
//     sender: "Chris",
//     recipient: "Bob",
//   },
// ];

// console.log(bitcoin.proofOfWork(prev, blocData));

// console.log(bitcoin.hashBlock(prev, blocData, 1234));
// console.log(bitcoin);

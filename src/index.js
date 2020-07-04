const uuid = require('uuid').v1;
const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const bitcoin = new Blockchain();
const nodeAddress = uuid().split('-').join('');

console.log(nodeAddress);

app.get('/blockchain', (req, res) => {
  return res.json({ message: 'Blochchain', coin: bitcoin });
});

app.post('/transaction', (req, res) => {
  const { amount, sender, recipient } = req.body;
  const blockIndex = bitcoin.createNewTransaction(amount, sender, recipient);
  return res.json({
    message: 'Transaction Successful',
    blockIndex: blockIndex,
  });
});

app.get('/mine', (req, res) => {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock.hash;
  // Calculate nonce
  const nonce = bitcoin.proofOfWork(previousBlockHash, bitcoin.newTransactions);

  // Hash the block
  const hash = bitcoin.hashBlock(
    previousBlockHash,
    bitcoin.newTransactions,
    nonce
  );

  bitcoin.createNewBlock(nonce, previousBlockHash, hash);
  return res.json({ message: 'Block mined successfully', coin: bitcoin });
});

app.get('/', (req, res) => {
  return res.json({ message: 'Welcome back' });
});

const PORT = process.argv[2];

app.listen(PORT, () => {
  console.log(`Running on Port: ${PORT}`);
});

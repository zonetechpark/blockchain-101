const uuid = require('uuid').v1;
const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const Blockchain = require('./blockchain');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const currentNodeUrl = process.argv[3];
console.log(currentNodeUrl);

const bitcoin = new Blockchain();
const nodeAddress = uuid().split('-').join('');

console.log(nodeAddress);

app.get('/blockchain', (req, res) => {
  return res.json({ message: 'Blochchain', coin: bitcoin });
});

app.post('/register-and-broadcast-node', (req, res) => {
  const { newNodeUrl } = req.body;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
    bitcoin.networkNodes.push(newNodeUrl);
  }
  const regNodePromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    // register-node
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };
    regNodePromises.push(rp(requestOptions));
  });

  Promise.all(regNodePromises)
    .then((data) => {
      // register-nodes-bulk
      const bulkRequestOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: {
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
        },
        json: true,
      };
      return rp(bulkRequestOptions)
        .then((data) => {
          return res.json({
            message: 'New node registered with network successfully',
          });
        })
        .catch((err) => res.json({ err: err }).status(500));
    })
    .catch((err) => res.json({ err: err }).status(500));
});

app.post('/register-node', (req, res) => {
  const { newNodeUrl } = req.body;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
    bitcoin.networkNodes.push(newNodeUrl);
  }
  return res.json({ message: 'New Node Successfully registered' });
});

app.post('/register-nodes-bulk', (req, res) => {
  return res.json({ message: 'Bulk Nodes Successfully registered' });
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

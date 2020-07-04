const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

const port = process.argv[2];

app.listen(port, () => {
  console.log(`Running on Port: ${port}`);
});

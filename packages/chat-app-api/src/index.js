const express = require('express');
const path = require('path');

const port = process.env.PORT || 8081;
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`Listening on port ${port}`);
  }
});

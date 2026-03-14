const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

app.get('*', (req, res) => {
  res.status(200).json({
    message: "DIAGNOSTIC SERVER WORKING",
    path: req.path,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      ROOT_DIR: __dirname,
      PORT: PORT
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Diagnostic server on port ${PORT}`);
});

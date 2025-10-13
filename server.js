const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/medical-distribution-prototype')));

// Handle Angular routing, return all requests to Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/medical-distribution-prototype/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

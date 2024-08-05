const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Middleware to add CSP headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  next();
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route to list files in the current directory
app.get('/files', (req, res) => {
  fs.readdir(__dirname, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).send('Unable to scan directory: ' + err);
    } 
    res.json(files);
  });
});

// Route to serve a specific file
app.get('/file/:filename', (req, res) => {
  const filePath = path.join(__dirname, req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send('File not found');
    }
    res.sendFile(filePath);
  });
});

// Catch-all route for 404 errors
app.use((req, res) => {
  console.error(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Current directory: ${__dirname}`);
  fs.readdir(__dirname, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
    } else {
      console.log('Files in current directory:', files);
    }
  });
});
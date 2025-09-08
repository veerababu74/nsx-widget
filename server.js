const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the current directory (which will be the dist folder after deployment)
app.use(express.static(__dirname));

// Handle React Router - send all requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Nexus Chatbot Widget Server is running on port ${port}`);
});

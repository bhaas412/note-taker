// Include necessary modules
const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// Create port
const PORT = process.env.PORT || 3001;

// Initialize Express app
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// Start server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
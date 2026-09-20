require('dotenv').config();

const express = require('express');
const app = express();
const ipRoutes = require('./routes/ipRoutes');

app.use(express.json());
app.use('/', ipRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Connection failed:', error.message);
    }
  }
}

startServer();

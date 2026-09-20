const express = require('express');
const router = express.Router();
const apiKey = process.env.IPIFY_API_KEY;

router.get('/', async (req, res) => {
  const ip = req.query.ipAddress;

  console.log('IP received:', ip);
  console.log('API key exists:', !!apiKey);
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${ip}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
    console.log(data);
  } catch (error) {
    console.error('Error in /:', error);
    res.status(500).json('ip location not found');
  }
});

module.exports = router;

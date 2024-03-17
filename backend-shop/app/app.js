const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const port = 3000;

const paymentBackendAddress = 'http://frontend/payment-api';

// PostgreSQL configuration
const pool = new Pool({
  user: 'user',
  host: 'db-shop',
  database: 'database_shop',
  password: 'password',
  port: 5432,
});

// Get the private key and address of the platform account from the environment (platform_private_key and platform_address)
const platformPrivateKey = process.env.PLATFORM_PRIVATE_KEY;
const platformAddress = process.env.PLATFORM_ADDRESS;

console.log('Platform wallet address:', platformAddress);
console.log('Platform wallet private key:', platformPrivateKey.slice(0, 6) + '...'+ platformPrivateKey.slice(-4));

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/item', async (req, res) => {
  const { name, price, photo_url } = req.body;
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secret_key');
    const { username } = decodedToken;
    const { rows } = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const seller_id = rows[0].id;
    await pool.query('INSERT INTO items (name, price, seller_id, photo_url) VALUES ($1, $2, $3, $4)', [name, price, seller_id, photo_url]);
    res.sendStatus(201);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password, id, address } = req.body;
  try {
    await pool.query('INSERT INTO users (username, password, id, address) VALUES ($1, $2, $3, $4)', [username, password, id, address]);
    resp = await axios.post(`${paymentBackendAddress}/transaction`, { 
      to: address,
      privateKey: platformPrivateKey, 
      amount: '1000'
     });
    res.sendStatus(201);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password ]);
      
      if (rows.length >= 1) {
        // User is authenticated
        id = rows[0].id;
        const token = jwt.sign({ username, id }, 'secret_key', { expiresIn: '24h' });
        res.json({ token });
      } else {
        // Authentication failed
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/buy', async (req, res) => {
  // Assuming authentication is already handled and verified
  try {
    // Call external API for transaction
    const transactionResponse = await axios.post(`${paymentBackendAddress}/transaction`, req.body);
    if (transactionResponse === true) {
      // If transaction is successful, delete item from item table
      await pool.query('UPDATE items SET bought = true WHERE id = $1', [req.body.itemId]);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error buying item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

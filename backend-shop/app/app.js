const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const port = 3000;

// PostgreSQL configuration
const pool = new Pool({
  user: 'user',
  host: 'db-shop',
  database: 'database_shop',
  password: 'password',
  port: 5432,
});

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
  const { name, price } = req.body;
  try {
    await pool.query('INSERT INTO items (name, price, seller_id) VALUES ($1, $2, $3)', [name, price, seller_id]);
    res.sendStatus(201);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
    res.sendStatus(201);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
      
      if (rows.length >= 1) {
        // User is authenticated
        const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
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
    const transactionResponse = await callExternalAPIForTransaction(req.body);
    if (transactionResponse === true) {
      // If transaction is successful, delete item from item table
      await pool.query('DELETE FROM items WHERE id = $1', [req.body.itemId]);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error buying item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to simulate calling external API for transaction
async function callExternalAPIForTransaction(data) {
    const response = await axios.post('http://localhost:3001/api/transaction', data);
    return response;
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(100) NOT NULL,
//     password VARCHAR(100) NOT NULL,
//     balance NUMERIC(10, 2) DEFAULT 1000
// );

// CREATE TABLE items (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     price NUMERIC(10, 2) NOT NULL
//     seller_id INT NOT NULL REFERENCES users(id)
// );

const { Pool } = require('pg');
const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;


const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database_name',
    password: 'your_password',
    port: 5432,
});

// Middleware
app.use(bodyParser.json());

async function getUserBalance(userId) {
    try {
        const result = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
        return result.rows[0].balance;
    } catch (error) {
        throw new Error('Error fetching user balance');
    }
}

async function makeTransaction(buyerId, sellerId, price) {
    try {
        const buyerBalance = await getUserBalance(buyerId);
        
        if (buyerBalance < price) {
            throw new Error('Insufficient balance');
        }

        await pool.query('BEGIN');
        await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [price, buyerId]);
        await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [price, sellerId]);
        await pool.query('COMMIT');
        
        return true;
    } catch (error) {
        await pool.query('ROLLBACK');
        throw new Error('Error making transaction');
    }
}

// GET /api/user/balance
app.get('/api/user/:userId/balance', async (req, res) => {
    const userId = req.params.userId;
    try {
        const balance = await getUserBalance(userId);
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/transaction
app.post('/api/transaction', async (req, res) => {
    const { buyerId, sellerId, price } = req.body;

    try {
        const transactionStatus = await transactionController.makeTransaction(buyerId, sellerId, price);
        res.status(200).json({ success: transactionStatus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  
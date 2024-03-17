const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    }
};

async function getUserBalance(address) {
    try {
        // Get the balance of the user from the blockchain RPC server using eth_getBalance
        const response = await axios.post('http://geth:8545', {
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [address, 'latest'],
            id: 1
        }, axiosConfig);
        const weiBalance = parseInt(response.data.result, 16);
        const etherBalance = weiBalance / 10**18;
        return etherBalance;
    } catch (error) {
        // Log details about the error
        console.error('Error getting user balance:', error);
        throw new Error('Error getting user balance', error);
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
app.get('/api/user/:address/balance', async (req, res) => {
    const address = req.params.address;
    try {
        const balance = await getUserBalance(address);
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
  
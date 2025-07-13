import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

let ethPrice = null;

app.get('/eth-price', async (req, res) => {
    try {
        const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price',
            {
                params: {
                    ids: 'ethereum',
                    vs_currencies: 'usd',
                    x_cg_demo_api_key: 'CG-N1kmR6JKEZWcUDuYzJJ5aD1z',
                },
            }
        );
        console.log(response);
        ethPrice = response.data.ethereum.usd;
        res.json({ price: ethPrice });
    } catch (error) {
        console.error('Error fetching price:', error.message);
        res.status(500).json({ error: 'Failed to fetch ETH price' });
    }
});

app.listen(5000, () => {
    console.log(`Server running at http://localhost:${5000}`);
});

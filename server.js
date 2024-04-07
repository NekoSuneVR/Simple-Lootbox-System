const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Dummy database to store user data and loot items
const users = {
    'user1': { 
        tier: 'tier1', 
        lastClaimed: null, 
        remainingLootboxes: 0
    },
};

const lootItems = [
    'car',
    'cookie',
    'girlfriend',
];

// Define tiers and their corresponding daily lootbox counts
const tiers = {
    'tier1': 5,
    'tier2': 10,
    'tier2': 15,
    'tier2': 20
};

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/claim_lootbox', (req, res) => {
    const { user_id } = req.body;
    const user = users[user_id];

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { tier, lastClaimed } = user;
    const currentTime = moment();
    const today = moment().startOf('day');
    
    if (lastClaimed && moment(lastClaimed).isSame(today, 'day')) {
        return res.status(400).json({ error: 'Already claimed lootbox today' });
    }

    const lootboxCount = tiers[tier] || 0;
    users[user_id].lastClaimed = currentTime;
    users[user_id].remainingLootboxes = lootboxCount;
    res.status(200).json({ remainingLootboxes: lootboxCount });
});

app.post('/open_lootbox', (req, res) => {
    const { user_id } = req.body;
    const user = users[user_id];

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { remainingLootboxes } = user;

    if (remainingLootboxes <= 0) {
        return res.status(400).json({ error: 'No remaining lootboxes to open' });
    }

    const lootboxItem = randomItem(lootItems);
    users[user_id].remainingLootboxes -= 1;
    res.status(200).json({ lootboxItem });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
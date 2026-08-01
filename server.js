// Shopping List Backend with CORS Support
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// CORS middleware - allow frontend from localhost:3000
app.use((req, res, next) => {
    const allowedOrigin = 'http://192.168.1.79:3000';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

// Store items in memory for simplicity
let items = [];
let nextId = 1;

// Load initial items from file if it exists
async function loadItems() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'items.json'), 'utf8');
        items = JSON.parse(data);
        nextId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    } catch (error) {
        console.log('No existing items file found, starting with empty list');
        items = [];
        nextId = 1;
    }
}

// Save items to file
async function saveItems() {
    try {
        await fs.writeFile(path.join(__dirname, 'items.json'), JSON.stringify(items, null, 2));
    } catch (error) {
        console.error('Error saving items:', error);
    }
}

// Load items on startup
loadItems();

// Get all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// Add a new item
app.post('/api/items', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Item text is required' });
    }

    const newItem = {
        id: nextId++,
        text: text,
        createdAt: new Date().toISOString()
    };

    items.push(newItem);
    await saveItems();

    res.status(201).json(newItem);
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    const itemId = parseInt(id);

    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }

    items.splice(itemIndex, 1);
    await saveItems();

    res.json({ message: 'Item deleted successfully', id: itemId });
});

// Server status endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shopping List Backend Server running on http://192.168.1.79:${PORT}`);
    console.log(`Health check: http://192.168.1.79:${PORT}/health`);
});

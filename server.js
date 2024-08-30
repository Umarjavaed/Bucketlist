const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const dataFile = path.join(__dirname, 'data.json');

// Helper function to read data from the JSON file
function readData() {
    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, JSON.stringify([]));
    }
    const data = fs.readFileSync(dataFile);
    return JSON.parse(data);
}

// Helper function to write data to the JSON file
function writeData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Serve the list of ideas
app.get('/ideas', (req, res) => {
    res.json(readData());
});

// Add a new idea
app.post('/ideas', (req, res) => {
    const { name, description, revenue, investment } = req.body;
    if (name && description && revenue && investment) {
        const data = readData();
        const newIdea = { id: uuidv4(), name, description, revenue, investment };
        data.push(newIdea);
        writeData(data);
        res.status(201).json(newIdea);
    } else {
        res.status(400).json({ error: 'All fields are required' });
    }
});

// Delete an idea by ID
app.delete('/ideas/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();
    const newData = data.filter(idea => idea.id !== id);

    if (newData.length < data.length) {
        writeData(newData);
        res.status(200).json({ message: 'Idea deleted' });
    } else {
        res.status(404).json({ error: 'Idea not found' });
    }
});

// Simple authentication middleware
const authenticate = (req, res, next) => {
    const { username, password } = req.headers;
    if (username === 'umer' && password === 'Pakistan@123') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Apply authentication middleware to POST and DELETE requests
app.use('/ideas', authenticate);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

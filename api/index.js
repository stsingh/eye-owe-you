const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Record = require('./models/Record.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json('NICE!!!!!!!!!!!!!!!!!!!!!!!!!');
});

app.post('/api/record', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const {name, dir, money} = req.body;
    const record = await Record.create({name, dir, money});
    res.json(record);
});

app.get('/api/records', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const records = await Record.find();
    res.json(records);
});

app.listen(4000);
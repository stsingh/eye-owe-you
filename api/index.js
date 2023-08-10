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

    try {
        // Check if the person exists in the database
        let existingPerson = await Record.findOne({ name });
    
        if (existingPerson) {
          // If person exists, update the money in the person's account
          let mon = money;
          if(dir === "is owed") {
            mon = 0 - mon;
          }
          const thing = await Record.findOneAndUpdate({_id: existingPerson._id}, {$inc: {money: mon}})
          if(money > existingPerson.money) {
            await Record.findOneAndUpdate({_id: existingPerson._id}, {$set: {dir: "is owed"}})
          } else {
            await Record.findOneAndUpdate({_id: existingPerson._id}, {$set: {dir: "owes you"}})
          }
    
          res.status(200).json({ message: thing });
        } else {
          // If person doesn't exist, create a new person with the inputted money
          existingPerson = new Record({ name, dir, money });
          await existingPerson.save();
    
          res.status(201).json({ message: 'New person created with money' });
        }
      } catch (error) {
        console.error('Error updating money:', error);
        res.status(500).json({ message: 'An error occurred while updating the money' });
      }
});

app.get('/api/records', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const records = await Record.find();
    res.json(records);
});

app.post('api/delete', async (req, resp) => {
    await mongoose.connect(process.env.MONGO_URL);
    id = req.body._id;
    await Record.deleteOne({ _id: id });
});

app.listen(4000);
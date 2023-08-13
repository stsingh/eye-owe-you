const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Record = require('./models/Record');
const User = require('./models/User')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const app = express();

app.use(cors({
  credentials:true,
  origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(cookieParser());

//auth functionality
app.get('/', async (req, res) => {
  res.send('ok');
});

app.get('/api/user', async (req, res) => {
  if (!req.cookies.token) {
    return res.json({});
  }
  await mongoose.connect(process.env.MONGO_URL);
  const payload = jwt.verify(req.cookies.token, secret);
  User.findById(payload.id).then(userInfo => {
    res.json({id:userInfo._id, email:userInfo.email});
  });
});

app.post('/api/register', async (req, res) => {
  const {email, password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({email, password:hashedPassword});
  user.save().then(userInfo => {
    jwt.sign({id:userInfo._id,email:userInfo.email}, secret, (err, token) => {
      if(err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.cookie('token', token).json({id:userInfo._id,email:userInfo.email});
      }
    });
  });
});

app.post('/api/login', async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const {email, password} = req.body;
  User.findOne({email}).then(userInfo => {
    if (!userInfo) {
      return res.json({});
    }
    const passOk = bcrypt.compareSync(password, userInfo.password);
    if(passOk) {
      jwt.sign({id:userInfo._id, email:email}, secret, (err, token) => {
        if(err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.cookie('token', token).json({id:userInfo._id,email:userInfo.email});
        }
      });
    } else {
      res.sendStatus(401);
    }
  });
})

app.post('/api/logout', (req, res) => {
  res.cookie('token', '').send();
}) 

//app functionality
app.get('/api/test', (req, res) => {
    res.json('NICE!!!!!!!!!!!!!!!!!!!!!!!!!');
});

app.get('/api/records', async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const payload = jwt.verify(req.cookies.token, secret);
  const ident = new mongoose.Types.ObjectId(payload.id)
  const records = await Record.find({user: ident})
  res.json(records);
});

app.put('/api/records', async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const payload = jwt.verify(req.cookies.token, secret);
  const ident = new mongoose.Types.ObjectId(payload.id);
  let {name, dir, money} = req.body;
  try {
    // Check if the person exists in the database
    let existingPerson = await Record.findOne({ name, user:ident });
    let mon = money;
    if (existingPerson) {
      // If person exists, update the money in the person's account
      if(dir === "is owed") {
        mon = 0 - mon;
      }
      await Record.findOneAndUpdate({name: existingPerson.name, user:existingPerson.user}, {$inc: {money: mon}})
      const thing = await Record.findOne({name: existingPerson.name, user:existingPerson.user})
      if(thing.money == 0) {
        await Record.findOneAndDelete({name: existingPerson.name, user:existingPerson.user})
      } else {
        if(0-mon > existingPerson.money) {
          await Record.findOneAndUpdate({name: existingPerson.name, user:existingPerson.user}, {$set: {dir: "is owed"}})
        } else {
          await Record.findOneAndUpdate({name: existingPerson.name, user:existingPerson.user}, {$set: {dir: "owes you"}})
        }
        res.status(200).json({ message: thing });
      }
      
    } else {
      // If person doesn't exist, create a new person with the inputted money
      if(dir === "is owed") {
        money = 0- money;
      }
      existingPerson = new Record({
        name:name, 
        dir:dir, 
        money:money, 
        user:new mongoose.Types.ObjectId(payload.id)
      })
      await existingPerson.save();

      res.status(201).json({ message: 'New person created with money' });
    }
  } catch (error) {
    console.error('Error updating money:', error);
    res.status(500).json({ message: 'An error occurred while updating the money' });
  }
})

app.listen(4000);
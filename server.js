const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Vocab = require('./models/Vocab');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, name });
  res.json({ id: user._id, email, name });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) 
    return res.status(400).json({ msg: 'Invalid credentials' });
  res.json({ id: user._id, email: user.email, name: user.name });
});

app.put('/api/vocabs/:id', async (req, res) => {
  try {
    const updated = await Vocab.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Get all vocabs (no auth)
app.get('/api/vocabs', async (req, res) => {
  const vocabs = await Vocab.find();
  res.json(vocabs);
});

// Add vocab
app.post('/api/vocabs', async (req, res) => {
  try {
    const vocab = await Vocab.create(req.body);
    res.json(vocab);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ msg: 'Word already exists' });
    }
    res.status(500).json({ msg: error.message });
  }
});

// Delete vocab
app.delete('/api/vocabs/:id', async (req, res) => {
  await Vocab.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
});

mongoose.connect(process.env.MONGO_URI).then(() => 
  app.listen(5000, () => console.log('vocab Server on 5000'))
);
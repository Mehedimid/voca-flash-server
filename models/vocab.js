const mongoose = require('mongoose');

// 1. Define the schema in a variable FIRST
const vocabSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  word: { type: String, required: true },
  bengaliMeaning: { type: String, required: true },
  synonyms: [String],
  antonyms: [String]
});

// 2. Add the unique rule
vocabSchema.index({ userId: 1, word: 1 }, { unique: true });

// 3. Export it
module.exports = mongoose.model('Vocab', vocabSchema);
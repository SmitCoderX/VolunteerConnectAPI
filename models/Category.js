const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please Add a Category'],
    unique: true,
    trim: true,
  },
  color: {
    type: String,
    required: [true, 'Please Add Color'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Event Slug from the name
CategorySchema.pre('save', function (next) {
  this.category = `Find By \n${this.category}`;
  next();
});

module.exports = mongoose.model('Category', CategorySchema);

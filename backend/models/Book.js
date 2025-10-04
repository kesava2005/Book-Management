const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  genre: {
    type: String,
    required: [true, 'Please add a genre']
  },
  year: {
    type: Number,
    required: [true, 'Please add a published year']
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


BookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bookId',
  justOne: false
});

module.exports = mongoose.model('Book', BookSchema);
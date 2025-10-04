const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: [true, 'Please add a review text'],
    trim: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


ReviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });


ReviewSchema.statics.getAverageRating = async function(bookId) {
  const obj = await this.aggregate([
    {
      $match: { bookId: bookId }
    },
    {
      $group: {
        _id: '$bookId',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Book').findByIdAndUpdate(bookId, {
      averageRating: obj[0] ? obj[0].averageRating : 0
    });
  } catch (err) {
    console.error(err);
  }
};


ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.bookId);
});


ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.bookId);
});

module.exports = mongoose.model('Review', ReviewSchema);
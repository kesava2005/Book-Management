const express = require('express');
const { 
  getReviews, 
  addReview, 
  updateReview, 
  deleteReview,
  getReviewsByUser
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });
router.route('/user/:userId').get(protect, getReviewsByUser);
router.route('/')
  .get(getReviews)
  .post(protect, addReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
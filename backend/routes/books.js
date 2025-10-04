const express = require('express');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getBooksByUser
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

const router = express.Router();



router.route('/')
  .get(getBooks)
  .post(protect, createBook);



router.route('/:id')
  .get(getBook)
  .put(protect, updateBook)
  .delete(protect, deleteBook);



router.route('/user/:userId')
  .get(protect, getBooksByUser);

module.exports = router;
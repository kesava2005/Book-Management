const Book = require('../models/Book');



exports.getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Book.countDocuments();

    const query = Book.find().populate('addedBy', 'name');

    if (req.query.search) {
      query.or([
        { title: { $regex: req.query.search, $options: 'i' } },
        { author: { $regex: req.query.search, $options: 'i' } }
      ]);
    }

    if (req.query.genre) {
      query.where('genre').equals(req.query.genre);
    }

    if (req.query.sort) {
      if (req.query.sort === 'year') query.sort('year');
      else if (req.query.sort === 'year_desc') query.sort('-year');
      else if (req.query.sort === 'rating') query.sort('averageRating');
      else if (req.query.sort === 'rating_desc') query.sort('-averageRating');
    } else {
      query.sort('-createdAt');
    }

    query.skip(startIndex).limit(limit);
    const books = await query;

    const pagination = {};
    if (endIndex < total) pagination.next = { page: page + 1, limit };
    if (startIndex > 0) pagination.prev = { page: page - 1, limit };

    res.status(200).json({
      success: true,
      count: books.length,
      pagination,
      totalPages: Math.ceil(total / limit),
      data: books
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'name')
      .populate({
        path: 'reviews',
        populate: { path: 'userId', select: 'name' }
      });

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



exports.createBook = async (req, res) => {
  try {
    req.body.addedBy = req.user.id;
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await book.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



exports.getBooksByUser = async (req, res) => {
  try {
    const books = await Book.find({ addedBy: req.params.userId })
      .populate('addedBy', 'name');
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
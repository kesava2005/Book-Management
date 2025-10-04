const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const auth = require('./routes/auth');
const books = require('./routes/books');
const reviews = require('./routes/reviews');

const app = express();


app.use(express.json());


app.use(cors());


app.use('/api/auth', auth);
app.use('/api/books', books);              
app.use('/api/books/:bookId/reviews', reviews); 
app.use('/api/reviews', reviews);


app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);


process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

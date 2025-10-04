import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBook, getBookReviews, deleteBook, addReview, deleteReview } from '../utils/api';
import AuthContext from '../context/AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, reviewText: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    fetchBookAndReviews();
  }, [id]);

  const fetchBookAndReviews = async () => {
  setLoading(true);
  setError('');
  try {
    const [bookRes, reviewsRes] = await Promise.all([
      getBook(id),
      getBookReviews(id)
    ]);

    setBook(bookRes.data.data); 
    setReviews(reviewsRes.data.data); 

    
    if (user) {
      const userReview = reviewsRes.data.data.find(
        (review) => review.userId?._id === user.data._id
      );
      setUserHasReviewed(!!userReview);
    }
  } catch (err) {
    setError('Failed to fetch book details');
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const handleDeleteBook = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete book');
        console.error(err);
      }
    }
  };

  const handleReviewChange = (e) => {
    setReviewForm({
      ...reviewForm,
      [e.target.name]: e.target.name === 'rating' ? parseInt(e.target.value) : e.target.value
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    
    if (!reviewForm.reviewText.trim()) {
      setReviewError('Review text is required');
      return;
    }
    
    try {
      console.log(id,reviewForm);
      await addReview(id,{
        rating: reviewForm.rating,
        reviewText: reviewForm.reviewText
      });
      
      setReviewSuccess('Review added successfully!');
      setReviewForm({ rating: 5, reviewText: '' });
      fetchBookAndReviews(); 
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to add review');
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        fetchBookAndReviews(); 
      } catch (err) {
        setError('Failed to delete review');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          Book not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          &larr; Back to Books
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">By {book.author}</p>
          </div>
          
          {isAuthenticated && user && book.addedBy === user.data._id && (
            <div className="flex space-x-2">
              <Link 
                to={`/edit-book/${book._id}`}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </Link>
              <button
                onClick={handleDeleteBook}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-5 h-5 ${i < Math.round(book.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-gray-600">
            {book.averageRating ? `${book.averageRating.toFixed(1)} (${reviews.length} reviews)` : 'No ratings yet'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-gray-700">
            <span className="font-semibold">Genre:</span> {book.genre}
          </div>
          <div className="text-gray-700">
            <span className="font-semibold">Published:</span> {book.year}
          </div>
          <div className="text-gray-700">
            <span className="font-semibold">Added:</span> {new Date(book.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
        </div>
      </div>
      
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        
        
        {isAuthenticated ? (
          !userHasReviewed ? (
            <div className="mb-8 bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>
              
              {reviewError && (
                <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
                  {reviewError}
                </div>
              )}
              
              {reviewSuccess && (
                <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
                  {reviewSuccess}
                </div>
              )}
              
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="rating">
                    Rating
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    value={reviewForm.rating}
                    onChange={handleReviewChange}
                    className="w-full md:w-1/4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="reviewText">
                    Your Review
                  </label>
                  <textarea
                    id="reviewText"
                    name="reviewText"
                    value={reviewForm.reviewText}
                    onChange={handleReviewChange}
                    rows="4"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Share your thoughts about this book..."
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Submit Review
                </button>
              </form>
            </div>
          ) : (
            <div className="mb-8 bg-blue-50 p-4 rounded-md">
              <p className="text-blue-700">You have already reviewed this book.</p>
            </div>
          )
        ) : (
          <div className="mb-8 bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700">
              <Link to="/login" className="text-blue-500 hover:text-blue-700">Log in</Link> or{' '}
              <Link to="/register" className="text-blue-500 hover:text-blue-700">register</Link> to leave a review.
            </p>
          </div>
        )}
        
        
        {reviews.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this book!
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-semibold">{review.rating}/5</span>
                  </div>
                  
                  {isAuthenticated && user && review.userId === user.data._id && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
                
                <p className="text-gray-500 text-sm mb-2">
                  By {review.userName} on {new Date(review.createdAt).toLocaleDateString()}
                </p>
                
                <p className="text-gray-700 whitespace-pre-line">{review.reviewText}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
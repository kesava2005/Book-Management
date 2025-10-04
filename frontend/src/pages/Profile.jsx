import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserBooks, getUserReviews } from '../utils/api';
import BookCard from '../components/BookCard';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.data || !user.data._id) return;

      const userId = user.data._id;

      setLoading(true);
      setError('');

      try {
        if (activeTab === 'books') {
          const res = await getUserBooks(userId);
          setBooks(res.data.data || []);
        } else {
          const res = await getUserReviews(userId);
          setReviews(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [activeTab, user]);

  if (!user || !user.data) {
    return (
      <div className="text-center py-10">
        <p className="text-xl">Please log in to view your profile</p>
        <Link to="/login" className="text-blue-500 hover:underline mt-4 inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
        <div className="flex items-center mb-6">
          <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
            {user.data.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{user.data.name}</h2>
            <p className="text-gray-600">{user.data.email}</p>
          </div>
        </div>
      </div>

      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'books'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('books')}
          >
            My Books
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'reviews'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('reviews')}
          >
            My Reviews
          </button>
        </div>
      </div>

      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : activeTab === 'books' ? (
        <div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Books Added by Me</h2>
            <Link
              to="/books/add"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add New Book
            </Link>
          </div>

          
          {books.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-xl text-gray-600">You haven't added any books yet</p>
              <Link
                to="/books/add"
                className="text-blue-500 hover:underline mt-4 inline-block"
              >
                Add your first book
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          
          <h2 className="text-2xl font-bold mb-6">My Reviews</h2>
          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-xl text-gray-600">You haven't written any reviews yet</p>
              <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
                Browse books to review
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/books/${review.bookId?._id}`}
                        className="text-xl font-bold text-blue-600 hover:underline"
                      >
                        {review.bookId?.title}
                      </Link>
                      <p className="text-gray-600">by {review.bookId?.author}</p>
                    </div>
                    <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">{review.rating}</span>
                      <span className="text-gray-500">/5</span>
                    </div>
                  </div>
                  <p className="mt-4">{review.reviewText}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Posted on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
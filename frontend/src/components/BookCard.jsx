import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <h2 className="text-xl font-bold mb-2 text-gray-800">{book.title}</h2>
        <p className="text-gray-600 mb-2">By {book.author}</p>
        <p className="text-gray-500 mb-2">Genre: {book.genre}</p>
        <p className="text-gray-500 mb-4">Published: {book.year}</p>
        
        <div className="flex items-center mb-3">
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
            {book.averageRating ? `${book.averageRating.toFixed(1)} (${book.reviewCount || 0} reviews)` : 'No ratings yet'}
          </span>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-3">{book.description}</p>
        
        <Link 
          to={`/books/${book._id}`}
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
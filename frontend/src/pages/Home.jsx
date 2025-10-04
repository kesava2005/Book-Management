import { useState, useEffect } from 'react';
import { getBooks } from '../utils/api';
import BookCard from '../components/BookCard';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [currentPage, search, genre, sort]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await getBooks(currentPage, search, genre, sort);
      setBooks(res.data.data);
      setTotalPages(Math.ceil(res.data.total / 5));
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book Collection</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-[10px]">
              Search Books
            </label>
            <div className="flex">
              <input
                type="text"
                id="search"
                placeholder="Search by title or author"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 p-[10px] rounded-l-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </form>
          
          <div className="w-full md:w-48">
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-[10px]">
              Filter by Genre
            </label>
            <select
              id="genre"
              value={genre}
              onChange={handleGenreChange}
              className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-[5px]"
            >
              <option value="">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
              <option value="Biography">Biography</option>
            </select>
          </div>
          
          <div className="w-full md:w-48">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-[10px]">
              Sort By
            </label>
            <select
              id="sort"
              value={sort}
              onChange={handleSortChange}
              className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-[5px]"
            >
              <option value="">Latest Added</option>
              <option value="year">Publication Year</option>
              <option value="rating">Average Rating</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>
      
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-md text-center">
          <p className="text-gray-600">No books found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
          
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-l-md ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-r-md ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
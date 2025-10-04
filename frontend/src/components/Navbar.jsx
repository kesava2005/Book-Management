import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">Book Review Platform</Link>
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/books/add" className="text-gray-300 hover:text-white">Add Book</Link>
              <Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link>
              <button 
                onClick={logout} 
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
              <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext.jsx';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-fatal-dark border-b-2 border-fatal-red z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo és brand */}
          <Link 
            to="/profile" 
            className="flex items-center gap-2 text-fatal-light hover:text-fatal-red transition-colors"
          >
            <span className="material-icons text-fatal-red">favorite</span>
            <span className="font-bold text-xl">Fatal Love</span>
          </Link>

          {/* Navigációs linkek */}
          <div className="flex items-center gap-1">
            <Link
              to="/profile"
              className={`px-4 py-2 rounded-fatal text-sm font-medium transition-colors
                ${isActive('/profile') 
                  ? 'bg-fatal-red text-fatal-light' 
                  : 'text-fatal-light hover:bg-fatal-red/10'}`}
            >
              <span className="material-icons text-xl">person</span>
              <span className="sr-only">Profil</span>
            </Link>

            <Link
              to="/swipe"
              className={`px-4 py-2 rounded-fatal text-sm font-medium transition-colors
                ${isActive('/swipe') 
                  ? 'bg-fatal-red text-fatal-light' 
                  : 'text-fatal-light hover:bg-fatal-red/10'}`}
            >
              <span className="material-icons text-xl">favorite</span>
              <span className="sr-only">Swipe</span>
            </Link>

            <Link
              to="/messages"
              className={`px-4 py-2 rounded-fatal text-sm font-medium transition-colors
                ${isActive('/messages') 
                  ? 'bg-fatal-red text-fatal-light' 
                  : 'text-fatal-light hover:bg-fatal-red/10'}`}
            >
              <span className="material-icons text-xl">chat</span>
              <span className="sr-only">Üzenetek</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-fatal text-sm font-medium text-fatal-light 
                       hover:bg-fatal-red/10 transition-colors ml-2"
            >
              <span className="material-icons text-xl">logout</span>
              <span className="sr-only">Kijelentkezés</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

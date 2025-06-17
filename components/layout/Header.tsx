
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import useUIStore from '../../store/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { SunIcon, MoonIcon, Bars3Icon, UserCircleIcon, CogIcon, ArrowUpIcon, BellAlertIcon } from '../icons/Icons'; // Assuming ArrowUpIcon for logout
import Button from '../ui/Button';
import { APP_NAME } from '../../constants';


const Header: React.FC = () => {
  const { darkMode, toggleDarkMode, toggleSidebar } = useUIStore();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-pns-nav-bg-light dark:bg-pns-nav-bg-dark border-b border-pns-border-light dark:border-pns-border-dark shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2 text-pns-text-dark dark:text-pns-text-light" onClick={toggleSidebar}>
              <Bars3Icon className="h-6 w-6" />
            </Button>
            <Logo />
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode" className="text-pns-text-dark dark:text-pns-text-light">
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>

            {isAuthenticated && user && (
              <>
                <Button variant="ghost" size="icon" className="relative text-pns-text-dark dark:text-pns-text-light" aria-label="Notifications">
                   <BellAlertIcon className="h-5 w-5" />
                   <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-pns-nav-bg-light dark:ring-pns-nav-bg-dark bg-red-500" />
                </Button>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pns-blue dark:focus:ring-pns-orange"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.avatarUrl ? (
                      <img className="h-8 w-8 rounded-full" src={user.avatarUrl} alt={user.name} />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-pns-gray-400 dark:text-pns-gray-500" />
                    )}
                  </button>
                  {dropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-pns-card-bg-light dark:bg-pns-card-bg-dark ring-1 ring-pns-border-light dark:ring-pns-border-dark focus:outline-none">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                        <div className="px-4 py-3 border-b border-pns-border-light dark:border-pns-border-dark">
                          <p className="text-sm font-medium text-pns-text-dark dark:text-pns-text-light truncate">{user.name}</p>
                          <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400 truncate">{user.email}</p>
                          <p className="text-xs mt-1 px-2 py-0.5 inline-block bg-pns-blue-light dark:bg-pns-blue-dark text-pns-blue-dark dark:text-pns-blue-light rounded-full">{user.role}</p>
                        </div>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-pns-text-dark dark:text-pns-text-light hover:bg-pns-gray-100 dark:hover:bg-pns-gray-800 w-full text-left"
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <CogIcon className="mr-3 h-5 w-5 text-pns-gray-400 dark:text-pns-gray-500" />
                          Configuración
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-pns-gray-100 dark:hover:bg-pns-gray-800"
                          role="menuitem"
                        >
                          <ArrowUpIcon className="mr-3 h-5 w-5 transform rotate-90" /> {/* Using ArrowUp as a placeholder for LogoutIcon */}
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

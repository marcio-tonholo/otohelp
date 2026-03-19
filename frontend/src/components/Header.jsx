import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import NotificationBell from './NotificationBell';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-text">OtoHelp</span>
            <span className="logo-subtext">Academy</span>
          </Link>

          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/experiences">Experiências</Link>
            <Link to="/mentors">Mentores</Link>

            {isAuthenticated ? (
              <div className="user-menu">
                <NotificationBell />
                <span className="user-name">
                  Olá, {user?.name?.split(' ')[0]}!
                </span>
                <Link to="/dashboard">Dashboard</Link>
                {/* Menus de mentor removidos; tudo é feito via Dashboard */}
                <button onClick={logout} className="btn-logout">
                  Sair
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-link">
                  Login
                </Link>
                <Link to="/register" className="btn-link btn-primary">
                  Registrar
                </Link>
              </div>
            )}
          </nav>

          {/* Hamburger Menu Button */}
          <button className="hamburger" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="mobile-menu">
              <Link to="/" onClick={closeMenu}>Home</Link>
              <Link to="/experiences" onClick={closeMenu}>Experiências</Link>
              <Link to="/mentors" onClick={closeMenu}>Mentores</Link>

              {isAuthenticated ? (
                <>
                  <div className="mobile-user-info">
                    <NotificationBell />
                    <span>Olá, {user?.name?.split(' ')[0]}!</span>
                  </div>
                  <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                  <button onClick={() => { logout(); closeMenu(); }} className="btn-logout">
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu} className="btn-link">
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="btn-link btn-primary">
                    Registrar
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import NotificationBell from './NotificationBell';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

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
        </div>
      </div>
    </header>
  );
};

export default Header;

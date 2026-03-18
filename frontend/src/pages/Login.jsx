import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      // Erro é capturado e exibido pelo store
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-link">
          Não tem conta? <a href="/register">Registre-se aqui</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

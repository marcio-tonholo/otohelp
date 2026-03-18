import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    crm: '',
    crmState: 'SP',
    userType: 'student',
    // Campos para Student
    specialization: '',
    yearOfGraduation: new Date().getFullYear() - 5,
    currentLevel: 'intermediario',
    // Campos para Mentor
    yearsOfExperience: 5,
  });

  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'confirmPassword' || name === 'password') {
      if (value && formData.password !== value) {
        setPasswordError('As senhas não coincidem');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        crm: formData.crm,
        crmState: formData.crmState,
        userType: formData.userType,
      };

      // Adicionar campos específicos por tipo de usuário
      if (formData.userType === 'student') {
        registrationData.specialization = formData.specialization;
        registrationData.yearOfGraduation = parseInt(formData.yearOfGraduation);
        registrationData.currentLevel = formData.currentLevel;
      } else if (formData.userType === 'mentor') {
        registrationData.specialization = formData.specialization;
        registrationData.yearsOfExperience = parseInt(formData.yearsOfExperience);
      }

      await register(registrationData);
      navigate('/dashboard');
    } catch (err) {
      // Erro é capturado e exibido pelo store
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Registrar-se</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="crm">CRM</label>
              <input
                type="text"
                id="crm"
                name="crm"
                value={formData.crm}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="crmState">Estado</label>
              <select
                id="crmState"
                name="crmState"
                value={formData.crmState}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="BA">Bahia</option>
                <option value="RS">Rio Grande do Sul</option>
                {/* Adicionar mais estados conforme necessário */}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="userType">Tipo de Usuário</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="student">Aluno (buscando aprender)</option>
              <option value="mentor">Mentor (ensinando)</option>
            </select>
          </div>

          {/* Campos comuns */}
          <div className="form-group">
            <label htmlFor="specialization">Especialidade</label>
            <select
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="">Selecione uma especialidade</option>
              <option value="Otologia">Otologia</option>
              <option value="Rinologia">Rinologia</option>
              <option value="Laringologia">Laringologia</option>
              <option value="Cirurgia estética facial">Cirurgia estética facial</option>
              <option value="Neurotologia">Neurotologia</option>
              <option value="Pediatria">Pediatria ORL</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          {/* Campos para Aluno */}
          {formData.userType === 'student' && (
            <>
              <div className="form-group">
                <label htmlFor="yearOfGraduation">Ano de Formação</label>
                <input
                  type="number"
                  id="yearOfGraduation"
                  name="yearOfGraduation"
                  value={formData.yearOfGraduation}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  min="1980"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentLevel">Nível Atual</label>
                <select
                  id="currentLevel"
                  name="currentLevel"
                  value={formData.currentLevel}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>
            </>
          )}

          {/* Campos para Mentor */}
          {formData.userType === 'mentor' && (
            <div className="form-group">
              <label htmlFor="yearsOfExperience">Anos de Experiência</label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                required
                disabled={isLoading}
                min="0"
                max="70"
              />
            </div>
          )}

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            {passwordError && (
              <div className="error-message mt-2">{passwordError}</div>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <p className="auth-link">
          Já tem conta? <a href="/login">Faça login aqui</a>
        </p>
      </div>
    </div>
  );
};

export default Register;

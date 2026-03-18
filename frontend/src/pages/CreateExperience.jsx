import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useExperienceStore } from '../store/useExperienceStore';
import './CreateExperience.css';

const CreateExperience = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { createExperience, isLoading, error } = useExperienceStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'cirurgia',
    procedure: '',
    complexity: 'intermediario',
    scheduledDate: '',
    scheduledTime: '',
    duration: 4,
    maxStudents: 5,
    price: 2000,
    location: {
      hospital: '',
      city: '',
      address: '',
    },
    environment: 'centro_cirurgico',
    prerequisites: '',
    learningOutcomes: '',
    image: '',
  });

  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Verificar autenticação
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (user && user.userType !== 'mentor') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    // Validações
    if (!formData.title || !formData.procedure || !formData.location.hospital) {
      setSubmitError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!formData.scheduledDate || !formData.scheduledTime) {
      setSubmitError('Por favor, selecione data e hora');
      return;
    }

    try {
      // Combinar data e hora
      const [year, month, day] = formData.scheduledDate.split('-');
      const scheduledDateTime = new Date(
        `${year}-${month}-${day}T${formData.scheduledTime}:00`
      );

      const experienceData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        procedure: formData.procedure,
        complexity: formData.complexity,
        scheduledDate: scheduledDateTime,
        duration: parseInt(formData.duration),
        maxStudents: parseInt(formData.maxStudents),
        price: parseFloat(formData.price),
        location: formData.location,
        environment: formData.environment,
        prerequisites: formData.prerequisites
          .split('\n')
          .filter((item) => item.trim()),
        learningOutcomes: formData.learningOutcomes
          .split('\n')
          .filter((item) => item.trim()),
        image: formData.image || null,
      };

      await createExperience(experienceData);
      setSubmitSuccess('Experiência criada com sucesso!');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Erro ao criar experiência');
    }
  };

  if (!user || user.userType !== 'mentor') {
    return null;
  }

  return (
    <div className="create-experience-page">
      <div className="container">
        <h1>Criar Nova Experiência</h1>

        {submitError && <div className="error-message">{submitError}</div>}
        {submitSuccess && (
          <div className="success-message">
            {submitSuccess} Redirecionando...
          </div>
        )}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="experience-form">
          {/* Seção: Informações Básicas */}
          <section className="form-section">
            <h2>Informações Básicas</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Título da Experiência *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Cirurgia de Mastoidectomia com Dr. João"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="procedure">Procedimento *</label>
                <input
                  type="text"
                  id="procedure"
                  name="procedure"
                  value={formData.procedure}
                  onChange={handleChange}
                  placeholder="Ex: Mastoidectomia"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição da Experiência</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva em detalhes o que o aluno aprenderá nesta experiência..."
                rows="4"
                disabled={isLoading}
              />
            </div>
          </section>

          {/* Seção: Tipo e Complexidade */}
          <section className="form-section">
            <h2>Características</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Tipo de Experiência *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="cirurgia">Cirurgia</option>
                  <option value="ambulatorio">Ambulatório</option>
                  <option value="observership">Observership</option>
                  <option value="mentoria_online">Mentoria Online</option>
                  <option value="discussao_casos">Discussão de Casos</option>
                  <option value="treinamento_especifico">Treinamento Específico</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="complexity">Complexidade *</label>
                <select
                  id="complexity"
                  name="complexity"
                  value={formData.complexity}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="basico">Básico</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="environment">Ambiente *</label>
                <select
                  id="environment"
                  name="environment"
                  value={formData.environment}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="centro_cirurgico">Centro Cirúrgico</option>
                  <option value="ambulatorio">Ambulatório</option>
                  <option value="consultorio">Consultório</option>
                  <option value="laboratorio">Laboratório</option>
                </select>
              </div>
            </div>
          </section>

          {/* Seção: Data, Hora e Local */}
          <section className="form-section">
            <h2>Data, Hora e Local</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="scheduledDate">Data da Experiência *</label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="scheduledTime">Hora de Início *</label>
                <input
                  type="time"
                  id="scheduledTime"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duração (horas) *</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hospital">Hospital/Clínica *</label>
                <input
                  type="text"
                  id="hospital"
                  name="location.hospital"
                  value={formData.location.hospital}
                  onChange={handleChange}
                  placeholder="Ex: Hospital das Clínicas"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">Cidade *</label>
                <input
                  type="text"
                  id="city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  placeholder="Ex: São Paulo"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Endereço</label>
              <input
                type="text"
                id="address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="Rua, número, bairro..."
                disabled={isLoading}
              />
            </div>
          </section>

          {/* Seção: Vagas e Preço */}
          <section className="form-section">
            <h2>Vagas e Preço</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="maxStudents">Quantidade de Vagas *</label>
                <input
                  type="number"
                  id="maxStudents"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  required
                  disabled={isLoading}
                  placeholder="5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Preço (R$) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="100"
                  step="100"
                  required
                  disabled={isLoading}
                  placeholder="2000"
                />
                <small className="help-text">
                  Você receberá 80% deste valor (comissão de 20%)
                </small>
              </div>
            </div>
          </section>

          {/* Seção: Pré-requisitos e Objetivos */}
          <section className="form-section">
            <h2>Pré-requisitos e Objetivos de Aprendizado</h2>

            <div className="form-group">
              <label htmlFor="prerequisites">Pré-requisitos</label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                placeholder="Digite um pré-requisito por linha&#10;Ex:&#10;Conhecimento básico de anatomia&#10;Experiência em cirurgias de ORL&#10;Certificado de cirurgia geral"
                rows="3"
                disabled={isLoading}
              />
              <small className="help-text">Um item por linha</small>
            </div>

            <div className="form-group">
              <label htmlFor="learningOutcomes">Objetivos de Aprendizado</label>
              <textarea
                id="learningOutcomes"
                name="learningOutcomes"
                onChange={handleChange}
                value={formData.learningOutcomes}
                placeholder="Digite um objetivo por linha&#10;Ex:&#10;Dominar a técnica cirúrgica&#10;Entender as complicações possíveis&#10;Praticar sob supervisão"
                rows="3"
                disabled={isLoading}
              />
              <small className="help-text">Um item por linha</small>
            </div>
          </section>

          {/* Botões de Ação */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Criando...' : 'Criar Experiência'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExperience;

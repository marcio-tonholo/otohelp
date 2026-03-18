import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mentorAPI } from '../api/client';
import MentorCard from '../components/MentorCard';
import './Mentors.css';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    minExperience: '',
  });

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async (params = {}) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await mentorAPI.getAllMentors(params);
      setMentors(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar mentores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Remover filtros vazios
    const params = Object.fromEntries(
      Object.entries(newFilters).filter(([, v]) => v !== '')
    );
    fetchMentors(params);
  };

  const handleResetFilters = () => {
    setFilters({
      specialization: '',
      minExperience: '',
    });
    fetchMentors();
  };

  return (
    <div className="mentors-page">
      <div className="container">
        <div className="page-header">
          <h1>Mentores de ORL</h1>
          <p>Encontre os melhores mentores para sua formação profissional</p>
        </div>

        {/* Filtros */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label htmlFor="specialization">Especialidade</label>
              <select
                id="specialization"
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
              >
                <option value="">Todas as especialidades</option>
                <option value="rinologia">Rinologia</option>
                <option value="otologia">Otologia</option>
                <option value="laringologia">Laringologia</option>
                <option value="cirurgia_cabeça_pescoço">Cirurgia Cabeça e Pescoço</option>
                <option value="otoneuro">Otoneuro</option>
                <option value="audiologia">Audiologia</option>
                <option value="voz_deglutição">Voz e Deglutição</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="minExperience">Anos de Experiência (mínimo)</label>
              <select
                id="minExperience"
                name="minExperience"
                value={filters.minExperience}
                onChange={handleFilterChange}
              >
                <option value="">Qualquer experiência</option>
                <option value="5">Mínimo 5 anos</option>
                <option value="10">Mínimo 10 anos</option>
                <option value="15">Mínimo 15 anos</option>
                <option value="20">Mínimo 20 anos</option>
              </select>
            </div>

            <button className="btn-reset" onClick={handleResetFilters}>
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading">Carregando mentores...</div>
        ) : mentors.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum mentor encontrado com esses filtros.</p>
            <button className="btn-primary" onClick={handleResetFilters}>
              Ver todos os mentores
            </button>
          </div>
        ) : (
          <div className="mentors-grid">
            {mentors.map((mentor) => (
              <Link
                key={mentor._id}
                to={`/mentor/${mentor._id}`}
                className="mentor-card-wrapper"
              >
                <MentorCard mentor={mentor} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentors;

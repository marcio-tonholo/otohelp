import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperienceStore } from '../store/useExperienceStore';
import { useAuthStore } from '../store/useAuthStore';
import ExperienceCard from '../components/ExperienceCard';
import './Experiences.css';

const Experiences = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const {
    experiences,
    filters,
    setFilters,
    fetchExperiences,
    isLoading,
    pagination,
  } = useExperienceStore();

  const [page, setPage] = useState(1);
  const totalPages = pagination?.pages || 1;

  useEffect(() => {
    fetchExperiences({ ...filters, page, limit: 12 });
  }, [filters, page, fetchExperiences]);

  const handleFilterChange = (name, value) => {
    setFilters({ [name]: value });
    setPage(1);
  };

  const handleCardClick = (experienceId) => {
    navigate(`/experience/${experienceId}`);
  };

  return (
    <div className="experiences-page">
      <div className="container">
        <h1>Experiências Disponíveis</h1>

        <div className="filters-section">
          <h3>Filtrar</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="procedure">Procedimento</label>
              <input
                type="text"
                id="procedure"
                placeholder="Ex: Mastoidectomia"
                value={filters.procedure}
                onChange={(e) =>
                  handleFilterChange('procedure', e.target.value)
                }
              />
            </div>

            <div className="filter-group">
              <label htmlFor="type">Tipo de Experiência</label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="cirurgia">Cirurgia</option>
                <option value="ambulatorio">Ambulatório</option>
                <option value="observership">Observership</option>
                <option value="mentoria_online">Mentoria Online</option>
                <option value="discussao_casos">Discussão de Casos</option>
                <option value="treinamento_especifico">
                  Treinamento Específico
                </option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="complexity">Complexidade Mínima</label>
              <select
                id="complexity"
                value={filters.minComplexity}
                onChange={(e) =>
                  handleFilterChange('minComplexity', e.target.value)
                }
              >
                <option value="">Todas</option>
                <option value="basico">Básico</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="maxPrice">Preço Máximo</label>
              <input
                type="number"
                id="maxPrice"
                placeholder="R$ 0"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="city">Cidade</label>
              <input
                type="text"
                id="city"
                placeholder="Ex: São Paulo"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </div>

            <button
              className="btn-filter-reset"
              onClick={() =>
                setFilters({
                  procedure: '',
                  type: '',
                  minComplexity: '',
                  maxPrice: '',
                  city: '',
                })
              }
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Carregando experiências...</div>
        ) : experiences.length > 0 ? (
          <>
            <div className="experiences-grid">
              {experiences.map((experience) => (
                <ExperienceCard
                  key={experience._id}
                  experience={experience}
                  onClick={() => handleCardClick(experience._id)}
                />
              ))}
            </div>

            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={page === 1 ? 'disabled' : ''}
              >
                Anterior
              </button>
              <span className="page-info">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(p + 1, pagination.pages || p + 1))
                }
                disabled={page >= (pagination.pages || page)}
                className={page >= (pagination.pages || page) ? 'disabled' : 'btn-next'}
              >
                Próxima
              </button>
            </div>
          </>
        ) : (
          <div className="no-results">
            <p>Nenhuma experiência encontrada com os filtros selecionados.</p>
            <button
              className="btn-primary"
              onClick={() =>
                setFilters({
                  procedure: '',
                  type: '',
                  minComplexity: '',
                  maxPrice: '',
                  city: '',
                })
              }
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Experiences;

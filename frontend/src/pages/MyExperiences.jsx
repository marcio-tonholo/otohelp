import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { experienceAPI } from '../api/client';
import ExperienceCard from '../components/ExperienceCard';
import ExperienceEditModal from '../components/ExperienceEditModal';
import './MyExperiences.css';

const MyExperiences = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingExperience, setEditingExperience] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user && user.userType !== 'mentor') {
      navigate('/');
      return;
    }
    fetchMyExperiences();
  }, [isAuthenticated, user, navigate]);

  const fetchMyExperiences = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await experienceAPI.getAllExperiences({
        mentor: user._id,
        sort: '-scheduledDate',
      });
      setExperiences(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar experiências');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/experience/${id}`);
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
    setIsEditModalOpen(true);
  };

  const handleSaveExperience = async (updatedData) => {
    setIsSaving(true);
    setError('');
    try {
      await experienceAPI.updateExperience(editingExperience._id, updatedData);
      setSuccessMessage('Experiência atualizada com sucesso! Alunos inscritos foram notificados.');
      setIsEditModalOpen(false);
      setEditingExperience(null);
      await fetchMyExperiences();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar experiência');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingExperience(null);
  };

  return (
    <div className="my-experiences-page">
      <div className="container">
        <div className="header">
          <h1>Minhas Experiências</h1>
          <button
            className="btn-primary"
            onClick={() => navigate('/create-experience')}
          >
            + Nova Experiência
          </button>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {error && <div className="error-message">{error}</div>}
        {isLoading ? (
          <div className="loading">Carregando...</div>
        ) : experiences.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não criou nenhuma experiência.</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/create-experience')}
            >
              Criar primeira experiência
            </button>
          </div>
        ) : (
          <div className="experiences-grid">
            {experiences.map((exp) => (
              <div key={exp._id} className="experience-card-container">
                <div
                  className="experience-card-wrapper"
                  onClick={() => handleCardClick(exp._id)}
                >
                  <ExperienceCard experience={exp} />
                </div>
                <div className="card-actions">
                  <button
                    className="btn-small btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditExperience(exp);
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditModalOpen && editingExperience && (
        <ExperienceEditModal
          experience={editingExperience}
          onSave={handleSaveExperience}
          onClose={handleCloseModal}
          isLoading={isSaving}
        />
      )}
    </div>
  );
};

export default MyExperiences;

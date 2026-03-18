import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mentorAPI, experienceAPI } from '../api/client';
import ExperienceCard from '../components/ExperienceCard';
import './MentorDetail.css';

const MentorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMentorDetail();
  }, [id]);

  const fetchMentorDetail = async () => {
    setIsLoading(true);
    setError('');
    try {
      const mentorResponse = await mentorAPI.getMentorById(id);
      setMentor(mentorResponse.data.data);

      // Buscar experiências do mentor
      const expResponse = await mentorAPI.getMentorProcedures(id);
      setExperiences(expResponse.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Erro ao carregar detalhes do mentor'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mentor-detail-page">
        <div className="container">
          <div className="loading">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mentor-detail-page">
        <div className="container">
          <div className="error-message">{error}</div>
          <button className="btn-primary" onClick={() => navigate('/mentors')}>
            Voltar para Mentores
          </button>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="mentor-detail-page">
        <div className="container">
          <p>Mentor não encontrado</p>
          <button className="btn-primary" onClick={() => navigate('/mentors')}>
            Voltar para Mentores
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mentor-detail-page">
      <div className="container">
        <button className="btn-back" onClick={() => navigate('/mentors')}>
          ← Voltar para Mentores
        </button>

        {/* Card do Mentor */}
        <div className="mentor-header">
          <div className="mentor-info">
            <h1>{mentor.name}</h1>
            <p className="specialization">{mentor.specialization}</p>
            <p className="experience">
              {mentor.yearsOfExperience} anos de experiência
            </p>

            <div className="mentor-stats">
              <div className="stat">
                <span className="label">Procedimentos</span>
                <span className="value">{experiences.length}</span>
              </div>
              <div className="stat">
                <span className="label">Taxa de Aprovação</span>
                <span className="value">98%</span>
              </div>
              <div className="stat">
                <span className="label">Alunos Formados</span>
                <span className="value">45+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio do Mentor */}
        <div className="mentor-bio">
          <h2>Sobre o Mentor</h2>
          <p>
            {mentor.description ||
              'Mentor especializado em ORL com vasta experiência em formação de cirurgiões.'}
          </p>
        </div>

        {/* Contato */}
        <div className="mentor-contact">
          <h3>Contato</h3>
          <div className="contact-info">
            <p>
              <strong>Email:</strong> {mentor.email}
            </p>
            <p>
              <strong>Telefone:</strong> {mentor.phone}
            </p>
            <p>
              <strong>CRM:</strong> {mentor.crm}/{mentor.crmState}
            </p>
          </div>
        </div>

        {/* Experiências do Mentor */}
        <div className="mentor-experiences">
          <h2>Experiências Disponíveis</h2>

          {experiences.length === 0 ? (
            <div className="empty-state">
              <p>Este mentor ainda não tem experiências disponíveis</p>
            </div>
          ) : (
            <div className="experiences-grid">
              {experiences.map((experience) => (
                <div
                  key={experience._id}
                  className="experience-card-wrapper"
                  onClick={() => navigate(`/experience/${experience._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <ExperienceCard experience={experience} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDetail;

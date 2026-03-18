import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { experienceAPI, bookingAPI, mentorAPI } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import './ExperienceDetail.css';

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [experience, setExperience] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    fetchExperienceDetail();
  }, [id]);

  const fetchExperienceDetail = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await experienceAPI.getExperienceById(id);
      const exp = response.data.data;
      setExperience(exp);

      // Buscar dados do mentor
      if (exp.mentor) {
        try {
          const mentorResponse = await mentorAPI.getMentorById(exp.mentor._id);
          setMentor(mentorResponse.data.data);
        } catch (err) {
          console.error('Erro ao carregar mentor:', err);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 'Erro ao carregar experiência'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.userType !== 'student') {
      setError('Apenas alunos podem se inscrever em experiências');
      return;
    }

    setIsBooking(true);
    setError('');
    setSuccessMessage('');

    try {
      const bookingData = {
        experienceId: id,
        message: bookingMessage,
      };

      await bookingAPI.createBooking(bookingData);
      setSuccessMessage('Inscrição realizada com sucesso! Aguarde aprovação do mentor.');
      setShowBookingForm(false);
      setBookingMessage('');
      
      // atualizar experiência para incluir novo booking
      await fetchExperienceDetail();
      // não redirecionar automaticamente para permitir chat

    } catch (err) {
      setError(
        err.response?.data?.error || 'Erro ao se inscrever na experiência'
      );
    } finally {
      setIsBooking(false);
    }
  };

  // after booking logic compute booking info for chat
  const isBooked = experience?.bookings?.some(
    (booking) =>
      booking.student._id === user?._id &&
      booking.status !== 'rejected'
  );

  const currentBooking = experience?.bookings?.find(
    (booking) =>
      booking.student._id === user?._id ||
      booking.mentor._id === user?._id,
  );

  const availableSlots =
    experience?.maxStudents - (experience?.bookings?.length || 0);
  const isFull = availableSlots <= 0;

  // chat
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  const loadMessages = async (bookingId) => {
    try {
      const resp = await bookingAPI.getMessages(bookingId);
      setMessages(resp.data.data || []);
    } catch (err) {
      console.error('erro ao carregar mensagens', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !currentBooking) return;
    try {
      await bookingAPI.addMessage(currentBooking._id, { text: newMsg });
      setNewMsg('');
      loadMessages(currentBooking._id);
    } catch (err) {
      console.error('erro enviando mensagem', err);
    }
  };

  useEffect(() => {
    if (currentBooking) loadMessages(currentBooking._id);
  }, [currentBooking]);

  if (isLoading) {
    return (
      <div className="experience-detail-page">
        <div className="container">
          <div className="loading">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error && !experience) {
    return (
      <div className="experience-detail-page">
        <div className="container">
          <div className="error-message">{error}</div>
          <button className="btn-primary" onClick={() => navigate('/experiences')}>
            Voltar para Experiências
          </button>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="experience-detail-page">
        <div className="container">
          <p>Experiência não encontrada</p>
          <button className="btn-primary" onClick={() => navigate('/experiences')}>
            Voltar para Experiências
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="experience-detail-page">
      <div className="container">
        <button
          className="btn-back"
          onClick={() => navigate(-1)}
        >
          ← Voltar
        </button>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {error && <div className="error-message">{error}</div>}

        <div className="detail-grid">
          {/* Coluna principal */}
          <div className="detail-main">
            {/* Título e Info Principal */}
            <div className="experience-header">
              <h1>{experience.title}</h1>
              <div className="header-meta">
                <span className="badge badge-type">{experience.type}</span>
                <span className="badge badge-complexity">
                  {experience.complexity}
                </span>
                <span className="badge badge-environment">
                  {experience.environment}
                </span>
              </div>
              <p className="procedure">{experience.procedure}</p>
            </div>

            {/* Descrição */}
            {experience.description && (
              <div className="section">
                <h2>Descrição</h2>
                <p>{experience.description}</p>
              </div>
            )}

            {/* Sobre o Mentor */}
            <div className="section mentor-section">
              <h2>Sobre o Mentor</h2>
              <div className="mentor-card">
                <div className="mentor-info">
                  <h3>{experience.mentor?.name}</h3>
                  <p className="mentor-spec">
                    {experience.mentor?.specialization}
                  </p>
                  <p className="mentor-exp">
                    {experience.mentor?.yearsOfExperience} anos de experiência
                  </p>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => navigate(`/mentor/${experience.mentor._id}`)}
                >
                  Ver Perfil Completo
                </button>
              </div>
            </div>

            {/* Detalhes Importantes */}
            <div className="section">
              <h2>Informações Importantes</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Data</span>
                  <span className="value">
                    {new Date(experience.scheduledDate).toLocaleDateString(
                      'pt-BR'
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Horário</span>
                  <span className="value">
                    {new Date(experience.scheduledDate).toLocaleTimeString(
                      'pt-BR',
                      { hour: '2-digit', minute: '2-digit' }
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Duração</span>
                  <span className="value">{experience.duration}h</span>
                </div>
                <div className="detail-item">
                  <span className="label">Local</span>
                  <span className="value">{experience.location?.hospital}</span>
                </div>
              </div>
            </div>

            {/* Endereço completo */}
            <div className="section">
              <h2>Localização</h2>
              <div className="location-info">
                <p>
                  <strong>Hospital/Clínica:</strong> {experience.location?.hospital}
                </p>
                <p>
                  <strong>Cidade:</strong> {experience.location?.city}
                </p>
                {experience.location?.address && (
                  <p>
                    <strong>Endereço:</strong> {experience.location?.address}
                  </p>
                )}
              </div>
            </div>

            {/* Pré-requisitos */}
            {experience.prerequisites && experience.prerequisites.length > 0 && (
              <div className="section">
                <h2>Pré-requisitos</h2>
                <ul className="requirements-list">
                  {experience.prerequisites.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Objetivos de Aprendizado */}
            {experience.learningOutcomes &&
              experience.learningOutcomes.length > 0 && (
                <div className="section">
                  <h2>O que você aprenderá</h2>
                  <ul className="outcomes-list">
                    {experience.learningOutcomes.map((outcome, idx) => (
                      <li key={idx}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          {/* Sidebar - Inscrição */}
          <aside className="detail-sidebar">
            <div className="booking-card">
              <div className="price-section">
                <span className="price-label">Valor</span>
                <span className="price-value">
                  R$ {experience.price?.toLocaleString('pt-BR')}
                </span>
                <small className="commission-info">
                  Mentores recebem 80% do valor
                </small>
              </div>

              <div className="slots-section">
                <div className="slot-info">
                  <span className="label">Vagas Disponíveis</span>
                  <span className={`value ${isFull ? 'full' : ''}`}>
                    {availableSlots} de {experience.maxStudents}
                  </span>
                </div>
                {isFull && (
                  <div className="full-notice">
                    Todas as vagas preenchidas
                  </div>
                )}
              </div>

              {/* Botão de Inscrição */}
              <div className="booking-actions">
                {!isAuthenticated ? (
                  <>
                    <p className="booking-hint">
                      Faça login para se inscrever
                    </p>
                    <button
                      className="btn-primary full-width"
                      onClick={() => navigate('/login')}
                    >
                      Fazer Login
                    </button>
                  </>
                ) : user?.userType === 'mentor' ? (
                  <p className="booking-hint">
                    Mentores não podem se inscrever em experiências
                  </p>
                ) : isBooked ? (
                  <div className="already-booked">
                    ✓ Você já está inscrito nesta experiência
                  </div>
                ) : isFull ? (
                  <p className="booking-hint">
                    Não há vagas disponíveis
                  </p>
                ) : (
                  <>
                    {!showBookingForm ? (
                      <button
                        className="btn-primary full-width"
                        onClick={() => setShowBookingForm(true)}
                      >
                        Se Inscrever Agora
                      </button>
                    ) : (
                      <form onSubmit={handleBooking} className="booking-form">
                        <div className="form-group">
                          <label htmlFor="message">Mensagem (opcional)</label>
                          <textarea
                            id="message"
                            value={bookingMessage}
                            onChange={(e) => setBookingMessage(e.target.value)}
                            placeholder="Conte ao mentor por que você quer participar..."
                            rows="3"
                            disabled={isBooking}
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn-primary full-width"
                          disabled={isBooking}
                        >
                          {isBooking ? 'Processando...' : 'Confirmar Inscrição'}
                        </button>
                        <button
                          type="button"
                          className="btn-secondary full-width"
                          onClick={() => setShowBookingForm(false)}
                          disabled={isBooking}
                        >
                          Cancelar
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>

              {/* Info adicional */}
              <div className="booking-info">
                <p>
                  <strong>Como funciona?</strong>
                </p>
                <ol>
                  <li>Clique em "Se Inscrever Agora"</li>
                  <li>O mentor avaliará seu perfil</li>
                  <li>Você receberá a confirmação por email</li>
                  <li>Participe da experiência na data agendada</li>
                </ol>
              </div>

              {/* Cancel booking */}
              {currentBooking && user?.userType === 'student' && (
                <button
                  className="btn-danger full-width"
                  style={{ marginTop: '10px' }}
                  onClick={async () => {
                    if (!window.confirm('Deseja cancelar sua inscrição?')) return;
                    try {
                      await bookingAPI.cancelBooking(currentBooking._id);
                      setSuccessMessage('Inscrição cancelada com sucesso');
                      await fetchExperienceDetail();
                    } catch (err) {
                      setError(err.response?.data?.error || 'Erro ao cancelar');
                    }
                  }}
                >
                  Cancelar Inscrição
                </button>
              )}

              {/* Chat entre aluno e mentor */}
              {currentBooking && (
                <div className="chat-section">
                  <h3>Chat da Reserva</h3>
                  <div className="chat-messages">
                    {messages.length === 0 ? (
                      <p className="chat-empty">Nenhuma mensagem ainda.</p>
                    ) : (
                      messages.map((m, idx) => (
                        <div
                          key={idx}
                          className={`chat-message ${
                            m.sender._id === user?._id ? 'mine' : 'theirs'
                          }`}
                        >
                          <span className="sender">{m.sender.name}</span>
                          <p className="text">{m.text}</p>
                          <span className="time">
                            {new Date(m.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="chat-form">
                    <textarea
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      placeholder="Escreva sua mensagem..."
                      rows="2"
                      disabled={isBooking}
                    />
                    <button type="submit" className="btn-primary full-width">
                      Enviar
                    </button>
                  </form>
                </div>
              )}
            </div> {/* fecha booking-card */}
            </aside>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
